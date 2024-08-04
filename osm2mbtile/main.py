# Create your views here.
import logging
import os
import sys
from concurrent.futures import ProcessPoolExecutor
from datetime import timedelta
from functools import partial
from json import loads
from time import perf_counter_ns

from config.config_reader import config_parser
from tile_generator.file_management import FileManagement
from tile_generator.tile_generator import MbTileGenerator

logging.basicConfig(
    stream=sys.stdout,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s -> %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def process_create_mbtile(output_dir, layer):
    MbTileGenerator(output_dir, layer).table_to_ndgeojson()
    MbTileGenerator(output_dir, layer).ndgeojson_to_mbtile()


def process_merge_mbtile(output_dir, layer):
    if layer[1]:
        MbTileGenerator(output_dir).merge_mbtiles(layer[0], layer[1])


def main():
    # step 1: create geojson from geoserver tables
    # step 2: convert geojson to ndjson -> for use -p(parallel) option in tippecanoe
    # step 3:convert ndjson to mbtile with tippecanoe
    # step 4: marge mbtiles layer with tippecanoe
    # step 5 remove unnecessary file
    # ----create output dir if not exist ---------
    try:
        logger.info(f"Argument List:{str(sys.argv)}")
        start = perf_counter_ns()

        BASE_DIR = os.path.dirname(os.path.realpath(__file__))
        FileManagement(base_dir=BASE_DIR, name='output').remove_directory()
        output_dir = FileManagement(base_dir=BASE_DIR, name='output').create_directory()

        config = config_parser()
        config_section_key = [i for i in list(config.keys()) if i != 'main_database' and i != 'DEFAULT']

        if len(sys.argv) < 2:
            logger.info(f"Error: please send config section")
            raise ValueError

        config_section_key = [sys.argv[1]] if sys.argv[1].lower() != 'all' else config_section_key
        if config_section_key[0] not in config_section_key:
            logger.info(f"Error: please send correct config section")
            raise ValueError

        for config_section in config_section_key:
            layers: dict = loads(config[config_section]['layers'].replace('\n', ' '))
            layers_join_data: dict = loads(config[config_section]['join_layer'])

            logger.info(f' \n ********************** Going Create Mbtiles {config_section}********************** \n')
            with ProcessPoolExecutor(max_workers=4) as pool:
                pool.map(partial(process_create_mbtile, output_dir), layers)
            logger.info(' \n ********************** Create All Single Mbtiles ********************** \n')

            logger.info(' \n ********************** Double Check All File To Create ********************** \n')
            # Sometimes for some unknown reason ogr2ogr or tippecanoe won't create a file so double check all created layer to be sure
            for layer in layers:
                is_exist = MbTileGenerator(output_dir, layer).check_exist_mbtile()
                if not is_exist:
                    logger.info(f' \n !!!! {layer["table_name"]} doesnt have mbtile ,so create tile again !!!! \n')
                    process_create_mbtile(output_dir, layer)

            logger.info(' \n ********************** Going to marge Mbtiles ********************** \n')
            layer_join_list = list(layers_join_data.items())
            with ProcessPoolExecutor(max_workers=4) as pool:
                pool.map(partial(process_merge_mbtile, output_dir), layer_join_list)

        MbTileGenerator(output_dir).remove_single_mbtiles()
        MbTileGenerator(output_dir).remove_geojson_dir()

        stop = perf_counter_ns()
        logger.info(f"Elapsed time during the whole program {timedelta(microseconds=stop - start)}")
        logger.info(f' \n ********************** Finish Process ********************** \n')

    except Exception as e:
        logger.info(f"Error: {e}")
        raise ValueError


main()
