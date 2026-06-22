# Map Services — Comprehensive Analysis Report

## Executive Summary

The map_services project is a well-structured microservices system for tile serving, routing, and visualization. Core components (TileServer, Nginx Gateway, GraphHopper, GeoServer) are containerized with Docker and show solid practices: resource limits on every service, health checks on most services, keepalive upstreams in Nginx, and a clean hybrid asset publishing pipeline. Several actionable gaps remain in security hardening, Nginx performance tuning, and operational observability that must be addressed before production deployment.

---

## 1. Security Audit

### CRITICAL

**S-C1 — Unverified Third-Party Registry**
- Files: `tileserver/Dockerfile`, `graphhopper/Dockerfile`
- All base images are pulled from `mirror-docker.runflare.com` — an uncontrolled third-party registry with no image signing or content-trust verification. A compromised mirror silently injects malicious code into every build.
- Fix:
  ```dockerfile
  # tileserver/Dockerfile
  FROM maptiler/tileserver-gl:v4.7.1   # pin exact version from official registry

  # graphhopper/Dockerfile  (stage 1)
  FROM maven:3.9.5-eclipse-temurin-21 AS build
  # graphhopper/Dockerfile  (stage 2)
  FROM eclipse-temurin:21.0.5_11-jre-jammy
  ```
  If the mirror is required due to network restrictions, implement content-trust verification (`DOCKER_CONTENT_TRUST=1`) or scan with Trivy/Grype in CI before deploying.

**S-C2 — Unpinned `latest` Tag on TileServer**
- File: `tileserver/Dockerfile`
- `FROM mirror-docker.runflare.com/maptiler/tileserver-gl:latest` pulls an unpredictable image on every `--build`. A breaking upstream change silently enters production.
- Fix: Pin to a specific semver tag (e.g., `v4.7.1`).

---

### HIGH

**S-H1 — GraphHopper Admin Port (8990) Exposed to Host**
- File: `graphhopper/docker-compose.yml`
- Port 8990 is the Dropwizard admin API (metrics, thread dumps, logging config, shutdown). Binding it to `0.0.0.0` makes it publicly reachable.
- Fix:
  ```yaml
  ports:
    - "127.0.0.1:8989:8989"   # API — loopback only, let Nginx proxy it
    # remove 8990 entirely, or:
    - "127.0.0.1:8990:8990"   # Admin — loopback only
  ```

**S-H2 — Incomplete Security Headers**
- File: `map_gateway/nginx/snippets/security-headers.conf`
- Only `X-Content-Type-Options` and `Referrer-Policy` are set. Missing headers allow clickjacking, MIME sniffing escalation, and information leakage.
- Fix:
  ```nginx
  add_header X-Content-Type-Options  "nosniff"                          always;
  add_header X-Frame-Options         "SAMEORIGIN"                       always;
  add_header Referrer-Policy         "strict-origin-when-cross-origin"  always;
  add_header Permissions-Policy      "geolocation=(), camera=(), microphone=()" always;
  # Enable after SSL is live:
  # add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  ```

**S-H3 — No Rate Limiting**
- File: `map_gateway/nginx/conf.d/10-gateway-http.conf`
- All endpoints (tiles, styles, routing) are unthrottled. A single client can flood the gateway and exhaust TileServer/GraphHopper resources.
- Fix (add to `nginx.conf` `http {}` block, then reference in locations):
  ```nginx
  limit_req_zone $binary_remote_addr zone=tiles:20m  rate=120r/s;
  limit_req_zone $binary_remote_addr zone=api:10m    rate=30r/s;
  limit_conn_zone $binary_remote_addr zone=connlimit:10m;

  # In location / (tile proxy):
  limit_req  zone=tiles burst=300 nodelay;
  limit_conn connlimit 50;

  # In location /graphhopper/:
  limit_req  zone=api burst=60 nodelay;
  ```

**S-H4 — No CORS Policy**
- Tile and style endpoints have no `Access-Control-Allow-Origin` headers. Browsers will block cross-origin map loading unless CORS is explicitly configured.
- Fix: Add to relevant location blocks (restrict to known origins in production):
  ```nginx
  add_header Access-Control-Allow-Origin  "https://maps.yourdomain.com" always;
  add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS"           always;
  add_header Access-Control-Max-Age       3600                           always;
  ```

**S-H5 — TileServer Mounts Entire Source Directory**
- File: `tileserver/docker-compose.yml`
- `- .:/data` exposes Dockerfiles, Python scripts, and any `.env` files inside the container. A path traversal in TileServer would leak these files.
- Fix: Mount only what TileServer reads:
  ```yaml
  volumes:
    - ./config.json:/data/config.json:ro
    - ./tiles:/data/tiles:ro
    - ./styles/server_local:/data/styles:ro
    - ./fonts:/data/fonts:ro
    - ./sprites:/data/sprites:ro
  ```

---

