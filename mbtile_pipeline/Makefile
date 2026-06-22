.PHONY: build-osm build-custom serve stop all clean help

## Build osm.mbtiles from iran.osm.pbf using Planetiler
build-osm:
	docker compose run --rm osm-build

## Build custom.mbtiles from GeoJSON/PostGIS using Tippecanoe
build-custom:
	docker compose run --rm custom-build

## Start Martin tile server (tiles served at http://localhost:3000)
serve:
	docker compose up -d martin

## Stop Martin
stop:
	docker compose down

## Full monthly pipeline: OSM build + custom build
all: build-osm build-custom
	@echo "Pipeline complete. Run 'make serve' to start Martin."

## Remove output tiles
clean:
	rm -f data/osm.mbtiles data/custom.mbtiles

help:
	@grep -E '^##' Makefile | sed 's/## //'
