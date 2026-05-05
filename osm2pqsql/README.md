# OSM2pgsql

> Imports OpenStreetMap PBF data into a PostgreSQL/PostGIS database. The resulting database feeds the `osm2mbtile` pipeline that generates `.mbtiles` files for TileServer.

## Overview

OSM2pgsql runs as a one-shot Docker container — it reads an OSM PBF file, processes it, and writes the data into a PostgreSQL database. After the import completes, the container exits. This service has no persistent running state.

## Prerequisites

- Docker and Docker Compose plugin
- A running PostgreSQL instance with PostGIS and hstore extensions enabled (can be external)
- Iran OSM PBF file (download from [Geofabrik](https://download.geofabrik.de/asia/iran.html))

## Installation

### 1. Prepare the PostgreSQL database

Connect to your PostgreSQL instance and run:

```sql
CREATE USER "osmuser" WITH PASSWORD 'strong_password_here';
CREATE DATABASE "osm" WITH OWNER "osmuser" ENCODING 'UTF8';
\c osm
CREATE EXTENSION postgis;
CREATE EXTENSION hstore;
```

### 2. Place input files in `data/`

All input files must be in the `data/` subdirectory:

```bash
mkdir -p osm2pqsql/data
cp iran-latest.osm.pbf osm2pqsql/data/
cp default.style       osm2pqsql/data/    # for classic mode
# or
cp style.lua           osm2pqsql/data/    # for flex/Lua mode
```

## Configuration

| Setting | Description |
|---------|-------------|
| `--database` | PostgreSQL database name |
| `-U` / `--host` / `--port` | PostgreSQL connection parameters |
| `--style` | Path to the style file inside the container |
| `--create --slim` | Full import (drop and recreate tables) with slim mode |
| `--output=flex` | Use Lua-based flex output instead of the default pgsql output |

## Usage

### Run with Docker Compose (recommended)

```bash
cd osm2pqsql
docker compose run --rm osm2pgsl \
  --create --slim \
  --database=osm -U osmuser -W \
  --host=<DB_HOST> --port=5432 \
  --style=/usr/local/share/osm2pgsql/file/default.style \
  --input-reader=pbf \
  /usr/local/share/osm2pgsql/file/iran-latest.osm.pbf
```

### Run with plain Docker (classic style)

```bash
docker run -it \
  --volume ./data:/usr/local/share/osm2pgsql/file/ \
  iboates/osm2pgsql \
  --create --slim \
  --database=osm -U osmuser -W \
  --host=<DB_HOST> --port=5432 \
  --style=/usr/local/share/osm2pgsql/file/default.style \
  --input-reader=pbf \
  /usr/local/share/osm2pgsql/file/iran-latest.osm.pbf
```

### Run with plain Docker (Flex / Lua style)

```bash
docker run -it \
  --volume ./data:/usr/local/share/osm2pgsql/file/ \
  iboates/osm2pgsql \
  --create --slim \
  --database=osm -U osmuser -W \
  --host=<DB_HOST> --port=5432 \
  --style=/usr/local/share/osm2pgsql/file/style.lua \
  --output=flex \
  --input-reader=pbf \
  /usr/local/share/osm2pgsql/file/iran-latest.osm.pbf
```

## Directory Structure

```text
osm2pqsql/
├── docker-compose.yml
└── data/
    ├── iran-latest.osm.pbf   # OSM input file (not committed — download separately)
    ├── default.style         # classic pgsql output style
    └── style.lua             # flex output style (Lua)
```

## Inputs and Outputs

| Direction | File / Resource | Description |
|-----------|----------------|-------------|
| Input | `data/iran-latest.osm.pbf` | OpenStreetMap PBF dump for Iran |
| Input | `data/default.style` or `data/style.lua` | Column mapping and tag filter rules |
| Output | PostgreSQL database (`osm`) | Imported tables ready for `osm2mbtile` pipeline |

## Troubleshooting

```bash
# Check PostgreSQL connectivity before running the import
docker run --rm iboates/osm2pgsql \
  psql -h <DB_HOST> -U osmuser -d osm -c "SELECT PostGIS_Version();"

# Inspect container logs during import
docker compose logs -f osm2pgsl
```

## Related Documentation

- [osm2mbtile pipeline](../osm2mbtile/README.md)
- [Security & performance analysis](../docs/analysis-report.md)
- [Implementation report](../docs/implementation-report.md)
- [HA architecture guide](../docs/ha-recommendation.md)
