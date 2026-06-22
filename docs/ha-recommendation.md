# High-Availability Architecture Recommendation

## Current Architecture — SPOF Analysis

```
[Upstream Proxy / CDN]
         │
         ▼
 [map_nginx :8080]          ← SPOF: single Nginx container
         │
         ├── static assets  ← served from bind-mounted files (no replication)
         │
         └── proxy ──► [tileserver :8080]    ← SPOF: single TileServer
                   └── proxy ──► [graphhopper :8989]  ← SPOF: single GraphHopper
                   └── proxy ──► [geoserver :8080]    ← SPOF: single GeoServer

All services run on one Docker host  ← SPOF: host failure = full outage
```

**Single points of failure (current):**
| Component | Impact of failure | Recovery time |
|-----------|------------------|---------------|
| Docker host | Full outage | Manual restart / provision new host |
| Nginx (map_nginx) | All requests fail | `docker compose up` (~5s) |
| TileServer | No tiles, no styles | `docker compose up` (~30s) |
| GraphHopper | Routing unavailable | `docker compose up` + 15-30 min graph load |
| MBTiles file corruption | No tiles | Manual restore from backup |
| `/var/lib/docker` disk full | All containers fail | Manual cleanup |

---

## HA Strategy Options

### Option A — Active/Passive (Recommended for most deployments)

**Cost:** Low — requires 1 extra server + a shared volume (NFS/Ceph/cloud disk).  
**RTO (recovery time):** 1-3 minutes (automated failover with Keepalived).  
**RPO (data loss):** Zero — read-only mbtiles files are shared, not replicated.

```
           [Virtual IP / Keepalived]
                 │
        ┌────────┴────────┐
        ▼                 ▼
  [Primary Host]    [Standby Host]        ← same image set, same compose files
  map_nginx  ◄──?   map_nginx  (standby)
  tileserver         tileserver (standby)
  graphhopper        graphhopper (standby)
        │                 │
        └────────┬─────────┘
                 ▼
         [Shared NFS / Block Volume]
         /mnt/map_data/
           ├── tiles/*.mbtile     (read-only by TileServer)
           ├── graphhopper/data/  (graph cache — primary writes, standby reads)
           └── map_gateway/cache/ (nginx tile cache — optional share)
```

**How it works:**
1. Both hosts run the same Docker Compose stacks.
2. Keepalived assigns a Virtual IP (VIP) to the primary host.
3. If the primary host's health check fails, Keepalived moves the VIP to standby.
4. The standby Nginx/TileServer were already running and warmed — no cold start.
5. GraphHopper graph cache on shared NFS means the standby does NOT need to rebuild.

**Key constraint:** GraphHopper graph cache directory must be on shared storage to avoid the 30-minute rebuild on failover.

**Implementation steps:**
```bash
# 1. Provision shared NFS volume (or use cloud persistent disk)
# Example: mount on both hosts
echo "nfs-server:/mnt/map_data  /mnt/map_data  nfs  ro,hard,intr  0 0" >> /etc/fstab
mount -a

# 2. Update docker-compose paths to use shared mount
#    In graphhopper/docker-compose.yml:
#      - /mnt/map_data/graphhopper/data:/data
#    In tileserver/docker-compose.yml:
#      - /mnt/map_data/tiles:/data/tiles:ro
#    In map_gateway/docker-compose.yml:
#      - /mnt/map_data/nginx_cache:/var/cache/nginx/tiles

# 3. Install Keepalived on both hosts
apt install keepalived

# 4. Configure Keepalived (primary: /etc/keepalived/keepalived.conf)
# See keepalived config templates below.

# 5. Start both stacks, verify standby is running
# 6. Test failover: systemctl stop keepalived on primary
```

**Keepalived config — Primary:**
```
vrrp_script chk_nginx {
    script "curl -sf http://127.0.0.1:8080/healthz > /dev/null"
    interval 5
    fall 2
    rise 1
}

vrrp_instance MAP_GW {
    state MASTER
    interface eth0                 # your network interface
    virtual_router_id 51
    priority 110
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass CHANGE_ME_SECRET
    }
    virtual_ipaddress {
        192.168.1.100/24           # your VIP
    }
    track_script {
        chk_nginx
    }
}
```

