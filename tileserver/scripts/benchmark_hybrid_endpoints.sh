#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <legacy_base_url> <hybrid_base_url> <style_name>"
  echo "Example: $0 http://127.0.0.1:9090 http://127.0.0.1:8080 day_1_public"
  exit 1
fi

LEGACY_BASE="${1%/}"
HYBRID_BASE="${2%/}"
STYLE_NAME="$3"

run_probe() {
  local label="$1"
  local url="$2"
  local loops="${3:-8}"

  local sum_ms=0
  local min_ms=999999
  local max_ms=0

  for _ in $(seq 1 "$loops"); do
    local time_s
    time_s=$(curl -sS -o /dev/null -w "%{time_total}" "$url")
    local time_ms
    time_ms=$(awk -v t="$time_s" 'BEGIN { printf "%.0f", t * 1000 }')
    sum_ms=$((sum_ms + time_ms))
    if (( time_ms < min_ms )); then min_ms="$time_ms"; fi
    if (( time_ms > max_ms )); then max_ms="$time_ms"; fi
  done

  local avg_ms=$((sum_ms / loops))
  echo "$label | avg=${avg_ms}ms min=${min_ms}ms max=${max_ms}ms loops=${loops}"
}

echo "== Style endpoint =="
run_probe "legacy-style" "$LEGACY_BASE/styles/$STYLE_NAME/style.json"
run_probe "hybrid-style" "$HYBRID_BASE/styles/v1/$STYLE_NAME.json"

echo
echo "== Sprite endpoint =="
run_probe "legacy-sprite-json" "$LEGACY_BASE/sprite.json"
run_probe "hybrid-sprite-json" "$HYBRID_BASE/sprite/v1/sprite.json"

echo
echo "== TileJSON endpoint =="
run_probe "legacy-data" "$LEGACY_BASE/data/static_road.json"
run_probe "hybrid-data" "$HYBRID_BASE/data/static_road.json"
