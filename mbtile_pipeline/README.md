# MBTile Pipeline

سیستم تولید و سرویس‌دهی Vector Tile برای نقشه ایران — پلتفرم VIOUNA

---

## معماری کلی

```
iran.osm.pbf
     │
     ▼
 Planetiler ──────────► osm.mbtiles
                              │
 PostGIS / GeoJSON            │
     │                        │
     ▼                        │
 Tippecanoe ──────────► custom.mbtiles
                              │
                         data/ (local)
                              │
                           Martin
                        (tile server :3000)
                              │
                       Mapbox GL / SDK
```

---

## ساختار پروژه

```
mbtile_pipeline/
├── iran.osm.pbf            # فایل OSM ایران (ماهانه آپدیت)
├── docker-compose.yml      # تمام سرویس‌ها
├── Makefile                # دستورات راحت
├── .env                    # تنظیمات PostGIS
│
├── osm/
│   └── profile.yml         # تعریف لایه‌های OSM برای Planetiler
│
├── custom/
│   ├── Dockerfile          # image شامل Tippecanoe + ogr2ogr
│   ├── build.sh            # اسکریپت ساخت custom.mbtiles
│   └── data/               # فایل‌های GeoJSON (اختیاری)
│
├── martin/
│   └── config.yaml         # تنظیمات Martin tile server
│
└── data/                   # خروجی (osm.mbtiles، custom.mbtiles)
```

---

## پیش‌نیازها

- Docker و Docker Compose
- حداقل ۶ گیگابایت RAM (برای Planetiler)
- فایل `iran.osm.pbf` داخل همین فولدر

---

## تنظیمات (.env)

```env
# PostGIS (برای custom layers — وقتی داده آماده شد)
DB_HOST=host.docker.internal
DB_PORT=5432
DB_NAME=osm
DB_USER=postgres
DB_PASS=bashiri-2020
```

---

## اجرا

### Pipeline کامل ماهانه

```bash
make all
```

این دستور به ترتیب اجرا می‌کند:
1. ساخت `osm.mbtiles` از Planetiler
2. ساخت `custom.mbtiles` از Tippecanoe

### مرحله به مرحله

```bash
make build-osm      # ساخت osm.mbtiles (10-30 دقیقه)
make build-custom   # ساخت custom.mbtiles
make serve          # راه‌اندازی Martin روی پورت 3000
make stop           # خاموش کردن Martin
make clean          # حذف فایل‌های mbtiles از data/
```

---

## لایه‌های OSM (`osm.mbtiles`)

| لایه | نوع | زوم شروع | توضیح |
|------|-----|----------|-------|
| `road_major` | خط | 5 | آزادراه، بزرگراه، شریان اصلی |
| `road_intermediate` | خط | 9 | خیابان درجه دو و سه |
| `road_minor` | خط | 13 | خیابان فرعی، سرویس، مسکونی |
| `road_footway` | خط | 12 | پیاده‌رو، پله، مسیر پیاده |
| `road_other` | خط | 12 | دوچرخه‌رو، مسیر در حال ساخت و غیره |
| `landuse` | چندضلعی | 2 | کاربری زمین، فضای سبز، طبیعی |
| `river` | خط + چندضلعی | 6 | رودخانه، آبراه، دریاچه |
| `admin_divisions_polygon` | چندضلعی | 1 | مرزهای اداری |
| `admin_divisions_point_major` | نقطه | 3 | کشور، استان، شهر |
| `admin_divisions_point_minor` | نقطه | 8 | روستا، محله، شهرک |

---

## لایه‌های Custom (`custom.mbtiles`)

| لایه | منبع | زوم شروع | توضیح |
|------|------|----------|-------|
| `province` | PostGIS `static.province` | 1 | مرز استان‌ها |
| `sea` | PostGIS `static.sea` | 1 | دریا و خلیج فارس |
| `label_object` | PostGIS `static.label_object` | 1 | برچسب‌های اختصاصی |
| `violation_camera` | PostGIS `static.violation_camera` | 6 | دوربین‌های ثبت تخلف |
| `police` | PostGIS `static.police` | 6 | کلانتری و پلیس |
| `complex_service` | PostGIS `static.complex_service` | 6 | مجتمع‌های خدماتی |

---

## API سرویس Martin

وقتی Martin اجرا باشد، endpoint‌های زیر در دسترس‌اند:

```
GET http://localhost:3000/catalog
    لیست همه منابع فعال

GET http://localhost:3000/osm
    اطلاعات TileJSON لایه OSM

GET http://localhost:3000/custom
    اطلاعات TileJSON لایه‌های اختصاصی

GET http://localhost:3000/osm/{z}/{x}/{y}
    دریافت tile وکتور OSM

GET http://localhost:3000/custom/{z}/{x}/{y}
    دریافت tile وکتور custom
```

---

## Custom Pipeline — راهنمای استفاده

### حالت GeoJSON (بدون نیاز به PostGIS)

فایل‌های GeoJSON را داخل `custom/data/` قرار دهید:

```
custom/data/
├── province.geojson
├── sea.geojson
├── label_object.geojson
├── violation_camera.geojson
├── police.geojson
└── complex_service.geojson
```

سپس:

```bash
make build-custom
```

### حالت PostGIS (خودکار)

اگر فایل GeoJSON وجود نداشته باشد، pipeline به‌صورت خودکار از PostGIS export می‌کند. کافی است مقادیر `DB_*` در `.env` را تنظیم کنید.

---

## Build از صفر (ماهانه)

```bash
# 1. دانلود PBF جدید ایران از Geofabrik
curl -O https://download.geofabrik.de/asia/iran-latest.osm.pbf
mv iran-latest.osm.pbf iran.osm.pbf

# 2. اجرای کامل pipeline
make all

# 3. راه‌اندازی سرور
make serve
```

---

## مشخصات فنی

| ابزار | نسخه | کاربرد |
|-------|------|--------|
| Planetiler | 0.10.3 | تبدیل OSM PBF به MBTiles |
| Tippecanoe | latest | تبدیل GeoJSON به MBTiles |
| Martin | 0.8.0 | سرویس‌دهی Vector Tile |

- فرمت tile: MVT (Mapbox Vector Tile)
- فشرده‌سازی: gzip
- حداکثر زوم ساخت: 14 (overzoom تا 22 توسط client)
- محدوده: ایران (bbox از فایل OSM)
