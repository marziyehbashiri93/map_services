# Map gateway (Nginx)

All paths in `docker-compose.yml` are relative to this directory.

- **`nginx/`** — configuration baked into the image via `Dockerfile` (rebuild after edits: `docker compose up -d --build`).
- **`data/tileserver/`** — published static assets for the map stack:
  - `styles/v1/`, `sprite/v1/`, `fonts/` — filled by `../tileserver/scripts/publish_hybrid_assets.py`.

Other services can get their own trees later, e.g. `data/graphhopper/`, without mixing files with tileserver.

Bring-up: start `../tileserver` first (creates `map_services_net`), then `docker compose up -d --build` here.
