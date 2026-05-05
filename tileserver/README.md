# TileServer GL

> Serves vector tile files (`.mbtiles`) and map styles. Loopback-bound — all client traffic goes through the Nginx map gateway.

## Overview

TileServer GL runs from a pinned Docker image and exposes the tile API and style catalog on port `8080` (internal). Its host port `9090` is bound to `127.0.0.1` only. Running `style_convertor.py` generates server-specific styles and publishes them (along with sprites and fonts) directly into the Nginx gateway's static directory.

**This service creates the shared Docker network `map_services_net`. Always start it before `map_gateway`.**

## Prerequisites

- Docker and Docker Compose plugin
- Python 3 (for `style_convertor.py`)
- `.mbtiles` files placed in `tileserver/tiles/`
- `map_gateway` directory present at `../map_gateway/` (script writes assets there)

## Installation

```bash
cd tileserver

# Generate server-specific styles and publish assets to Nginx
python3 styles/base/style_convertor.py

# Start TileServer (also creates map_services_net)
docker compose up -d --build
```

After TileServer is up, start the gateway:

```bash
cd ../map_gateway
docker compose up -d --build
```

## Configuration

| File | Purpose |
|------|---------|
| `config.json` | Tile and style catalog served by TileServer GL |
| `styles/base/` | Token-based style sources (not mounted into container) |
| `styles/server_local/` | Generated styles mounted read-only into container |

Key `docker-compose.yml` settings:
- Port `127.0.0.1:9090:8080` — loopback only
- All mounts are read-only
- Health check enabled with `start_period: 30s`

## Usage

### Start

```bash
docker compose up -d --build
```

### Style update (no container restart needed)

```bash
# Regenerate styles and publish directly to Nginx
python3 styles/base/style_convertor.py

# Reload Nginx (not TileServer — styles are static files served by Nginx)
cd ../map_gateway
docker compose exec nginx nginx -s reload
```

### Stop

```bash
docker compose down
```

## Endpoints

| Endpoint | Access | Notes |
|----------|--------|-------|
| `http://127.0.0.1:9090` | Server loopback | Direct TileServer — admin and debug only |
| `http://127.0.0.1:8080` | Clients | Nginx hybrid gateway — all tile and style requests |

## Directory Structure

```text
tileserver/
├── Dockerfile                    # pinned image version
├── docker-compose.yml            # loopback port, read-only volumes, health check
├── config.json                   # tile + style catalog
├── fonts/                        # font stacks (mounted read-only)
├── sprites/                      # sprite sources
│   └── combine_images.py         # builds sprite sheets from PNG icons
├── styles/
│   ├── base/                     # token + template sources (not mounted)
│   │   └── style_convertor.py    # generates server_local/ from base/ + tokens
│   └── server_local/             # generated output (mounted read-only)
├── tiles/                        # .mbtiles files (mounted read-only)
└── scripts/
    └── benchmark_hybrid_endpoints.sh
```

**Published asset location** — `style_convertor.py` writes nginx-ready assets to `../map_gateway/data/tileserver/`:

```text
map_gateway/data/tileserver/
├── styles/v1/*.json       # URL-rewritten style files
├── styles/v1/styles.json  # style catalog
├── sprite/v1/             # sprite sheets
└── fonts/                 # font stacks
```

## Troubleshooting

```bash
# Live logs
docker compose logs -f tileserver

# Health status
docker inspect --format='{{.State.Health.Status}}' tileserver

# Verify tile endpoint (direct)
curl http://127.0.0.1:9090/health

# Verify tile endpoint (via gateway)
curl -I http://127.0.0.1:8080/data/static_road.json | grep X-Cache-Status
```

## Related Documentation

- [TileServer production runbook](../docs/tileserver-production.md)
- [Hybrid architecture baseline](../docs/hybrid-baseline.md)
- [Security & performance analysis](../docs/analysis-report.md)
- [HA architecture guide](../docs/ha-recommendation.md)
