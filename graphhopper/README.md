# GraphHopper

> Open-source routing service built from source using a custom Dockerfile. Processes Iran OSM PBF data and exposes a routing API on port `8989`.

## Overview

GraphHopper is built from the source in `graphhopper/graphhopper/` and run via Docker Compose. The routing graph is built from an Iran OSM PBF file on first start (15–30 minutes). Subsequent starts reuse the cached graph. The API port is loopback-bound; all external routing requests go through the Nginx gateway at `/graphhopper/`.

## Prerequisites

- Docker and Docker Compose plugin
- GraphHopper source cloned into `graphhopper/graphhopper/` (from the [official repo](https://github.com/graphhopper/graphhopper))
- Iran OSM PBF file placed in `data/` (download from [Geofabrik](https://download.geofabrik.de/asia/iran.html))
- Docker networks created:

```bash
docker network create map_services_net   # if not already created by TileServer
docker network create fleet-net
```

## Installation

### Build the Docker image

From the `graphhopper/` directory:

```bash
docker build -t graphhopper:latest .
```

To transfer the image to another server:

```bash
docker save -o graphhopper.tar graphhopper:latest
```

### Start the service

```bash
docker compose up -d --build
```

> **First start:** The routing graph is built from the Iran PBF file — this takes **15 to 30 minutes**. The health check `start_period` is set to 30 minutes; `docker inspect` will show `starting` during this window.

## Configuration

| Variable / File | Value | Description |
|-----------------|-------|-------------|
| `JAVA_OPTS` | `-Xms512m -Xmx5500m` | JVM heap — container limit is 6 GB, leaving 500 MB headroom |
| `deploy.resources.limits.memory` | `6G` | Must be larger than `-Xmx` |
| `config-example.yml` | mounted into container | GraphHopper routing profiles and graph settings |
| `graphhopper.sh` | mounted into container | Entrypoint wrapper script |

Admin interface listens on `127.0.0.1:8990` inside the container only (configured in `config-example.yml`).

## Usage

### Start

```bash
docker compose up -d --build
```

### Stop

```bash
docker compose down
```

### Rebuild routing graph (after OSM data update)

Delete the cached graph and restart:

```bash
rm -rf data/default-gh
docker compose up -d
```

## Endpoints

| Endpoint | Host Binding | Access |
|----------|-------------|--------|
| `http://graphhopper:8989` | — | From other containers via `map_services_net` |
| `http://127.0.0.1:8989` | loopback | Direct API access from the server |
| `http://<server>:8080/graphhopper/route` | public | Via Nginx gateway |
| `http://127.0.0.1:8990` | loopback | Admin API (metrics, thread dumps) — do not expose externally |

## Directory Structure

```text
graphhopper/
├── Dockerfile                  # builds from source in graphhopper/graphhopper/
├── docker-compose.yml          # loopback ports, memory limits, health check
├── config-example.yml          # routing profiles and graph configuration
├── graphhopper.sh              # container entrypoint wrapper
├── data/
│   ├── iran-latest.osm.pbf     # OSM input file
│   ├── default-gh/             # built routing graph (cached across restarts)
│   └── logs/                   # application logs
└── graphhopper/                # GraphHopper source (cloned from GitHub)
```

## Networks

| Network | Purpose |
|---------|---------|
| `map_services_net` | Inter-service requests from gateway to `graphhopper:8989` |
| `fleet-net` | Access to the fleet backend services |

## Troubleshooting

```bash
# Live logs
docker compose logs -f graphhopper

# Health status (JSON)
docker inspect --format='{{json .State.Health}}' graphhopper

# Direct API check from the server
curl http://127.0.0.1:8989/health

# Check graph build progress
docker compose logs graphhopper | grep -i "graph\|import\|finish"
```

## Related Documentation

- [Security & performance analysis](../docs/analysis-report.md)
- [Implementation report](../docs/implementation-report.md)
- [HA architecture guide](../docs/ha-recommendation.md)
