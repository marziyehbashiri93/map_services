# Tile Server

## Quick start (hybrid mode)

```bash
cd tileserver
python3 scripts/publish_hybrid_assets.py
docker compose up -d --build
cd ../map_gateway
docker compose up -d --build
```

The shared Docker network is named `map_services_net` (created by this compose file). Start **tileserver** before **map_gateway** the first time.

Published style/sprite/fonts for Nginx land in **`../map_gateway/data/tileserver/`** (not under `tileserver/`).

Endpoints:
- TileServer direct: `http://127.0.0.1:9090`
- Nginx hybrid gateway: `http://127.0.0.1:8080` (`map_gateway/docker-compose.yml`)

## Documentation

- Full production runbook:
  - `docs/tileserver-production.md`

## Project structure

```text
map_services/
├── map_gateway/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── nginx/
│   └── data/
│       └── tileserver/    # generated: styles/, sprite/, fonts/
└── tileserver/
    ├── Dockerfile
    ├── docker-compose.yml
    ├── config.json
    ├── fonts/
    ├── sprites/
    ├── styles/server_local/
    └── scripts/
        ├── publish_hybrid_assets.py
        └── benchmark_hybrid_endpoints.sh
```
