"""Generate per-environment MapLibre styles from base templates and tokens."""

import argparse
import copy
import json
import pathlib


class StyleConverter:
    """Convert tokenized base styles into server-specific style JSON files."""

    STYLE_VARIANTS = ("public", "admin")
    SERVER_TEMPLATE_FILE = "_template.json"

    DEFAULT_TILEJSON_BOUNDS = [44.033126, 25.063607, 63.317784, 39.783728]

    def __init__(self):
        """Set all filesystem paths required for style generation."""
        self.base_dir = pathlib.Path(__file__).resolve().parent
        self.token_dir = self.base_dir.joinpath("token")
        self.style_dir = self.base_dir.joinpath("style")
        self.server_dir = self.base_dir.joinpath("server")
        self.output_style_dir = self.base_dir.parent
        self.tileserver_dir = self.base_dir.parents[1]

    def default_tileserver_config_path(self):
        """Return default tileserver config path."""
        return self.tileserver_dir.joinpath("config.json")

    def update_tileserver_styles_config(self, style_names, config_path=None):
        """Rewrite tileserver `styles` section with generated style names only."""
        path = pathlib.Path(config_path) if config_path else self.default_tileserver_config_path()
        if not path.is_file():
            raise RuntimeError(f"Tileserver config not found: {path}")

        config = self.read_json(path)
        prev_styles = config.get("styles") or {}
        default_bounds = None
        for entry in prev_styles.values():
            bounds = (entry.get("tilejson") or {}).get("bounds")
            if bounds:
                default_bounds = bounds
                break
        if default_bounds is None:
            default_bounds = list(self.DEFAULT_TILEJSON_BOUNDS)

        new_styles = {}
        for name in style_names:
            prev = prev_styles.get(name, {})
            bounds = (prev.get("tilejson") or {}).get("bounds") or default_bounds
            new_styles[name] = {
                "style": f"{name}.json",
                "tilejson": {"bounds": bounds},
            }
        config["styles"] = new_styles

        with open(path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
            f.write("\n")

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
        for variant in cls.STYLE_VARIANTS:
            suffix = f"_{variant}"
            if stem.endswith(suffix):
                return stem[:-len(suffix)], variant
        return stem, None

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
            return config_data

        replacements = config_data.get("replacements")
        if replacements is None:
            base_url = config_data.get("base_url")
            if not base_url:
                replacements = {"__BASE_URL__": ""}
                template_with_local_sources = copy.deepcopy(server_template)
                template_with_local_sources["sources"] = {
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
                return self.replace_placeholders(template_with_local_sources, replacements)
            else:
                replacements = {"__BASE_URL__": base_url}

        return self.replace_placeholders(copy.deepcopy(server_template), replacements)

    @staticmethod
    def sanitize_style_name(name):
        """Convert style name to a filesystem-safe format."""
        return name.replace("/", "_")

    @staticmethod
    def filter_style_names(style_names, scope):
        """Filter generated styles by variant scope for tileserver config."""
        if scope == "all":
            return style_names
        if scope == "public":
            return [name for name in style_names if name.endswith("_public")]
        if scope == "admin":
            return [name for name in style_names if name.endswith("_admin")]
        raise RuntimeError(f"Unsupported style scope: {scope}")

    def convert(
        self,
        update_tileserver_config=False,
        tileserver_config_path=None,
        tileserver_style_scope="all",
    ):
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

        generated_style_names = []

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
                self.apply_style_identity(style_data, style_name)
                if update_tileserver_config and style_name not in generated_style_names:
                    generated_style_names.append(style_name)

                for config_name, server_config in server_configs.items():
                    server_style_data = copy.deepcopy(style_data)
                    resolved_server_config = self.build_server_config(server_template, server_config)
                    self.apply_server_config(server_style_data, resolved_server_config)

                    config_style_dir = self.output_style_dir.joinpath(f"server_{config_name}")
                    self.save_json(config_style_dir.joinpath(f"{style_name}.json"), server_style_data)

        if update_tileserver_config:
            self.update_tileserver_styles_config(
                self.filter_style_names(generated_style_names, tileserver_style_scope),
                tileserver_config_path,
            )

        print("done")


def _parse_args():
    """Parse CLI arguments for style generation."""
    parser = argparse.ArgumentParser(
        description="Generate MapLibre style JSON per server from base templates."
    )
    parser.add_argument(
        "--update-tileserver-config",
        dest="update_tileserver_config",
        action="store_true",
        help=(
            "Rewrite tileserver config.json 'styles' to list every generated style "
            '(each entry uses "style": "<name>.json" only, no server_* path). '
            "Disabled by default."
        ),
    )
    parser.add_argument(
        "--no-update-tileserver-config",
        dest="update_tileserver_config",
        action="store_false",
        help="Skip rewriting tileserver config.json styles section.",
    )
    parser.set_defaults(update_tileserver_config=False)
    parser.add_argument(
        "--tileserver-config",
        type=pathlib.Path,
        default=None,
        help="Path to tileserver config.json (default: <tileserver>/config.json).",
    )
    parser.add_argument(
        "--tileserver-style-scope",
        choices=("public", "admin", "all"),
        default="all",
        help=(
            "When rewriting config.json, which generated styles to register: "
            "public, admin, or all (default: all). Use public or admin if tileserver "
            "hits memory limits with many styles."
        ),
    )
    return parser.parse_args()


if __name__ == "__main__":
    _args = _parse_args()
    StyleConverter().convert(
        update_tileserver_config=_args.update_tileserver_config,
        tileserver_config_path=_args.tileserver_config,
        tileserver_style_scope=_args.tileserver_style_scope,
    )
