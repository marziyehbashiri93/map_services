#!/usr/bin/env python3
"""
custom.mbtiles builder for the VIOUNA map pipeline.

Pipeline per run:
  1. Read PostgreSQL        — auto-discover geometry tables in the schema
  2. Read the style JSON     — find which properties are actually rendered
  3. Export optimized GeoJSON (GeoJSONSeq, only the needed columns)
  4. Build per-layer MBTiles (Tippecanoe, geometry-aware flags)
  5. Merge + validate output (tile-join, then sqlite metadata check)
  6. Report statistics

Optimizations (priority order: size > speed > memory):
  • Drop every attribute the style never references.
  • Cap build maxzoom (overzoom serves higher display zooms for free).
  • Stream GeoJSONSeq + tippecanoe -P (low memory, parallel read).
  • Reduced coordinate precision on export.
  • Per-layer content signature -> incremental rebuild (skip unchanged layers).
  • No --no-tile-size-limit: tippecanoe is allowed to keep tiles under budget.
"""

import hashlib
import json
import logging
import os
import re
import sqlite3
import subprocess
import sys
import time
from collections import defaultdict

import psycopg2
import yaml

# ── Paths / environment ──────────────────────────────────────────────────────
CONFIG_PATH = os.environ.get("CONFIG", "/app/config.yml")
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", "/output")    # served by Martin
DATA_DIR = os.environ.get("DATA_DIR", "/data")          # NOT served by Martin
# Intermediate GeoJSON, per-layer tiles and the incremental manifest live under
# DATA_DIR so Martin (which scans OUTPUT_DIR) never serves them. Only the final
# custom.mbtiles lands in OUTPUT_DIR.
TMP_DIR = os.path.join(DATA_DIR, ".custom_tmp")
CACHE_DIR = os.path.join(DATA_DIR, ".custom_cache")      # per-layer tiles + manifest
MANIFEST = os.path.join(CACHE_DIR, "manifest.json")
FINAL = os.path.join(OUTPUT_DIR, "custom.mbtiles")

DB = dict(
    host=os.environ.get("DB_HOST", "host.docker.internal"),
    port=os.environ.get("DB_PORT", "5432"),
    dbname=os.environ.get("DB_NAME", "viuna_map"),
    user=os.environ.get("DB_USER", "marziyeh"),
    password=os.environ.get("DB_PASS", ""),
)
SCHEMA = os.environ.get("SCHEMA", "public")
FORCE = os.environ.get("FORCE", "").lower() in ("1", "true", "yes")

# Candidate primary-key columns used for change detection when a table has no
# timestamp column.
PK_CANDIDATES = ("ogc_fid", "id", "id_0", "gid", "fid", "objectid")

log = logging.getLogger("custom-build")


# ── Style analysis ───────────────────────────────────────────────────────────
def style_properties_by_layer(style_path):
    """Return {source-layer: set(properties)} the style actually renders."""
    props = defaultdict(set)
    try:
        style = json.load(open(style_path, encoding="utf-8"))
    except (OSError, ValueError) as exc:
        log.warning("could not read style %s (%s) — keeping no attributes",
                    style_path, exc)
        return props

    comparison_ops = {"==", "!=", "<", "<=", ">", ">=", "in", "!in"}

    def walk(node, bag):
        if isinstance(node, list):
            op = node[0] if node and isinstance(node[0], str) else None
            if op in ("get", "has") and len(node) >= 2 and isinstance(node[1], str):
                bag.add(node[1])
            # legacy filter form: ["==", "field", value]
            if (op in comparison_ops and len(node) >= 3
                    and isinstance(node[1], str) and node[1] not in ("$type", "$id")):
                bag.add(node[1])
            for x in node:
                walk(x, bag)
        elif isinstance(node, dict):
            for v in node.values():
                walk(v, bag)

    def templates(node, bag):
        if isinstance(node, dict):
            for k, v in node.items():
                if k in ("text-field", "icon-image") and isinstance(v, str):
                    bag.update(re.findall(r"\{([^}]+)\}", v))
                templates(v, bag)
        elif isinstance(node, list):
            for x in node:
                templates(x, bag)

    for lyr in style.get("layers", []):
        sl = lyr.get("source-layer")
        if not sl:
            continue
        bag = props[sl]
        for key in ("filter", "paint", "layout"):
            if key in lyr:
                walk(lyr[key], bag)
        templates(lyr.get("layout"), bag)
    return props