### MEDIUM

**S-M1 — GeoServer CORS Enabled Without Origin Restriction**
- File: `geoserver/docker-compose.yml`
- `CORS_ENABLED=true` allows any origin. Set:
  ```yaml
  CORS_ALLOWED_ORIGINS: "https://maps.yourdomain.com"
  ```

**S-M2 — GraphHopper Admin Interface Bound to All Interfaces**
- File: `graphhopper/config-example.yml`
- `admin_connectors[0].bind_host: 0.0.0.0` — change to `127.0.0.1`.

**S-M3 — No Request Body Size Limit in Nginx**
- Large POST bodies to `/graphhopper/route` can cause OOM on the GraphHopper container. Add:
  ```nginx
  client_max_body_size 1m;          # global default
  # inside /graphhopper/ location:
  client_max_body_size 10m;
  ```

**S-M4 — No Docker Log Rotation**
- Default `json-file` driver accumulates logs without limit. Add to every service in compose files or configure the daemon globally (see Ansible `docker` role):
  ```yaml
  logging:
    driver: json-file
    options:
      max-size: "100m"
      max-file: "5"
  ```

**S-M5 — osm2pgsql Compose Mounts `$PWD` Without Restriction**
- File: `osm2pqsql/docker-compose.yml`
- `${PWD}:/usr/local/share/osm2pgsql/file/` exposes the entire working directory. Mount only the OSM data file or directory.

---

### LOW

**S-L1 — Legacy Docker Compose Version Field**
- `osm2pqsql/docker-compose.yml` uses `version: "3.9"`. Modern Compose ignores this field; remove it to avoid deprecation warnings.

**S-L2 — No Secret Management Strategy**
- Database credentials and API keys would be passed as plain environment variables. Before production: use Docker Secrets, HashiCorp Vault, or Ansible Vault for sensitive values.

---

## 2. Performance Analysis

### TileServer

| ID | Finding | Fix |
|----|---------|-----|
| P-T1 | No health check in `docker-compose.yml` — gateway `depends_on` cannot wait for a healthy state | Add `healthcheck` (see below) |
| P-T2 | `.:/data` broad mount causes slow startup scans over scripts/fonts/tiles | Mount specific subdirs (see S-H5) |

```yaml
# tileserver/docker-compose.yml — add healthcheck
healthcheck:
  test: ["CMD-SHELL", "wget -qO- http://localhost:8080/ > /dev/null || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

### Nginx Gateway

| ID | Finding | Fix |
|----|---------|-----|
| P-N1 | No proxy cache for tile responses — TileServer serves every request cold | Add `proxy_cache_path` + `proxy_cache` per tile location |
| P-N2 | `/styles/` uses `max-age=300` — versioned `/v1/` paths allow long TTLs | Change to `max-age=86400` (24h) or `max-age=604800` (7d) |
| P-N3 | `worker_connections 1024` — low for concurrent tile loading | Increase to `4096`, add `multi_accept on` |
| P-N4 | No Brotli compression | Add `ngx_brotli` module or use gzip (already enabled — good) |
| P-N5 | Default proxy buffers cause disk spooling for large tile responses | Tune proxy buffers (see below) |
| P-N6 | HTTP/2 not enabled (requires SSL) | Add SSL + `listen 443 ssl http2` |

```nginx
# nginx.conf — performance additions

# Proxy cache (add to http {} block)
proxy_cache_path /var/cache/nginx/tiles
    levels=1:2 keys_zone=tiles_cache:50m
    max_size=5g inactive=7d use_temp_path=off;

# In location / (tile proxy)
proxy_cache           tiles_cache;
proxy_cache_valid     200 7d;
proxy_cache_valid     404 1m;
proxy_cache_key       "$scheme$request_method$host$request_uri";
proxy_cache_lock      on;
add_header            X-Cache-Status $upstream_cache_status always;

# Proxy buffer tuning
proxy_buffer_size     64k;
proxy_buffers         8 256k;
proxy_busy_buffers_size 512k;

# Events block
events {
    worker_connections 4096;
    multi_accept on;
}
```

### GraphHopper

| ID | Finding | Fix |
|----|---------|-----|
| P-G1 | `-Xmx4g` heap with `memory: 5G` container limit leaves only 1GB for metaspace, off-heap, OS | Either set `memory: 6G` or reduce to `-Xmx3500m` |
| P-G2 | `graph.dataaccess.default_type: RAM_STORE` — correct, optimal for speed | No change needed |
| P-G3 | CH profiles for `car` — correct, fast routing | No change needed |

### osm2mbtile

| ID | Finding | Fix |
|----|---------|-----|
| P-O1 | No retry/backoff on tile generation failure | The double-check loop in `main.py:74` is good; add exponential backoff before final failure |
| P-O2 | `ProcessPoolExecutor(max_workers=4)` is hardcoded | Make configurable via env/config for different CPU counts |

---

## 3. Stability Assessment

### Container Orchestration

| ID | Finding | Fix |
|----|---------|-----|
| ST-1 | TileServer has no `healthcheck` in compose | Add (see P-T1 above) |
| ST-2 | Manual startup ordering required (Nginx must start after TileServer creates the network) | Ansible playbook enforces order; document and automate |
| ST-3 | GraphHopper `start_period: 120s` insufficient for large Iran PBF (graph build 10–30 min) | Set `start_period: 30m` |
| ST-4 | No disk space alerting | Add cron or Prometheus alert (see monitoring role) |

```yaml
# graphhopper/docker-compose.yml
healthcheck:
  ...
  start_period: 30m   # was: 120s
