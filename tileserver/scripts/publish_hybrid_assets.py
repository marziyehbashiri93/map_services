#!/usr/bin/env python3
"""Publish versioned hybrid style assets for Nginx delivery.

This script converts TileServer-local style files (that can contain
`mbtiles://{...}` source URLs) into static, client-ready style files for
hybrid deployment behind Nginx.

Output layout (under ``map_gateway/data/tileserver/`` — grouped by service for clarity):

  - ``map_gateway/data/tileserver/styles/v1/*.json``
  - ``map_gateway/data/tileserver/styles/v1/styles.json``
  - ``map_gateway/data/tileserver/sprite/v1/*``
  - ``map_gateway/data/tileserver/fonts/`` (copy of ``tileserver/fonts``)
"""

import json
import shutil
from pathlib import Path
from typing import Any, Dict


TILESERVER_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = TILESERVER_ROOT.parent
SOURCE_STYLES_DIR = TILESERVER_ROOT / "styles" / "server_local"
SPRITES_DIR = TILESERVER_ROOT / "sprites"
FONTS_DIR = TILESERVER_ROOT / "fonts"

# Gateway static tree for the tileserver-backed map stack (room for e.g. data/graphhopper/ later).
GATEWAY_DATA_TILESERVER = REPO_ROOT / "map_gateway" / "data" / "tileserver"
DIST_STYLES_V1 = GATEWAY_DATA_TILESERVER / "styles" / "v1"
DIST_SPRITE_V1 = GATEWAY_DATA_TILESERVER / "sprite" / "v1"
DIST_FONTS = GATEWAY_DATA_TILESERVER / "fonts"


def ensure_clean_dir(path: Path) -> None:
    """Recreate a directory from scratch.

    Args:
        path: Absolute or relative path that should be emptied and recreated.
    """
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def transform_style(style_obj: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a style object to hybrid-compatible URLs.

    Mutations performed:
      - Force `glyphs` endpoint to `/fonts/{fontstack}/{range}.pbf`.
      - Force `sprite` endpoint to `/sprite/v1/sprite`.
      - Convert source URLs from `mbtiles://{name}` to `/data/name.json`.

    Args:
        style_obj: Parsed MapLibre style object loaded from JSON.

    Returns:
        The mutated style object with hybrid-ready URL values.
    """
    style_obj["glyphs"] = "/fonts/{fontstack}/{range}.pbf"
    style_obj["sprite"] = "/sprite/v1/sprite"

    sources = style_obj.get("sources", {})
    for source_obj in sources.values():
        url = source_obj.get("url")
        if isinstance(url, str) and url.startswith("mbtiles://{") and url.endswith("}"):
            mbtile_name = url[len("mbtiles://{") : -1]
            source_obj["url"] = f"/data/{mbtile_name}.json"
    return style_obj


def main() -> None:
    """Build and publish versioned style/sprite/font artifacts for map_gateway."""
    ensure_clean_dir(GATEWAY_DATA_TILESERVER)
    DIST_STYLES_V1.mkdir(parents=True, exist_ok=True)
    DIST_SPRITE_V1.mkdir(parents=True, exist_ok=True)

    style_catalog = {"version": "v1", "styles": []}
    style_files = sorted(SOURCE_STYLES_DIR.glob("*.json"))

    for style_file in style_files:
        with style_file.open("r", encoding="utf-8") as f:
            style_obj = json.load(f)

        style_obj = transform_style(style_obj)
        out_path = DIST_STYLES_V1 / style_file.name
        with out_path.open("w", encoding="utf-8") as f:
            json.dump(style_obj, f, ensure_ascii=False, separators=(",", ":"))

        style_name = style_file.stem
        style_catalog["styles"].append(
            {
                "name": style_name,
                "title": style_obj.get("name", style_name),
                "url": f"/styles/v1/{style_file.name}",
            }
        )

    for filename in ("sprite.json", "sprite@2x.json", "sprite.png", "sprite@2x.png"):
        src = SPRITES_DIR / filename
        if src.exists():
            shutil.copy2(src, DIST_SPRITE_V1 / filename)

    with (DIST_STYLES_V1 / "styles.json").open("w", encoding="utf-8") as f:
        json.dump(style_catalog, f, ensure_ascii=False, indent=2)

    if FONTS_DIR.is_dir():
        shutil.copytree(FONTS_DIR, DIST_FONTS, dirs_exist_ok=True)
    else:
        DIST_FONTS.mkdir(parents=True, exist_ok=True)

    print(f"Published {len(style_files)} styles into {GATEWAY_DATA_TILESERVER}")


if __name__ == "__main__":
    main()
