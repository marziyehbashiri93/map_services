# Hybrid Migration Baseline Notes

Date: 2026-04-26

## Current measurable baseline (before runtime benchmark)

- Style file count in `tileserver/styles/server_local`: 18
- Approx style file size: 77-78 KB each
- Sprite atlas:
  - `sprite.png`: ~123 KB
  - `sprite@2x.png`: ~785 KB
- Fonts served as PBF from `tileserver/fonts`

## Runtime benchmark command

Use this command on server after stack is up:

```bash
cd tileserver
bash scripts/benchmark_hybrid_endpoints.sh \
  http://127.0.0.1:9090 \
  http://127.0.0.1:8080 \
  day_1_public
```

## Runtime benchmark status in this environment

`docker compose up -d` in `tileserver/` and `map_gateway/` could not fully start in one environment due to network timeout while pulling `nginx:1.27-alpine`, so before/after live latency numbers were not captured in that run.

Re-run benchmark in production server or CI runner with internet access to complete this section.
