#!/bin/bash
set -e

DATA_DIR="/data"
OUTPUT_DIR="/output"

# Layer definitions: name:minZoom:maxZoom:sql
LAYERS=(
  "province:1:16:SELECT * FROM \"static\".province"
  "sea:1:16:SELECT * FROM \"static\".sea"
  "label_object:1:18:SELECT * FROM \"static\".label_object"
  "violation_camera:6:18:SELECT name, geom FROM \"static\".violation_camera"
  "police:6:18:SELECT police_name AS name, geom FROM \"static\".police"
  "complex_service:6:18:SELECT axis_name AS name, geom FROM \"static\".complex_service"
)

PG_CONN="PG:host=${DB_HOST} port=${DB_PORT} dbname=${DB_NAME} user=${DB_USER} password=${DB_PASS}"

mkdir -p "$DATA_DIR" "$OUTPUT_DIR"
MBTILE_FILES=()

for entry in "${LAYERS[@]}"; do
  IFS=':' read -r LAYER MIN_ZOOM MAX_ZOOM SQL <<< "$entry"

  GEOJSON="$DATA_DIR/${LAYER}.geojson"
  MBTILE="$OUTPUT_DIR/${LAYER}.mbtile"

  # Use existing GeoJSON if available, otherwise export from PostGIS
  if [ ! -f "$GEOJSON" ]; then
    echo "[custom] Exporting ${LAYER} from PostGIS..."
    ogr2ogr -f GeoJSON "$GEOJSON" "$PG_CONN" \
      -sql "$SQL" \
      -t_srs EPSG:4326 \
      -fieldTypeToString DateTime
  else
    echo "[custom] Using existing GeoJSON for ${LAYER}"
  fi

  echo "[custom] Building ${LAYER}.mbtile (Z${MIN_ZOOM}-Z${MAX_ZOOM})..."
  tippecanoe \
    -z "${MAX_ZOOM}" \
    -Z "${MIN_ZOOM}" \
    --force \
    --no-tile-size-limit \
    --base-zoom="${MIN_ZOOM}" \
    -l "${LAYER}" \
    -o "${MBTILE}" \
    "${GEOJSON}"

  MBTILE_FILES+=("$MBTILE")
done

echo "[custom] Merging all layers into custom.mbtiles..."
tile-join \
  --force \
  -pk \
  -o "${OUTPUT_DIR}/custom.mbtiles" \
  "${MBTILE_FILES[@]}"

# Remove individual per-layer tiles
rm -f "${MBTILE_FILES[@]}"

echo "[custom] Done: ${OUTPUT_DIR}/custom.mbtiles"