# ── PostGIS introspection ────────────────────────────────────────────────────
def discover_layers(conn, schema):
    """Return [{table, geom_col, geom_type, srid, columns:set}] for the schema."""
    cur = conn.cursor()
    cur.execute(
        """SELECT f_table_name, f_geometry_column, type, srid
             FROM geometry_columns
            WHERE f_table_schema = %s
            ORDER BY f_table_name;""", (schema,))
    rows = cur.fetchall()
    layers = []
    for table, geom_col, geom_type, srid in rows:
        cur.execute(
            """SELECT column_name FROM information_schema.columns
                WHERE table_schema = %s AND table_name = %s;""", (schema, table))
        cols = {r[0] for r in cur.fetchall()}
        layers.append(dict(table=table, geom_col=geom_col,
                           geom_type=(geom_type or "").upper(),
                           srid=srid, columns=cols))
    cur.close()
    return layers


def base_geometry(geom_type):
    g = geom_type.upper()
    if "POINT" in g:
        return "point"
    if "LINE" in g:
        return "line"
    if "POLYGON" in g:
        return "polygon"
    return "point"


def change_token(conn, schema, table, columns):
    """Cheap fingerprint that changes when the table data changes."""
    cur = conn.cursor()
    if "lastupdatedatetime" in columns:
        extra = "max(lastupdatedatetime)::text"
    else:
        pk = next((c for c in PK_CANDIDATES if c in columns), None)
        extra = f"max({pk})::text" if pk else "'-'"
    cur.execute(f'SELECT count(*)::text, {extra} FROM "{schema}"."{table}";')
    cnt, tok = cur.fetchone()
    cur.close()
    return cnt, (tok or "-")


# ── Per-layer plan ───────────────────────────────────────────────────────────
def resolve_columns(layer, style_props, overrides):
    """Map rendered style props -> SQL expressions for this layer.

    Returns ordered list of (alias, sql_expression). Anything the style does
    not render is omitted entirely (smallest tiles)."""
    table_cols = layer["columns"]
    selected = []
    for prop in sorted(style_props):
        if prop in overrides:                 # explicit style-prop -> column map
            selected.append((prop, overrides[prop]))
        elif prop in table_cols:              # name matches a real column
            selected.append((prop, prop))
        else:
            log.warning("[%s] style needs '%s' but no matching column — skipped",
                        layer["table"], prop)
    return selected


