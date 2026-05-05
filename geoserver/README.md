# GeoServer

> Publishes spatial data layers (WMS, WMTS, WFS) via the official `docker.osgeo.org/geoserver` image. Consumed by TileServer and other map clients.

## Overview

GeoServer runs as an optional service in the map stack. It is accessed from within the Docker network at `geoserver:8080` and from outside via the Nginx gateway at `/geoserver/`. The JVM runs inside the container — no Java installation is required on the host.

## Prerequisites

- Docker and Docker Compose plugin
- Both Docker networks must exist:

```bash
docker network create map_services_net   # shared with tileserver/gateway/graphhopper
docker network create fleet-net          # fleet backend integration
```

- If running on SELinux (Fedora/RHEL/CentOS), the `:Z` volume label is already set in `docker-compose.yml`.

## Installation

### 1. Create data directories

All volume paths are relative to the `geoserver/` directory:

```bash
cd geoserver
mkdir -p data/geoserver_data data/additional_libs data/tomcat/conf
sudo chown -R "$USER:$USER" data
```

| Host Path (relative) | Purpose |
|----------------------|---------|
| `./data/geoserver_data` | GeoServer data and workspace configuration |
| `./data/additional_libs` | Extra JARs and plugins |
| `./data/tomcat/conf` | Tomcat configuration (e.g. JNDI) |

### 2. Start the service

```bash
docker compose up -d --build
```

## Configuration

| Variable | Description |
|----------|-------------|
| `GEOSERVER_VERSION` | GeoServer version — must match in both `docker-compose.yml` and `Dockerfile` |
| `EXTRA_JAVA_OPTS` | JVM flags (e.g. `-Xms256m -Xmx1g`) — `deploy.resources.limits.memory` must be larger than `-Xmx` |
| `CORS_ENABLED` | Set to `true` to enable CORS |
| `CORS_ALLOWED_ORIGINS` | Restrict allowed origins once domain is known (see CORS section below) |
| `STABLE_EXTENSIONS` | Extensions to install at startup (e.g. `oracle,vectortiles`) |

Logs are automatically rotated (`max-size: 100m`, `max-file: 5`).

## Usage

### Start

```bash
docker compose up -d --build
```

### Stop

```bash
docker compose down
```

### Reload / restart

GeoServer does not support a live reload — restart the container after configuration changes:

```bash
docker compose restart geoserver
```

## Endpoints

| Endpoint | Access | Notes |
|----------|--------|-------|
| `http://geoserver:8080/geoserver/` | Docker network | From other containers via `map_services_net` |
| `http://<server>:8090/geoserver` | Host | Direct host access |
| `http://<server>:8080/geoserver/` | Public | Via Nginx gateway |

## CORS Configuration

CORS is currently enabled without origin restriction. Once the domain is known, update `docker-compose.yml`:

```yaml
- CORS_ENABLED=true
- CORS_ALLOWED_ORIGINS=https://your-domain.com
```

## Directory Structure

```text
geoserver/
├── Dockerfile
├── docker-compose.yml
└── data/
    ├── geoserver_data/     # workspaces, stores, styles, layer config
    ├── additional_libs/    # extra JARs and plugins
    └── tomcat/
        └── conf/           # Tomcat configuration files
```

## Troubleshooting

```bash
# Live logs
docker compose logs -f geoserver

# Health status (JSON)
docker inspect --format='{{json .State.Health}}' geoserver

# Check REST endpoint (used by health check)
curl http://127.0.0.1:8090/geoserver/rest/about/version.json
```

If the health check fails, verify that the REST endpoint is accessible without authentication (`REST_PATH` is not restricted to authenticated users in GeoServer settings).

## Related Documentation

- [Security & performance analysis](../docs/analysis-report.md)
- [Implementation report](../docs/implementation-report.md)
- [HA architecture guide](../docs/ha-recommendation.md)