```

### Logging

| ID | Finding | Fix |
|----|---------|-----|
| ST-5 | No Docker log rotation — disk fills silently | Configure `max-size`/`max-file` in daemon or per-service (see S-M4) |
| ST-6 | No centralized log aggregation | For production: add Loki + Promtail, or ship to ELK |

### Data Persistence

| ID | Finding | Fix |
|----|---------|-----|
| ST-7 | GraphHopper cache at `./data/default-gh` (bind mount, good) | Document that changing OSM input requires manual cache rebuild |
| ST-8 | No automated backup for MBTiles or graph cache | Add cron backup to remote storage (S3/NFS) |

---

## 4. Architecture Review

```
Internet
    │
    ▼
[Nginx Gateway :8080]
    │
    ├─── /styles/*            →  static files (map_gateway/data/tileserver/styles)
    ├─── /sprite/*            →  static files (map_gateway/data/tileserver/sprite)
    ├─── /fonts/*             →  static files (map_gateway/data/tileserver/fonts)
    ├─── /geoserver/*         →  proxy → GeoServer :8080
    ├─── /graphhopper/*       →  proxy → GraphHopper :8989
    └─── /* (catch-all)       →  proxy → TileServer :8080

[TileServer :9090/8080]        [GraphHopper :8989]    [GeoServer :8090/8080]
    │                               │
    └── mbtiles files               └── OSM graph cache
        (./tiles/)                      (./data/default-gh/)
```

**Networks:**
- `map_services_net` (bridge) — TileServer, Nginx, GeoServer, GraphHopper
- `fleet-net` (external) — GraphHopper, GeoServer for fleet-system integration

**Single Points of Failure:**
- Every service is single-instance with `restart: unless-stopped` — adequate for a single-server deployment, not for HA
- Docker host is a SPOF; consider bare-metal HA or a managed container platform for critical workloads

**Scalability Bottlenecks:**
- TileServer is stateful (reads local mbtiles); horizontal scaling requires shared storage (NFS/S3-backed mbtiles)
- GraphHopper is single-instance; read replicas are possible but complex

**Recommendations:**
- Close TileServer port 9090 from external access in production; let Nginx be the sole gateway
- Consider adding a CDN (Cloudflare, Fastly) in front of Nginx for global tile caching
- For HA: run TileServer + Nginx on a shared volume behind a load balancer

---

## 5. Actionable Recommendations (Prioritized)

| Priority | ID | Action | Estimated Effort |
|:--------:|-----|--------|:----------------:|
| **P0** | S-C1 | Switch all base images to official registries | 30 min |
| **P0** | S-C2 | Pin TileServer image to specific semver tag | 5 min |
| **P0** | S-H1 | Bind GraphHopper port 8990 to loopback only | 5 min |
| **P1** | S-H2 | Add X-Frame-Options, Permissions-Policy headers | 10 min |
| **P1** | S-H3 | Add rate limiting zones to Nginx | 30 min |
| **P1** | S-H5 | Mount specific subdirs in TileServer (not `.:/data`) | 30 min |
| **P1** | ST-1 | Add TileServer health check to docker-compose.yml | 10 min |
| **P1** | S-M4 | Add Docker log rotation to all services | 20 min |
| **P1** | P-N1 | Add Nginx proxy cache for tile responses | 1 hr |
| **P2** | P-G1 | Fix JVM heap vs container memory headroom | 5 min |
| **P2** | P-N2 | Increase style/sprite cache TTL | 5 min |
| **P2** | P-N3 | Raise `worker_connections` to 4096 | 5 min |
| **P2** | ST-3 | Increase GraphHopper `start_period` to 30m | 5 min |
| **P2** | S-H4 | Add explicit CORS headers for known origins | 20 min |
| **P3** | S-M1 | Restrict GeoServer CORS to specific origins | 5 min |
| **P3** | S-M2 | Bind GraphHopper admin interface to 127.0.0.1 | 5 min |
| **P3** | P-N5 | Tune Nginx proxy buffers | 15 min |
| **P3** | ST-6 | Add centralized logging (Loki + Promtail) | 1 day |
| **P3** | ST-8 | Implement automated backup for mbtiles + graph cache | 2 hrs |