**Keepalived config — Standby:**
```
# Same as above but:
#   state BACKUP
#   priority 90
```

---

### Option B — Active/Active with Load Balancer

**Cost:** Medium — requires a load balancer (HAProxy/Nginx LB) + 2+ worker hosts + shared read-only storage.  
**RTO:** Near-zero (load balancer removes failed host from pool).  
**RPO:** Zero (read-only tile files).

```
       [Load Balancer — HAProxy or Nginx]
              │           │
        ┌─────┘           └─────┐
        ▼                       ▼
 [Worker Host 1]         [Worker Host 2]
 map_nginx                map_nginx
 tileserver               tileserver
        │                       │
        └──────────┬────────────┘
                   ▼
         [Shared Read-Only Storage]
         tiles/*.mbtile
         map_gateway/data/tileserver/  (styles, sprite, fonts)
```

**Constraints for A/A:**
- TileServer GL is stateless for reads — safe to run multiple instances pointing at the same mbtiles.
- Nginx tile cache should NOT be shared (each worker caches independently) — use separate dirs.
- GraphHopper is NOT safe to run A/A with a shared mutable graph directory. Options:
  - Run one GraphHopper per host with graph cache replicated via rsync (eventual consistency).
  - Use the GraphHopper cluster API (experimental).
  - Run a single GraphHopper instance and route `/graphhopper/` to it from all Nginx instances.

**HAProxy config excerpt:**
```
backend map_tileserver
    balance roundrobin
    option httpchk GET /healthz
    server ts1 host1:8080 check
    server ts2 host2:8080 check

backend map_gateway
    balance leastconn
    option httpchk GET /healthz
    server gw1 host1:8080 check
    server gw2 host2:8080 check
```

---

### Option C — Managed Container Platform (Long-term)

For teams that outgrow manual HA:
- **Docker Swarm:** built-in service replication (`replicas: 2`), overlay networks, rolling updates.
- **Kubernetes:** full HA, HPA, PVC for shared storage, Ingress for L7 load balancing.

TileServer GL and Nginx map cleanly to stateless Deployments. GraphHopper requires a StatefulSet with a shared PVC (ReadOnlyMany) for the graph cache.

---

## Recommended Path for This Project

```
Phase 1 (now):        Single host with proper restart policies ← already done
Phase 2 (3-6 months): Option A (Active/Passive + Keepalived + NFS)
Phase 3 (>6 months):  Option B or Docker Swarm if load justifies it
```

**Phase 2 checklist:**
- [ ] Provision NFS share (or cloud persistent disk, e.g. AWS EFS, Azure Files)
- [ ] Move mbtiles, graph cache, and Nginx cache to NFS
- [ ] Update compose volume paths on both hosts
- [ ] Install and configure Keepalived on both hosts
- [ ] Test failover: `systemctl stop keepalived` on primary → VIP moves to standby
- [ ] Automate: set `restart: unless-stopped` (already done) + ensure Docker starts on boot
- [ ] Monitor VIP state: add a Keepalived state-change notification script to alert on failover
- [ ] Document the recovery runbook (primary dead, new server, how to re-join cluster)

---

## Disk Space & Backup (pre-HA hygiene)

Before implementing HA, ensure these are in place (they make recovery faster):

```bash
# Weekly rsync of mbtiles to backup location
rsync -av --progress /opt/map_services/tileserver/tiles/ backup-host:/backups/mbtiles/

# Weekly backup of GraphHopper graph cache
tar -czf /backups/graphhopper-$(date +%Y%m%d).tar.gz \
    /opt/map_services/graphhopper/data/default-gh/

# Disk space alert via cron (90% threshold)
df -h /opt/map_services | awk 'NR==2 {gsub(/%/,""); if ($5 > 90) print "DISK ALERT: " $5 "% used"}' \
    | mail -s "map_services disk alert" ops@your-domain.com
```