def layer_signature(plan):
    """Stable hash over everything that affects a layer's output tiles."""
    payload = json.dumps({
        "table": plan["table"], "geom_col": plan["geom_col"],
        "geom_type": plan["geom_type"], "srid": plan["srid"],
        "columns": plan["columns"], "minzoom": plan["minzoom"],
        "maxzoom": plan["maxzoom"], "tippecanoe": plan["tippecanoe_flags"],
        "count": plan["count"], "token": plan["token"],
    }, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()


def tippecanoe_flags(base, minzoom):
    """Geometry-aware flags tuned for minimum size."""
    common = ["--no-tile-stats", "-P", "--force"]
    if base == "point":
        return common + ["-r1", "--drop-densest-as-needed"]
    if base == "line":
        return common + ["--simplification=10", "--drop-densest-as-needed"]
    # polygon
    return common + ["--detect-shared-borders", "--simplification=10",
                     "--coalesce-densest-as-needed", "--drop-densest-as-needed"]


# ── Export + build ───────────────────────────────────────────────────────────
def export_geojson(plan):
    """PostGIS -> GeoJSONSeq with only the needed columns. Returns feature count."""
    table, geom = plan["table"], plan["geom_col"]
    select = [f'"{geom}" AS geom']
    for alias, expr in plan["columns"]:
        select.append(f'{expr} AS "{alias}"')
    sql = f'SELECT {", ".join(select)} FROM "{SCHEMA}"."{table}"'

    pg = (f'PG:host={DB["host"]} port={DB["port"]} dbname={DB["dbname"]} '
          f'user={DB["user"]} password={DB["password"]}')
    out = os.path.join(TMP_DIR, f"{table}.geojsonl")
    cmd = ["ogr2ogr", "-f", "GeoJSONSeq", out, pg, "-sql", sql,
           "-nln", table, "-lco", "COORDINATE_PRECISION=6",
           "-lco", "RFC7946=NO"]
    if plan["srid"] and int(plan["srid"]) != 4326:
        cmd += ["-t_srs", "EPSG:4326"]
    run(cmd, what=f"export {table}")

    with open(out, "rb") as fh:                       # GeoJSONSeq = 1 feature/line
        features = sum(1 for _ in fh)
    plan["geojson"] = out
    return features


def build_layer_tiles(plan):
    out = os.path.join(CACHE_DIR, f'{plan["table"]}.mbtiles')
    cmd = ["tippecanoe", "-o", out, "-l", plan["table"],
           "-Z", str(plan["minzoom"]), "-z", str(plan["maxzoom"])]
    cmd += plan["tippecanoe_flags"]
    if plan["columns"]:
        for alias, _ in plan["columns"]:
            cmd += ["-y", alias]                      # keep only these attributes
    else:
        cmd += ["-X"]                                 # drop all attributes
    cmd += [plan["geojson"]]
    run(cmd, what=f'tiles {plan["table"]}')
    plan["mbtiles"] = out
    plan["bytes"] = os.path.getsize(out)
    return out


# ── Validation ───────────────────────────────────────────────────────────────
def validate(expected_layers):
    """Open the final mbtiles and assert every expected layer is present."""
    if not os.path.exists(FINAL):
        raise RuntimeError("custom.mbtiles was not produced")
    con = sqlite3.connect(FINAL)
    cur = con.cursor()
    meta = dict(cur.execute("SELECT name, value FROM metadata;").fetchall())
    tiles = cur.execute("SELECT count(*) FROM tiles;").fetchone()[0]
    present = set()
    try:
        present = {v["id"] for v in json.loads(meta.get("json", "{}")).get("vector_layers", [])}
    except ValueError:
        pass
    con.close()
    if tiles == 0:
        raise RuntimeError("custom.mbtiles has 0 tiles")
    missing = set(expected_layers) - present
    if missing:
        raise RuntimeError(f"layers missing from output: {sorted(missing)}")
    log.info("validation OK — %d tiles, layers: %s", tiles, ", ".join(sorted(present)))
    return tiles, meta


# ── Helpers ──────────────────────────────────────────────────────────────────
def run(cmd, what):
    log.debug("$ %s", " ".join(cmd))
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        log.error("%s failed (exit %d)\n%s", what, res.returncode,
                  (res.stderr or res.stdout).strip())
        raise RuntimeError(f"{what} failed")
    return res


def human(n):
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.1f}{unit}"
        n /= 1024


