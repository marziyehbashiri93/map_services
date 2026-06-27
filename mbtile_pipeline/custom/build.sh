#!/bin/bash
# Thin entrypoint: validates the DB connection env then hands off to build.py,
# which does the real work (discover -> export -> tippecanoe -> join -> validate).
set -euo pipefail

: "${DB_HOST:?DB_HOST is required}"
: "${DB_NAME:?DB_NAME is required}"
: "${DB_USER:?DB_USER is required}"

exec python3 /app/build.py "$@"
