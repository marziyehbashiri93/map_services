import json
import pathlib
import xml.etree.ElementTree as ET


class StyleConvertor:

    def __init__(self):
        self.base_dir = pathlib.Path.cwd()
        self.token_dir = self.base_dir.joinpath('base/token')
        self.style_dir = self.base_dir.joinpath('base/style')
        self.sever_config_file = self.base_dir.joinpath('base/server/config.json')

    @staticmethod
    def open_json_file(path):
        with open(path, 'r') as f:
            return json.load(f)

    @staticmethod
    def write_json_to_file(path, data):
        with open(path, 'w') as f:
            f.write(json.dumps(data))

    def get_token_list(self):
        return list(self.token_dir.glob("*.json"))

    @staticmethod
    def token_replacer(style_data, token_data):
        token_keys = tuple(token_data.keys())
        for layer in style_data['layers']:
            if layer.get('paint'):
                paint = layer.get('paint')
                for k, v in paint.items():
                    if type(v) == list:
                        new_arr = []
                        for i in v:
                            if i in token_keys:
                                new_arr.append(token_data[i])
                            else:
                                new_arr.append(i)
                        paint[k] = new_arr
                    elif type(v) != list and v in token_keys:
                        paint[k] = token_data[v]

    def create_server_style(self, server_config, data):
        data["sources"] = server_config["sources"]
        data["sprite"] = server_config["sprite"]
        data["glyphs"] = server_config["glyphs"]

    def write_index_js(self, name, data):
        path = self.base_dir.parent.parent.joinpath(f'site/{name}.js')
        with open(path, 'w') as f:
            f.write("const theme=" + json.dumps(data))

    def write_html(self, name):
        base_html = self.base_dir.parent.parent.joinpath(f'site/base.html')
        new_html = self.base_dir.parent.parent.joinpath(f'site/{name}.html')

        with open(base_html, 'r') as f:
            html_data = f.read()
        html_data = html_data.replace('__js__name__', name + '.js')

        with open(new_html, 'w') as f:
            f.write(html_data)

    def convertor(self):
        for token_path in self.get_token_list():
            token_data = self.open_json_file(token_path)
            style_data = self.open_json_file(self.style_dir.joinpath(token_path.name))
            self.token_replacer(style_data, token_data)
            server_config_data = self.open_json_file(self.sever_config_file)
            self.write_json_to_file(self.base_dir.joinpath(token_path.name), style_data)
            self.create_server_style(server_config_data, style_data)
            self.write_json_to_file(self.base_dir.joinpath('server' + token_path.name), style_data)
            self.write_index_js(token_path.name, style_data)
            self.write_html(token_path.name)


StyleConvertor().convertor()
