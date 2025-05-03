import json
import pathlib
import os


class StyleConverter:

    def __init__(self):
        self.base_dir = pathlib.Path(os.path.abspath(__file__)).parent
        self.token_dir = self.base_dir.joinpath('token')
        self.style_dir = self.base_dir.joinpath('style')
        self.server_config_path = self.base_dir.joinpath('server/viuna_config.json')

    @staticmethod
    def read_json(path):
        with open(path, 'r') as f:
            return json.load(f)

    @staticmethod
    def save_json(path, data):
        with open(path, 'w') as f:
            json.dump(data, f)

    def get_token_files(self):
        # * گرفتن لیست فایل‌های توکن
        return list(self.token_dir.glob("*.json"))

    @staticmethod
    def replace_tokens_in_style(style_data, token_data):
        # * جایگزینی مقادیر توکن در style_data با داده‌های موجود در token_data
        token_keys = tuple(token_data.keys())
        for layer in style_data.get('layers', []):
            if 'paint' in layer:
                for k, v in layer['paint'].items():
                    if isinstance(v, list):
                        # * جایگزینی مقادیر لیستی
                        layer['paint'][k] = [token_data[i] if i in token_keys else i for i in v]
                    elif v in token_keys:
                        # * جایگزینی مقدار مستقیم
                        layer['paint'][k] = token_data[v]

    def apply_server_config(self, style_data, server_config):
        # * اضافه کردن پیکربندی سرور به استایل
        style_data["sources"] = server_config["sources"]
        style_data["sprite"] = server_config["sprite"]
        style_data["glyphs"] = server_config["glyphs"]

    def write_index_js_file(self, name, style_data):
        # * نوشتن فایل جاوااسکریپت با داده استایل
        js_path = self.base_dir.parents[2].joinpath(f'site/{name}.js')
        with open(js_path, 'w') as f:
            f.write("const theme=" + json.dumps(style_data))

    def generate_html_file(self, name):
        # * تولید فایل HTML بر اساس قالب base.html
        base_html_path = self.base_dir.parents[2].joinpath('site/base.html')
        target_html_path = self.base_dir.parents[2].joinpath(f'site/{name}.html')

        with open(base_html_path, 'r') as f:
            html_content = f.read()
        html_content = html_content.replace('__js__name__', f'{name}.js')

        with open(target_html_path, 'w') as f:
            f.write(html_content)

    def convert(self):
        # *تبدیل نهایی: خواندن توکن و استایل، جایگزینی مقادیر، ذخیره و تولید فایل‌های خروجی
        for token_path in self.get_token_files():
            token_data = self.read_json(token_path)
            style_data = self.read_json(self.style_dir.joinpath(token_path.name))

            self.replace_tokens_in_style(style_data, token_data)

            server_config = self.read_json(self.server_config_path)

            # * ذخیره استایل خام بدون کانفیگ سرور
            self.save_json(self.base_dir.parent.joinpath(token_path.name), style_data)

            # * اضافه کردن کانفیگ سرور
            self.apply_server_config(style_data, server_config)

            # * ذخیره استایل نهایی با کانفیگ سرور
            self.save_json(self.base_dir.parent.joinpath(f'server_{token_path.name}'), style_data)

            # * تولید فایل جاوااسکریپت
            self.write_index_js_file(token_path.stem, style_data)

            # * تولید فایل HTML
            self.generate_html_file(token_path.stem)


# * اجرای برنامه
StyleConverter().convert()
