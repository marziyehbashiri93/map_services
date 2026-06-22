# Implementation Report — Security, Performance & Stability Hardening

**Date:** 2026-04-28  
**Based on:** `docs/analysis-report.md`  
**Scope:** All accepted recommendations from the analysis report

---

## Summary

| Category | Findings | Implemented | Skipped (by decision) |
|----------|----------|-------------|----------------------|
| Security | 9 | 7 | 2 (S-H4, S-M1 commented, awaiting domain) |
| Performance | 7 | 5 | 2 (P-N6 SSL not needed; P-N4 Brotli deferred) |
| Stability | 4 | 2 | 2 (ST-6 centralized logging; ST-8 backup) |
| Architecture | 2 | 2 | 0 |

---

## Files Modified

| File | Changes |
|------|---------|
| `tileserver/Dockerfile` | S-C1, S-C2 |
| `tileserver/docker-compose.yml` | S-H5, ST-1, S-M4, Architecture |
| `graphhopper/docker-compose.yml` | S-H1, P-G1, ST-3, S-M4 |
| `graphhopper/config-example.yml` | S-M2 |
| `map_gateway/nginx/nginx.conf` | S-H3, P-N1, P-N3, P-N5 |
| `map_gateway/nginx/snippets/security-headers.conf` | S-H2 |
| `map_gateway/nginx/snippets/proxy-tileserver.conf` | P-N5, proxy headers cleanup |
| `map_gateway/nginx/conf.d/10-gateway-http.conf` | P-N1, P-N2, S-H3, S-H4 (commented), S-M3 |
| `map_gateway/docker-compose.yml` | P-N1 cache volume, S-M4 |
| `geoserver/docker-compose.yml` | S-M1 (commented), S-M4 |
| `osm2pqsql/docker-compose.yml` | S-L1, S-M5 |

## New Files

| File | Purpose |
|------|---------|
| `docs/ha-recommendation.md` | HA architecture options (A/P, A/A, Swarm) |
| `tileserver/README.md` | Updated to reflect new volume structure and port binding |
| `docs/implementation-report.md` | This file |

---

## Detailed Change Log

### Security

#### S-C1 — Content-Trust for Mirror Registry
- **File:** `tileserver/Dockerfile`
- **Change:** Added detailed comments explaining how to verify image authenticity via `DOCKER_CONTENT_TRUST=1` (if mirror supports Notary) or manual digest inspection.
- **Note:** Mirror registry kept as-is since network restrictions require it. Operator must verify digest after the first pull.

#### S-C2 — Pin TileServer Image Version
- **File:** `tileserver/Dockerfile`
- **Change:** `latest` → `v4.7.1`. Includes instructions to identify the current running tag via `docker inspect`.
- **Action required:** Verify `v4.7.1` exists on your mirror. If not, find the correct tag with the commands in the Dockerfile comments.

#### S-H1 — GraphHopper Ports to Loopback
- **File:** `graphhopper/docker-compose.yml`
- **Change:**
  - `"8989:8989"` → `"127.0.0.1:8989:8989"` (routing API — proxied through Nginx)
  - `"8990:8990"` → `"127.0.0.1:8990:8990"` (admin API — loopback only)

#### S-H2 — Missing Security Headers
- **File:** `map_gateway/nginx/snippets/security-headers.conf`
- **Change:** Added `X-Frame-Options: SAMEORIGIN` and `Permissions-Policy`. HSTS remains commented (no SSL on this background server).

#### S-H3 — Rate Limiting (Tile-Aware)
- **Files:** `nginx.conf`, `10-gateway-http.conf`
- **Change:**
  - `tiles` zone: `rate=200r/s`, `burst=1000 nodelay` — allows full bbox viewport tile loading (50-200 parallel tiles) without delay, while blocking pathological floods.
  - `api` zone: `rate=30r/s`, `burst=60 nodelay` — for GraphHopper/GeoServer endpoints.
  - Comment in config explains that since this is a background server, `$binary_remote_addr` is the upstream proxy IP, not individual end-users.

