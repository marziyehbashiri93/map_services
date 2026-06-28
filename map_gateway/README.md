# Map gateway (Nginx)

All paths in `docker-compose.yml` are relative to this directory.

- **`nginx/`** — configuration baked into the image via `Dockerfile` (rebuild after edits: `docker compose up -d --build`).
- **`data/map_assets/`** — published static assets for the map stack:
  - `styles/v1/`, `sprite/v1/`, `fonts/` — filled by `../map_assets/styles/base/style_convertor.py`.

Other services can get their own trees later, e.g. `data/graphhopper/`, without mixing files with map assets.

Bring-up: make sure `map_services_net` exists, start Martin from `../mbtile_pipeline`, then run `docker compose up -d --build` here.
