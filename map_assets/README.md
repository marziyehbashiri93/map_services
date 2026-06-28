# Map Assets

Static map assets live here independently from the removed legacy tile service.

- `styles/`: base styles, color tokens, server presets, and generated style output.
- `sprites/`: source icons and generated MapLibre sprite files.
- `fonts/`: local glyph PBF files. This directory is ignored by git.

Generate gateway-ready assets with:

```bash
python3 map_assets/styles/base/style_convertor.py
```

The converter writes published assets to `map_gateway/data/map_assets/`.