#### S-H4 — CORS (Commented, Awaiting Domain)
- **File:** `10-gateway-http.conf`
- **Change:** CORS `add_header` directives added but commented out with `# TODO:` marker. Uncomment and set your domain when known.

#### S-H5 — Specific Volume Mounts for TileServer
- **File:** `tileserver/docker-compose.yml`
- **Change:** Replaced `.:/data` with five targeted read-only mounts:
  ```
  ./config.json            → /data/config.json            :ro
  ./styles/server_local/   → /data/styles/server_local/   :ro
  ./fonts/                 → /data/fonts/                  :ro
  ./sprites/               → /data/sprites/                :ro
  ./tiles/                 → /data/tiles/                  :ro
  ```
  Scripts, Dockerfiles, base styles, and build artefacts are no longer inside the container.

#### S-M1 — GeoServer CORS (Commented, Awaiting Domain)
- **File:** `geoserver/docker-compose.yml`
- **Change:** Added `TODO` comment with `CORS_ALLOWED_ORIGINS` example. Current `CORS_ENABLED=true` kept until domain is known.

#### S-M2 — GraphHopper Admin Interface to Loopback
- **File:** `graphhopper/config-example.yml`
- **Change:** `admin_connectors[0].bind_host: 0.0.0.0` → `127.0.0.1`.

#### S-M3 — Request Size Limits
- **File:** `10-gateway-http.conf`
- **Change:**
  - Global: `client_max_body_size 2m`
  - `/geoserver/`: `client_max_body_size 50m` (WFS/WMS upload support)
  - `/graphhopper/`: `client_max_body_size 10m` (large route GeoJSON payloads)

#### S-M4 — Docker Log Rotation (All Services)
- **Files:** all docker-compose files
- **Change:** Added `logging.driver: json-file` with `max-size: 100m` / `max-file: 5` to: tileserver, graphhopper, map_gateway nginx, geoserver.

#### S-L1 — Remove Legacy `version` Field
- **File:** `osm2pqsql/docker-compose.yml`
- **Change:** Removed `version: "3.9"`.

#### S-M5 — osm2pgsql Specific Volume Mount
- **File:** `osm2pqsql/docker-compose.yml`
- **Change:** `${PWD}` → `./data` — only the OSM data directory is mounted.
- **Action required:** Create `osm2pqsql/data/` and place your `.osm.pbf` files there.

---

### Performance

#### P-N1 — Nginx Proxy Cache for Tiles
- **Files:** `nginx.conf`, `10-gateway-http.conf`, `map_gateway/docker-compose.yml`
- **Change:**
  - `proxy_cache_path /var/cache/nginx/tiles` — 5 GB max, 7-day inactivity TTL, 50 MB key zone.
  - `proxy_cache tiles_cache; proxy_cache_valid 200 7d;` applied to the TileServer catch-all location.
  - `proxy_cache_lock on` collapses parallel requests for the same tile into one upstream request.
  - `X-Cache-Status` response header shows HIT/MISS/BYPASS for debugging.
  - Added `./cache/nginx:/var/cache/nginx/tiles` volume in `map_gateway/docker-compose.yml` for persistence across Nginx restarts.

#### P-N2 — Style Cache-Control: 7 Days
- **File:** `10-gateway-http.conf`
- **Change:** `/styles/` → `Cache-Control: public, max-age=604800` (7d). Versioned `/v1/` paths are safe to cache long-term.

#### P-N3 — Nginx Worker Connections
- **File:** `nginx.conf`
- **Change:** `worker_connections 1024` → `4096`, added `multi_accept on`.

#### P-G1 — GraphHopper Memory: 6G Container / 5.5G Heap
- **File:** `graphhopper/docker-compose.yml`
- **Change:**
  - `memory: 5G` → `memory: 6G`
  - `JAVA_OPTS=-Xmx4g` → `JAVA_OPTS=-Xms512m -Xmx5500m`
  - Leaves ~500 MB for JVM non-heap (metaspace, code cache, direct buffers) + OS overhead.

