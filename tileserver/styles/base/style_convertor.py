import json
import pathlib
import os
import copy


class StyleConverter:
    STYLE_VARIANTS = ("public", "admin")
    SERVER_TEMPLATE_FILE = "_template.json"

    def __init__(self):
        self.base_dir = pathlib.Path(os.path.abspath(__file__)).parent
        self.token_dir = self.base_dir.joinpath("token")
        self.style_dir = self.base_dir.joinpath("style")
        self.server_dir = self.base_dir.joinpath("server")
        self.output_style_dir = self.base_dir.parent
        self.site_dir = self.base_dir.parents[2].joinpath("site")

    @staticmethod
    def read_json(path):
        with open(path, "r") as f:
            return json.load(f)

    @staticmethod
    def save_json(path, data):
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as f:
            json.dump(data, f)

    @classmethod
    def split_name_and_variant(cls, file_path):
        stem = file_path.stem
        for variant in cls.STYLE_VARIANTS:
            suffix = f"_{variant}"
            if stem.endswith(suffix):
                return stem[:-len(suffix)], variant
        return stem, None

    def get_token_groups(self):
        token_groups = {}
        for token_path in sorted(self.token_dir.glob("*.json")):
            token_name, token_variant = self.split_name_and_variant(token_path)
            token_groups.setdefault(token_name, {})[token_variant or "default"] = token_path
        return token_groups

    def get_style_templates(self):
        template_groups = {}
        for style_path in sorted(self.style_dir.rglob("*.json")):
            template_name, template_variant = self.split_name_and_variant(style_path)
            if template_variant not in self.STYLE_VARIANTS:
                continue

            # Use folder path in the key to support future nested configuration folders.
            relative_parent = style_path.relative_to(self.style_dir).parent
            if relative_parent == pathlib.Path("."):
                group_key = template_name
            else:
                group_key = f"{relative_parent.as_posix().replace('/', '_')}_{template_name}"
            template_groups.setdefault(group_key, {})[template_variant] = style_path
        return template_groups

    def get_server_configs(self):
        configs = {}
        for config_path in sorted(self.server_dir.glob("*.json")):
            if config_path.name == self.SERVER_TEMPLATE_FILE:
                continue
            config_name = config_path.stem
            configs[config_name] = self.read_json(config_path)
        return configs

    def get_server_template(self):
        template_path = self.server_dir.joinpath(self.SERVER_TEMPLATE_FILE)
        if not template_path.exists():
            raise RuntimeError(f"Server template not found: {template_path}")
        return self.read_json(template_path)

    @staticmethod
    def resolve_variant_data(group_paths, variant):
        if variant in group_paths:
            return group_paths[variant]
        if "default" in group_paths:
            return group_paths["default"]
        return next(iter(group_paths.values()))

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

    @staticmethod
    def replace_placeholders(data, replacements):
        if isinstance(data, dict):
            return {k: StyleConverter.replace_placeholders(v, replacements) for k, v in data.items()}
        if isinstance(data, list):
            return [StyleConverter.replace_placeholders(i, replacements) for i in data]
        if isinstance(data, str):
            replaced = data
            for key, value in replacements.items():
                replaced = replaced.replace(key, value)
            return replaced
        return data

    def build_server_config(self, server_template, config_data):
        if {"sources", "sprite", "glyphs"}.issubset(config_data.keys()):
            return config_data

        replacements = config_data.get("replacements")
        if replacements is None:
            base_url = config_data.get("base_url")
            if not base_url:
                # raise RuntimeError(
                #     "Server config must provide either full style values or `base_url`/`replacements`."
                # )
                replacements = {"__BASE_URL__/": ""}
                server_template["sources"] = {
                    "static_road": {
                        "url": "mbtiles://{static_road}",
                        "type": "vector",
                        "maxzoom": 18
                    },
                    "static_complication": {
                        "url": "mbtiles://{static_complication}",
                        "type": "vector",
                        "maxzoom": 18
                    },
                    "static_admin_division": {
                        "url": "mbtiles://{static_admin_division}",
                        "type": "vector",
                        "maxzoom": 18
                    },
                    "static_landuse": {
                        "url": "mbtiles://{static_landuse}",
                        "type": "vector",
                        "maxzoom": 18
                    }
                }

            else:
                replacements = {"__BASE_URL__": base_url}

        return self.replace_placeholders(copy.deepcopy(server_template), replacements)

    def write_index_js_file(self, name, style_data):
        # * نوشتن فایل جاوااسکریپت با داده استایل
        js_path = self.site_dir.joinpath(f"{name}.js")
        with open(js_path, "w") as f:
            f.write("const theme=" + json.dumps(style_data))

    def generate_html_file(self, name):
        # * تولید فایل HTML بر اساس قالب base.html
        base_html_path = self.site_dir.joinpath("base.html")
        target_html_path = self.site_dir.joinpath(f"{name}.html")

        with open(base_html_path, "r") as f:
            html_content = f.read()
        html_content = html_content.replace("__js__name__", f"{name}.js")

        with open(target_html_path, "w") as f:
            f.write(html_content)

    @staticmethod
    def sanitize_style_name(name):
        return name.replace("/", "_")

    def convert(self):
        # *تبدیل نهایی: تولید استایل‌ها با کشف پویا از توکن‌ها و کانفیگ‌های سرور
        token_groups = self.get_token_groups()
        template_groups = self.get_style_templates()
        server_template = self.get_server_template()
        server_configs = self.get_server_configs()

        if not token_groups:
            raise RuntimeError(f"No token files found in {self.token_dir}")
        if not template_groups:
            raise RuntimeError(f"No style templates found in {self.style_dir}")
        if not server_configs:
            raise RuntimeError(f"No server configs found in {self.server_dir}")

        default_template_name = next(iter(template_groups.keys()))
        primary_server_name = "viuna" if "viuna" in server_configs else next(iter(server_configs.keys()))

        for token_name, token_group in token_groups.items():
            template_name = token_name if token_name in template_groups else default_template_name
            template_group = template_groups[template_name]

            for variant in self.STYLE_VARIANTS:
                if variant not in template_group:
                    continue

                token_path = self.resolve_variant_data(token_group, variant)
                style_path = template_group[variant]
                token_data = self.read_json(token_path)
                style_data = self.read_json(style_path)

                self.replace_tokens_in_style(style_data, token_data)
                style_name = self.sanitize_style_name(f"{token_name}_{variant}")

                for config_name, server_config in server_configs.items():
                    server_style_data = copy.deepcopy(style_data)
                    resolved_server_config = self.build_server_config(server_template, server_config)
                    self.apply_server_config(server_style_data, resolved_server_config)

                    config_style_dir = self.output_style_dir.joinpath(f"server_{config_name}")
                    self.save_json(config_style_dir.joinpath(f"{style_name}.json"), server_style_data)

                    if config_name == primary_server_name:
                        self.write_index_js_file(style_name, server_style_data)
                        self.generate_html_file(style_name)

        print("done")


# * اجرای برنامه
StyleConverter().convert()
