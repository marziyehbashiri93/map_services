import logging
import os
from os import path

from config.config_reader import config_parser
from .file_management import FileManagement
from .subprocess import subprocess_popen_live

logger = logging.getLogger(__name__)


class MbTileGenerator:
    def __init__(self, output_dir: path,
                 layer_data: dict = None,
                 db_section_name: str = 'main_database'
                 ):

        self.config = config_parser()
        self.db_param = self.config[db_section_name]
        self.recursive_counter = 0

        self.output_dir = output_dir

        self.mbtile_dir = FileManagement(base_dir=output_dir, name='mbtile').create_directory()
        self.geojson_dir = FileManagement(base_dir=output_dir, name='geojson').create_directory()

        if layer_data:
            self.layer_data = layer_data

            self.table_name = layer_data.get('table_name')

            self.geojson_path = path.join(self.geojson_dir, layer_data.get('mbtile_name') + '_tmp') + '.geojson'
            self.ndgeojson_path = path.join(self.geojson_dir, layer_data.get('mbtile_name')) + '.geojson'
            self.mbtile_path = path.join(self.mbtile_dir, layer_data.get('mbtile_name')) + '.mbtile'

    def table_to_geojson(self):
        ogr_cmd = 'ogr2ogr -f "GeoJSON" -overwrite ' + self.geojson_path
        database_params = "PG:host=" + self.db_param['host'] + " port=" + self.db_param['port'] + " dbname=" + \
                          self.db_param['dbname'] \
                          + " user=" + self.db_param['user'] + " password=" + self.db_param['password']

        # query parameter from database including name of table and fields.
        if self.layer_data['sql_query']:
            sql_cmd = self.layer_data['sql_query']
        else:
            sql_cmd = f'SELECT * FROM {self.db_param["schema"]}."{self.table_name}"'

        projection = '-a_srs EPSG:3857'  # output SRS without re projecting
        datetime_to_str = '-fieldTypeToString DateTime'  # convert datetime to string ogr2ogr warn for datetime
        cmd = f'''echo routaa | {ogr_cmd} "{database_params}" -sql '{sql_cmd}' {projection} {datetime_to_str}'''
        subprocess_popen_live(f'{cmd}')

        file_size = FileManagement(path=self.geojson_path).get_size()
        logger.info(f'Create {self.table_name}.geojson with size {file_size} MB')

        if file_size == 0:
            if self.recursive_counter <= 3:
                logger.warning(f'Try again to create {self.table_name}.geojson')
                self.recursive_counter += 1
                self.table_to_geojson()
            else:
                raise Exception(f'Cannot get {self.table_name}.geojson')
        self.recursive_counter += 0

    def geojson_to_ndgeojson(self):
        # we need ndgeojson for run tippecanoe parallel when create mbtile
        cmd = f'tippecanoe-json-tool {self.geojson_path} >{self.ndgeojson_path} '
        subprocess_popen_live(f'{cmd}')
        logger.info(f'Convert  {self.table_name} geojson to ndgeojson')

    def table_to_ndgeojson(self):
        self.table_to_geojson()
        self.geojson_to_ndgeojson()
        FileManagement(path=self.geojson_path).remove_file()

    def ndgeojson_to_mbtile(self):
        # -f or --force: Remove out.mbtiles if it already exists
        # --read-parallel: Use multiple threads to read different parts of each GeoJSON
        # --drop-densest-as-needed: If a tile is too large, try to reduce it to under 500K by increasing /
        # the minimum spacing between features. The discovered spacing applies to the entire zoom level.
        # --exclude: Exclude the named attributes from all features
        cmd = f'tippecanoe -z{self.layer_data["maxZoom"]} -Z{self.layer_data["minZoom"]}  --force -o {self.mbtile_path}' \
              f' --read-parallel --no-tile-size-limit --exclude last_edited_date  {self.ndgeojson_path} -s EPSG:3857 '
        if self.table_name.startswith('admin_') or self.table_name == 'poi' or self.table_name == 'label_object' \
                or self.table_name == 'routaa_point' or self.table_name == 'public_transport' or self.table_name == 'complication' \
                or self.table_name == 'violation_camera' or self.table_name == 'police' or self.table_name == 'complex_service':
            # set this parameter for show all point in zoom level 6
            # -B zoom or --base-zoom=zoom: Base zoom, the level at and above which all points are included in the tiles (default maxzoom).
            # If you use -Bg, it will guess a zoom level that will keep at most 50,000 features in the densest tile.
            # You can also specify a marker-width with -Bgwidth to allow fewer features in the densest tile to compensate for the larger marker, or -Bfnumber to allow at most number features in the densest tile.
            cmd += f' --base-zoom={self.layer_data["minZoom"]}'
        elif self.table_name.startswith('parcel_cen'):
            cmd += f' --maximum-tile-features=1000000 --maximum-tile-bytes=3500000'

        subprocess_popen_live(f'echo routaa | {cmd}')
        file_size = FileManagement(path=self.mbtile_path).get_size()
        logger.info(f'Create {self.table_name}.mbtile with size {file_size} MB')
        if file_size == 0:
            if self.recursive_counter <= 3:
                logger.warning(f'Try again to create {self.table_name}.mbtile')
                self.recursive_counter += 1
                self.ndgeojson_to_mbtile()
            else:
                raise Exception(f'Cannot get {self.table_name}.geojson')
        self.recursive_counter += 0

    def merge_mbtiles(self, group_layer_name: str, join_layer: list):
        logger.info(f'Going merge mbtiles...')
        join_layer_path = [path.join(self.mbtile_dir, i + ".mbtile") for i in join_layer]
        cmd = f'tile-join --force -pk -o {path.join(self.mbtile_dir, group_layer_name + ".mbtile")} {" ".join(join_layer_path)}'
        subprocess_popen_live(f'echo routaa | {cmd}')
        file_size = FileManagement(self.mbtile_path).get_size()
        logger.info(f'merge {group_layer_name}.mbtile with size {file_size} MB')

    # this method for remove unnecessary mbtile
    def remove_single_mbtiles(self):
        from json import loads
        all_layer_join_data = {}
        for config_section in [i for i in list(self.config.keys()) if i != 'main_database' and i != 'DEFAULT']:
            layers_join_data: dict = loads(self.config[config_section]['join_layer'])
            all_layer_join_data.update(layers_join_data)

        mbtile_list = os.listdir(self.mbtile_dir)
        remove_list = set(mbtile_list) - set([i + '.mbtile' for i in all_layer_join_data.keys()])
        for mbtile_name in remove_list:
            FileManagement(base_dir=self.mbtile_dir, name=mbtile_name).remove_file()

    def remove_geojson_dir(self):
        FileManagement(path=self.geojson_dir).remove_directory()

    def check_exist_mbtile(self):
        return FileManagement(path=self.mbtile_path).is_exist()