def load_manifest():
    try:
        return json.load(open(MANIFEST))
    except (OSError, ValueError):
        return {}


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    logging.basicConfig(
        level=logging.DEBUG if os.environ.get("DEBUG") else logging.INFO,
        format="%(asctime)s %(levelname)-5s %(message)s", datefmt="%H:%M:%S")
    t0 = time.time()
    os.makedirs(TMP_DIR, exist_ok=True)
    os.makedirs(CACHE_DIR, exist_ok=True)

    cfg = yaml.safe_load(open(CONFIG_PATH)) or {}
    defaults = cfg.get("defaults", {})
    cfg_layers = cfg.get("layers", {}) or {}
    include = set(cfg.get("include", []) or [])
    exclude = set(cfg.get("exclude", []) or [])
    style_path = os.environ.get("STYLE", cfg.get("style", "/style.json"))

    style_props = style_properties_by_layer(style_path)
    log.info("style %s references %d source-layers", style_path, len(style_props))

    conn = psycopg2.connect(**DB)
    discovered = discover_layers(conn, SCHEMA)
    log.info("discovered %d geometry layers in schema '%s': %s",
             len(discovered), SCHEMA, ", ".join(l["table"] for l in discovered))

    manifest = load_manifest()
    new_manifest = {}
    plans, stats, failures = [], [], []
    rebuilt = 0

    # ── Plan + (incrementally) build each layer ──────────────────────────────
    for layer in discovered:
        table = layer["table"]
        if table in exclude or (include and table not in include):
            log.info("[%s] skipped (include/exclude rule)", table)
            continue

        over = cfg_layers.get(table, {})
        used = style_props.get(table, set())
        plan = dict(
            table=table, geom_col=layer["geom_col"], geom_type=layer["geom_type"],
            srid=layer["srid"], base=base_geometry(layer["geom_type"]),
            minzoom=int(over.get("minzoom", defaults.get("minzoom", 6))),
            maxzoom=int(over.get("maxzoom", defaults.get("maxzoom", 14))),
            columns=resolve_columns(layer, used, over.get("columns", {})),
        )
        plan["tippecanoe_flags"] = tippecanoe_flags(plan["base"], plan["minzoom"])
        plan["count"], plan["token"] = change_token(conn, SCHEMA, table, layer["columns"])
        sig = layer_signature(plan)

        cached = manifest.get(table, {})
        cache_file = os.path.join(CACHE_DIR, f"{table}.mbtiles")
        if int(plan["count"]) == 0:
            log.info("[%s] 0 rows — skipped", table)
            continue

        if not FORCE and cached.get("sig") == sig and os.path.exists(cache_file):
            plan["mbtiles"] = cache_file
            plan["bytes"] = os.path.getsize(cache_file)
            features = cached.get("features", int(plan["count"]))
            log.info("[%s] unchanged — reusing cache (%s, %s features)",
                     table, human(plan["bytes"]), features)
        else:
            try:
                log.info("[%s] building  z%d-%d  %s  attrs=%s",
                         table, plan["minzoom"], plan["maxzoom"], plan["base"],
                         [a for a, _ in plan["columns"]] or "(none)")
                features = export_geojson(plan)
                build_layer_tiles(plan)
                rebuilt += 1
                log.info("[%s] built %s (%s features)",
                         table, human(plan["bytes"]), features)
            except Exception as exc:                  # keep going, fail at end
                log.error("[%s] FAILED: %s", table, exc)
                failures.append(table)
                continue

        new_manifest[table] = dict(sig=sig, features=int(features),
                                   bytes=plan["bytes"], mbtiles=cache_file)
        plans.append(plan)
        stats.append((table, plan["base"], int(features), plan["bytes"],
                      plan["minzoom"], plan["maxzoom"]))

    conn.close()

    if not plans:
        log.error("no layers built — aborting")
        sys.exit(1)

    # ── Merge (only when something changed or final is missing) ───────────────
    need_join = FORCE or rebuilt > 0 or not os.path.exists(FINAL) \
        or set(new_manifest) != set(manifest)
    if need_join:
        log.info("merging %d layers into custom.mbtiles ...", len(plans))
        run(["tile-join", "--force", "--no-tile-stats",
             "--name=custom", "--attribution=VIOUNA",
             "--description=VIOUNA custom layers (PostGIS)",
             "-o", FINAL] + [p["mbtiles"] for p in plans], what="tile-join")
    else:
        log.info("no changes — custom.mbtiles is up to date")

    json.dump(new_manifest, open(MANIFEST, "w"), indent=2)

    # ── Validate + report ────────────────────────────────────────────────────
    tiles, _ = validate([p["table"] for p in plans])

    log.info("─" * 64)
    log.info("%-18s %-8s %9s %11s  %s", "layer", "geom", "features", "size", "zoom")
    log.info("─" * 64)
    for table, base, feats, byts, zmin, zmax in sorted(stats):
        log.info("%-18s %-8s %9d %11s  z%d-%d",
                 table, base, feats, human(byts), zmin, zmax)
    log.info("─" * 64)
    log.info("custom.mbtiles: %s, %d tiles, %d layers (%d rebuilt) in %.1fs",
             human(os.path.getsize(FINAL)), tiles, len(plans), rebuilt, time.time() - t0)

    if failures:
        log.error("layers failed: %s", ", ".join(failures))
        sys.exit(1)


if __name__ == "__main__":
    main()
