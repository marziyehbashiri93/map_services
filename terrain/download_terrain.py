#!/usr/bin/env python3
"""
Download Terrarium terrain tiles from AWS S3 for a given bounding box.
Output structure: tiles/{z}/{x}/{y}.png  (Mapbox-compatible)
"""

import math
import os
import sys
import time
import logging
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import urllib.request
import urllib.error

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
BBOX = (40.0, 22.0, 65.0, 42.0)          # min_lon, min_lat, max_lon, max_lat
ZOOM_MIN = 1
ZOOM_MAX = 10
OUTPUT_DIR = Path(__file__).parent / "tiles"
BASE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
MAX_WORKERS = 8
MAX_RETRIES = 3
RETRY_DELAY = 2   # seconds between retries

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Tile math
# ---------------------------------------------------------------------------
def deg2tile(lat: float, lon: float, z: int) -> tuple[int, int]:
    n = 2 ** z
    x = int((lon + 180.0) / 360.0 * n)
    lat_r = math.radians(lat)
    y = int((1.0 - math.log(math.tan(lat_r) + 1.0 / math.cos(lat_r)) / math.pi) / 2.0 * n)
    return x, y


def tiles_for_bbox(min_lon, min_lat, max_lon, max_lat, zoom_min, zoom_max):
    tiles = []
    for z in range(zoom_min, zoom_max + 1):
        x0, y0 = deg2tile(max_lat, min_lon, z)   # top-left  (max_lat → min y)
        x1, y1 = deg2tile(min_lat, max_lon, z)   # bottom-right
        n = 2 ** z
        x0, x1 = max(0, x0), min(n - 1, x1)
        y0, y1 = max(0, y0), min(n - 1, y1)
        for x in range(x0, x1 + 1):
            for y in range(y0, y1 + 1):
                tiles.append((z, x, y))
    return tiles


# ---------------------------------------------------------------------------
# Download
# ---------------------------------------------------------------------------
def download_tile(z: int, x: int, y: int) -> tuple[bool, str]:
    url = BASE_URL.format(z=z, x=x, y=y)
    path = OUTPUT_DIR / str(z) / str(x) / f"{y}.png"

    if path.exists():
        return True, "skip"

    path.parent.mkdir(parents=True, exist_ok=True)

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "VIOUNA-terrain-downloader/1.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            path.write_bytes(data)
            return True, "ok"
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return False, f"404"
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
        except Exception as e:
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
            else:
                return False, f"err:{e}"

    return False, "failed"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    min_lon, min_lat, max_lon, max_lat = BBOX
    log.info(f"Bbox: lon={min_lon}-{max_lon}, lat={min_lat}-{max_lat}")
    log.info(f"Zoom: {ZOOM_MIN}-{ZOOM_MAX}")

    tiles = tiles_for_bbox(min_lon, min_lat, max_lon, max_lat, ZOOM_MIN, ZOOM_MAX)
    total = len(tiles)
    log.info(f"Tiles to download: {total:,}")

    done = skipped = failed = 0
    start = time.time()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(download_tile, z, x, y): (z, x, y) for z, x, y in tiles}
        for i, future in enumerate(as_completed(futures), 1):
            ok, status = future.result()
            if status == "skip":
                skipped += 1
            elif ok:
                done += 1
            else:
                failed += 1

            if i % 200 == 0 or i == total:
                elapsed = time.time() - start
                rate = i / elapsed if elapsed > 0 else 0
                eta = (total - i) / rate if rate > 0 else 0
                log.info(
                    f"[{i:,}/{total:,}]  done={done} skip={skipped} fail={failed}"
                    f"  {rate:.0f} t/s  ETA {eta:.0f}s"
                )

    elapsed = time.time() - start
    log.info(f"Finished in {elapsed:.0f}s — done={done} skipped={skipped} failed={failed}")


if __name__ == "__main__":
    main()
