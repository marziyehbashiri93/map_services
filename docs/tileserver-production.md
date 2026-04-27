# TileServer + Nginx Hybrid Production Runbook

This runbook deploys a hybrid map stack on a single server:
- `TileServer` serves tile data (`/data`, `/tiles`).
- `Nginx` serves versioned style assets (`/styles/v1`, `/sprite/v1`, `/fonts`) and proxies tile endpoints.

## 1) Prerequisites

- Linux server with Docker + Docker Compose plugin.
- DNS A record for your domain pointing to the server IP.
- Ports `80` (and `443` if you terminate TLS on this host) open on the firewall/security group.
- Project checked out on server, example path:
  - `/opt/map_services`

## 2) Current Hybrid Files in Repository

- Compose (each stack is self-contained under its folder):
  - `tileserver/docker-compose.yml` — TileServer (`build: .` + `Dockerfile`); creates Docker network `map_services_net`
  - `map_gateway/docker-compose.yml` — Nginx (`build: .` + `Dockerfile`); joins `map_services_net`; volumes only under `map_gateway/`
- Nginx configuration (owned by the gateway stack):
  - `map_gateway/nginx/nginx.conf`
  - `map_gateway/nginx/conf.d/00-upstreams.conf`
  - `map_gateway/nginx/conf.d/10-gateway-http.conf`
  - `map_gateway/nginx/conf.d/map.ssl.conf.example`
  - `map_gateway/nginx/snippets/` (proxy, cache, security headers)
- Published static files for the gateway (generated, grouped by service under `map_gateway/data/`):
  - `map_gateway/data/tileserver/styles/v1/*.json`, `styles.json`
  - `map_gateway/data/tileserver/sprite/v1/*`
  - `map_gateway/data/tileserver/fonts/` (copy of `tileserver/fonts`)
- Hybrid asset publisher:
  - `tileserver/scripts/publish_hybrid_assets.py`
- Benchmark script:
  - `tileserver/scripts/benchmark_hybrid_endpoints.sh`
- Frontend sample switched to hybrid style URL:
  - `mapbox_site/index.html`

## 3) First-Time Local/Server Bring-Up (HTTP)

From repository root:

```bash
cd tileserver
python3 scripts/publish_hybrid_assets.py
docker compose up -d
cd ../map_gateway
docker compose up -d --build
```

If `map_gateway` fails with “network map_services_net not found”, create it once (`docker network create map_services_net`) or always start `tileserver` compose first (it defines that network).

Expected services:
- `tileserver` on internal `:8080` and host `:9090`.
- `map_nginx` on host `:8080` (from `map_gateway/docker-compose.yml`).

Quick checks:

```bash
curl -I http://127.0.0.1:8080/styles/v1/day_1_public.json
curl -I http://127.0.0.1:8080/sprite/v1/sprite.json
curl -I http://127.0.0.1:8080/data/static_road.json
```

## 4) Style Asset Publish Flow (Versioned)

### Why this is required
Raw styles in `tileserver/styles/server_local` contain source URLs like `mbtiles://{...}` which are resolved by TileServer only when TileServer serves style JSON.  
In hybrid mode, style JSON is static and must contain client-ready URLs.

### What the publisher script does
- Writes all style JSON files to `map_gateway/data/tileserver/styles/v1/`.
- Rewrites:
  - `glyphs` to `/fonts/{fontstack}/{range}.pbf`
  - `sprite` to `/sprite/v1/sprite`
  - source `url` from `mbtiles://{name}` to `/data/name.json`
- Copies sprite files to `map_gateway/data/tileserver/sprite/v1/`.
- Copies fonts to `map_gateway/data/tileserver/fonts/`.
- Generates catalog:
  - `map_gateway/data/tileserver/styles/v1/styles.json`

### Deploy after style changes

```bash
cd tileserver
python3 scripts/publish_hybrid_assets.py
cd ../map_gateway
docker compose restart nginx
```

If you edited files under `map_gateway/nginx/`, rebuild the image: `docker compose up -d --build`.

## 5) TLS (optional)

This repository does **not** include Certbot. For HTTPS you can:

