"""Generate per-environment MapLibre styles from base templates and tokens."""

import argparse
import copy
import json
import pathlib
import shutil


class StyleConverter:
    """Convert tokenized base styles into server-specific style JSON files."""

    STYLE_VARIANTS = ("public", "admin")
    SERVER_TEMPLATE_FILE = "_template.json"

    def __init__(self):
        """Set all filesystem paths required for style generation."""
        self.base_dir = pathlib.Path(__file__).resolve().parent
        self.token_dir = self.base_dir.joinpath("token")
        self.style_dir = self.base_dir.joinpath("style")
        self.server_dir = self.base_dir.joinpath("server")
        self.output_style_dir = self.base_dir.parent
        self.assets_dir = self.base_dir.parents[1]
        self.gateway_assets_dir = self.assets_dir.parent / "map_gateway" / "data" / "map_assets"
        self.sprites_dir = self.assets_dir / "sprites"
        self.fonts_dir = self.assets_dir / "fonts"

    @staticmethod
    def read_json(path):
        """Read and deserialize a JSON file."""
        with open(path, "r") as f:
            return json.load(f)

    @staticmethod
    def save_json(path, data):
        """Serialize JSON to disk, creating parent directories when needed."""
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as f:
            json.dump(data, f)

    @classmethod
    def split_name_and_variant(cls, file_path):
        """Split file stem into `<base_name>` and style variant suffix."""
        stem = file_path.stem
        parts = stem.split("_")
        for variant in cls.STYLE_VARIANTS:
            if variant in parts:
                base_parts = parts.copy()
                base_parts.remove(variant)
                return "_".join(base_parts), variant
        return stem, None

    @staticmethod
    def get_theme(name):
        """Return theme suffix (`dark`/`light`) from a name when present."""
        for theme in ("dark", "light"):
            if name.endswith(f"_{theme}"):
                return theme
        return None

    def get_token_groups(self):
        """Group token files by token set name and variant."""
        token_groups = {}
        for token_path in sorted(self.token_dir.glob("*.json")):
            token_name, token_variant = self.split_name_and_variant(token_path)
            token_groups.setdefault(token_name, {})[token_variant or "default"] = token_path
        return token_groups

    def get_style_templates(self):
        """Group style template files by logical template name and variant."""
        template_groups = {}
        for style_path in sorted(self.style_dir.rglob("*.json")):
            template_name, template_variant = self.split_name_and_variant(style_path)
            if template_variant not in self.STYLE_VARIANTS:
                continue

            relative_parent = style_path.relative_to(self.style_dir).parent
            if relative_parent == pathlib.Path("."):
                group_key = template_name
            else:
                group_key = f"{relative_parent.as_posix().replace('/', '_')}_{template_name}"
            template_groups.setdefault(group_key, {})[template_variant] = style_path
        return template_groups

    def get_server_configs(self):
        """Load all server config files except the shared template file."""
        configs = {}
        for config_path in sorted(self.server_dir.glob("*.json")):
            if config_path.name == self.SERVER_TEMPLATE_FILE:
                continue
            config_name = config_path.stem
            configs[config_name] = self.read_json(config_path)
        return configs

    def get_server_template(self):
        """Load the shared server template used for placeholder replacement."""
        template_path = self.server_dir.joinpath(self.SERVER_TEMPLATE_FILE)
        if not template_path.exists():
            raise RuntimeError(f"Server template not found: {template_path}")
        return self.read_json(template_path)

    @staticmethod
    def resolve_variant_data(group_paths, variant):
        """Return exact variant data, then default, then first available value."""
        if variant in group_paths:
            return group_paths[variant]
        if "default" in group_paths:
            return group_paths["default"]
        return next(iter(group_paths.values()))

    @staticmethod
    def replace_tokens_in_style(style_data, token_data):
        """Replace token placeholders in layer paint values with real values."""
        token_keys = tuple(token_data.keys())
        for layer in style_data.get('layers', []):
            if 'paint' in layer:
                for k, v in layer['paint'].items():
                    if isinstance(v, list):
                        layer['paint'][k] = [token_data[i] if i in token_keys else i for i in v]
                    elif v in token_keys:
                        layer['paint'][k] = token_data[v]

    def apply_server_config(self, style_data, server_config):
        """Inject server-specific sources, sprite and glyph endpoints."""
        style_data["sources"] = server_config["sources"]
        style_data["sprite"] = server_config["sprite"]
        style_data["glyphs"] = server_config["glyphs"]

    @staticmethod
    def apply_style_identity(style_data, style_name):
        """Set style `id` and `name` fields to a stable generated value."""
        style_data["id"] = style_name
        style_data["name"] = style_name

    @staticmethod
    def replace_placeholders(data, replacements):
        """Recursively replace placeholder strings in nested dict/list structures."""
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
        """Build a concrete server config from template and config file content."""
        if {"sources", "sprite", "glyphs"}.issubset(config_data.keys()):
            return {k: v for k, v in config_data.items() if k != "output_to_gateway"}

        replacements = config_data.get("replacements")
        if replacements is None:
            base_url = config_data.get("base_url")
            replacements = {"__BASE_URL__": base_url or ""}

        return self.replace_placeholders(copy.deepcopy(server_template), replacements)

    @staticmethod
    def sanitize_style_name(name):
        """Convert style name to a filesystem-safe format."""
        return name.replace("/", "_")

    def _publish_gateway_assets(self, style_entries):
        """Copy sprites and fonts to the gateway and write the styles.json catalog."""
        gateway_styles_v1 = self.gateway_assets_dir / "styles" / "v1"
        gateway_sprite_v1 = self.gateway_assets_dir / "sprite" / "v1"
        gateway_fonts = self.gateway_assets_dir / "fonts"

        gateway_sprite_v1.mkdir(parents=True, exist_ok=True)
        if gateway_fonts.exists():
            shutil.rmtree(gateway_fonts)
        gateway_fonts.mkdir(parents=True, exist_ok=True)

        for filename in ("sprite.json", "sprite@2x.json", "sprite.png", "sprite@2x.png"):
            src = self.sprites_dir / filename
            if src.exists():
                shutil.copy2(src, gateway_sprite_v1 / filename)

        if self.fonts_dir.is_dir():
            shutil.copytree(self.fonts_dir, gateway_fonts, dirs_exist_ok=True)

        catalog = {"version": "v1", "styles": style_entries}
        with open(gateway_styles_v1 / "styles.json", "w", encoding="utf-8") as f:
            json.dump(catalog, f, ensure_ascii=False, indent=2)

    def convert(self):
        """Generate server style JSON files from token/style/template combinations."""
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
        default_template_by_theme = {}
        for template_name in template_groups:
            theme = self.get_theme(template_name)
            if theme and theme not in default_template_by_theme:
                default_template_by_theme[theme] = template_name

        gateway_configs = {n for n, c in server_configs.items() if c.get("output_to_gateway")}
        if gateway_configs:
            gateway_styles_dir = self.gateway_assets_dir / "styles" / "v1"
            if gateway_styles_dir.exists():
                shutil.rmtree(gateway_styles_dir)
            gateway_styles_dir.mkdir(parents=True, exist_ok=True)

        gateway_catalog_entries = []

        for token_name, token_group in token_groups.items():
            token_theme = self.get_theme(token_name)
            if token_name in template_groups:
                template_name = token_name
            elif token_theme in default_template_by_theme:
                template_name = default_template_by_theme[token_theme]
            else:
                template_name = default_template_name
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
                self.apply_style_identity(style_data, style_name)

                for config_name, server_config in server_configs.items():
                    server_style_data = copy.deepcopy(style_data)
                    resolved_server_config = self.build_server_config(server_template, server_config)
                    self.apply_server_config(server_style_data, resolved_server_config)

                    if server_config.get("output_to_gateway"):
                        config_style_dir = self.gateway_assets_dir / "styles" / "v1"
                        gateway_catalog_entries.append({
                            "name": style_name,
                            "title": server_style_data.get("name", style_name),
                            "url": f"/styles/v1/{style_name}.json",
                        })
                    else:
                        config_style_dir = self.output_style_dir.joinpath(f"server_{config_name}")
                    self.save_json(config_style_dir.joinpath(f"{style_name}.json"), server_style_data)

        if gateway_catalog_entries:
            self._publish_gateway_assets(gateway_catalog_entries)

        print("done")


def _parse_args():
    """Parse CLI arguments for style generation."""
    parser = argparse.ArgumentParser(
        description="Generate MapLibre style JSON per server from base templates."
    )
    return parser.parse_args()


if __name__ == "__main__":
    _parse_args()
    StyleConverter().convert()