#### P-N5 — Proxy Buffer Tuning
- **Files:** `nginx.conf`, `proxy-tileserver.conf`
- **Change in `nginx.conf` (http block):**
  ```nginx
  proxy_buffer_size       64k;
  proxy_buffers           8 256k;
  proxy_busy_buffers_size 512k;
  ```
- **Change in `proxy-tileserver.conf`:** Added `proxy_set_header Connection ""` (required for HTTP/1.1 keepalive), explicit `connect_timeout` and `send_timeout`.

#### P-N6 — SSL — SKIPPED
- **Reason:** Server is a background server with no direct client connections. SSL/HTTP2 will be handled by the upstream proxy.

---

### Stability

#### ST-1 — TileServer Health Check
- **File:** `tileserver/docker-compose.yml`
- **Change:**
  ```yaml
  healthcheck:
    test: ["CMD-SHELL", "wget -qO- http://localhost:8080/ > /dev/null || exit 1"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 30s
  ```

#### ST-3 — GraphHopper Start Period
- **File:** `graphhopper/docker-compose.yml`
- **Change:** `start_period: 120s` → `start_period: 30m`. First-time Iran PBF graph build takes 15-30 minutes.

#### ST-6 — Centralized Logging — SKIPPED
- **Reason:** Out of scope for this iteration. Revisit when deploying Loki/Promtail.

#### ST-8 — Automated Backup — SKIPPED
- **Reason:** Out of scope for this iteration. Backup strategy documented in `docs/ha-recommendation.md`.

---

### Architecture

#### Close TileServer Port to External Access
- **File:** `tileserver/docker-compose.yml`
- **Change:** `"9090:8080"` → `"127.0.0.1:9090:8080"`. TileServer is now only reachable from the Docker host itself. All external traffic goes through Nginx gateway on port 8080.

#### HA Recommendation Document
- **File created:** `docs/ha-recommendation.md`
- **Content:** Three HA options (Active/Passive with Keepalived, Active/Active with HAProxy, Docker Swarm), SPOF analysis table, Keepalived config templates, Phase 2 migration checklist.

---

## Post-Deploy Checklist

After deploying these changes, run the following to verify everything works:

```bash
# 1. Rebuild and restart all services
cd tileserver && docker compose up -d --build
cd ../map_gateway && docker compose up -d --build
cd ../graphhopper && docker compose up -d  # omit if not in use

# 2. Verify TileServer health
docker inspect --format='{{.State.Health.Status}}' tileserver
# Expected: healthy

# 3. Verify Nginx gateway
curl -v http://127.0.0.1:8080/healthz
# Expected: HTTP 200, body "ok"

# 4. Verify tile proxy cache
curl -v http://127.0.0.1:8080/data/static_road.json 2>&1 | grep X-Cache-Status
# First request: MISS; repeat: HIT

# 5. Verify style cache
curl -I http://127.0.0.1:8080/styles/v1/day_1_public.json | grep Cache-Control
# Expected: public, max-age=604800

# 6. Verify rate limiting (should return 429 after burst)
for i in $(seq 1 2000); do curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/; done | grep 429

# 7. Verify TileServer is NOT reachable from outside
# From an external machine (should FAIL):
# curl http://your-server-ip:9090/   ← should time out or be refused
```

## Pending Actions (operator)

- [ ] **S-C2:** Confirm `v4.7.1` exists on `mirror-docker.runflare.com`. If not, find the correct tag with:
  ```bash
  docker pull mirror-docker.runflare.com/maptiler/tileserver-gl:latest
  docker inspect --format='{{index .RepoDigests 0}}' mirror-docker.runflare.com/maptiler/tileserver-gl:latest
  ```
- [ ] **S-H4 / S-M1:** Once domain is known, uncomment CORS headers in `10-gateway-http.conf` and `geoserver/docker-compose.yml`.
- [ ] **S-M5:** Create `osm2pqsql/data/` directory and move `.osm.pbf` file there before next osm2pgsql run.
- [ ] **Phase 2 HA:** Follow checklist in `docs/ha-recommendation.md`.