- Terminate TLS on another reverse proxy / load balancer in front of `map_nginx`, or
- Add PEM files on the host and enable `map_gateway/nginx/conf.d/map.ssl.conf.example` (copy to `map.ssl.conf`), mount them read-only (for example `map_gateway/tls/` → `/etc/nginx/tls/`), publish port `443` on the nginx service, rebuild the gateway image, and reload.

See comments at the top of `map_gateway/nginx/conf.d/map.ssl.conf.example` for the exact steps.

## 6) Frontend Integration Notes

`mapbox_site/index.html` is configured for hybrid mode:
- Base URL default: `http://127.0.0.1:8080`
- Style URL: `/styles/v1/<style>.json`
- Catalog URL: `/styles/v1/styles.json`
- Legacy fallback remains (`/styles.json`) for compatibility/debugging.

For production frontend:
- Point map base URL to `https://your-domain`.
- Keep style URL versioned so cache invalidation is explicit.

## 7) Baseline and Post-Migration Performance Check

Run benchmark:

```bash
cd tileserver
bash scripts/benchmark_hybrid_endpoints.sh \
  http://127.0.0.1:9090 \
  http://127.0.0.1:8080 \
  day_1_public
```

This compares:
- Legacy TileServer style endpoint.
- Hybrid static style endpoint.
- Sprite JSON and TileJSON response times.

Also inspect browser DevTools Network during `setStyle`:
- Confirm `styles/sprite/fonts` are cache hits.
- Confirm tiles still served from proxied TileServer endpoints.

## 8) Rollback Procedure

If hybrid rollout has issues:

1. Frontend rollback:
   - Change style URL back to TileServer direct style endpoint (`/styles/<name>/style.json`).
2. Infrastructure rollback:
   - Stop using nginx endpoint externally.
   - Keep `tileserver:9090` as direct map endpoint.
3. Compose rollback (optional, from repository root):
```bash
cd map_gateway
docker compose stop nginx
```

No tile data migration is required for rollback.

## 9) Add New Theme (Light/Dark) Checklist

1. Add generated style JSON to `tileserver/styles/server_local/`.
2. Ensure style has:
   - valid `sources` keys matching TileServer `config.json` data keys.
   - sprite icon names that exist in sprite atlas.
3. Re-publish hybrid assets:
```bash
cd tileserver
python3 scripts/publish_hybrid_assets.py
cd ../map_gateway
docker compose up -d --build
```
4. Validate:
   - `GET /styles/v1/styles.json` includes the new theme.
   - New theme loads in frontend style switcher.

## 10) Nginx config check (optional)

`nginx -t` resolves upstream hostnames at test time. On a laptop, TileServer is not defined until containers share `map_services_net`, so a standalone test may fail with `host not found in upstream "tileserver"`. Either run `nginx -t` inside the running `map_nginx` container after the stack is up, or build the gateway image and test with a stub host:

```bash
cd map_gateway
docker compose build nginx
docker run --rm --add-host tileserver:127.0.0.1 map_gateway_nginx:local nginx -t
```

## 11) Operational Monitoring

- Nginx logs:
  - `docker logs map_nginx --tail 200`
- TileServer logs:
  - `docker logs tileserver --tail 200`
- Watch for:
  - `404` on `/sprite/v1/*` or `/fonts/*`
  - `5xx` on `/data/*` and `/tiles/*`
  - TLS certificate expiration (set renewal cron/systemd job).

## 12) Backup and Restore

Minimum backup set:
- `tileserver/config.json`
- `tileserver/styles/server_local/`
- `tileserver/sprites/`
- `tileserver/fonts/`
- `tileserver/tiles/`
- `map_gateway/nginx/`
- `map_gateway/docker-compose.yml`
- `map_gateway/Dockerfile`
- `tileserver/docker-compose.yml`
- `tileserver/Dockerfile`
- (Optional) `map_gateway/data/tileserver/` or regenerate with `publish_hybrid_assets.py`

Restore:
- Restore files to same paths.
- `cd tileserver && python3 scripts/publish_hybrid_assets.py`
- `cd tileserver && docker compose up -d && cd ../map_gateway && docker compose up -d --build`.
