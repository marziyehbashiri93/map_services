# MBTile Pipeline — راهنمای کامل

سیستم تولید و سرویس‌دهی Vector Tile برای نقشه ایران (پلتفرم VIOUNA).

این فایل کل پروسه را قدم‌به‌قدم توضیح می‌دهد: **چه چیزهایی باید چک شوند** و **چه کارهایی باید انجام دهید**.

---

## ۱. نگاه کلی به معماری

```
 iran.osm.pbf ──► Planetiler ──────────────► data/osm.mbtiles
                                                     │
 PostGIS (viuna_map / public) ──► build.py ──► data/custom.mbtiles
        (+ style JSON برای انتخاب فیلدها)            │
                                                     ▼
                                                  Martin
                                            (tile server :3000)
                                                     │
                                              MapLibre / Mapbox
```

دو خروجی نهایی داریم که هر دو در `data/` قرار می‌گیرند:

| فایل | منبع | ابزار | محتوا |
|------|------|------|-------|
| `osm.mbtiles` | `iran.osm.pbf` | Planetiler | جاده، رودخانه، کاربری زمین، مرز اداری |
| `custom.mbtiles` | PostGIS | ogr2ogr + Tippecanoe | دوربین، پلیس، مجتمع خدماتی، ایستگاه، برچسب |

Martin هر دو فایل را از روی دیسک می‌خواند و روی پورت `3000` سرویس می‌دهد.

---

## ۲. پیش‌نیازها (قبل از شروع چک کنید)

```bash
# ۱) Docker و Docker Compose نصب باشند
docker --version
docker compose version

# ۲) دیتابیس PostGIS بالا باشد (کانتینر postgres16 روی پورت 5432)
docker ps | grep postgres

# ۳) فایل OSM ایران موجود باشد
ls -lh data/iran.osm.pbf        # حدود ۲۲۷ مگابایت

# ۴) فایل style موجود باشد (برای بهینه‌سازی custom استفاده می‌شود)
ls ../tileserver/styles/base/style/day_1_admin_light.json

# ۵) حداقل ۶ گیگابایت RAM آزاد برای Planetiler
free -h
```

> اگر هر کدام از این موارد نبود، قبل از ادامه آن را آماده کنید.

---

## ۳. تنظیمات (`.env`)

فایل `.env` اطلاعات اتصال به دیتابیس را نگه می‌دارد (این فایل در git نیست چون رمز دارد).

```env
DB_HOST=host.docker.internal   # از داخل کانتینر به دیتابیس روی هاست
DB_PORT=5432
DB_NAME=viuna_map
DB_USER=marziyeh
DB_PASS=bashiri-2020
SCHEMA=public                  # schema که لایه‌ها از آن کشف می‌شوند
FORCE=                         # =1 برای ساخت کامل و نادیده‌گرفتن cache
```

**چک کنید:** اتصال به دیتابیس درست باشد:

```bash
docker run --rm --add-host host.docker.internal:host-gateway \
  mbtile_pipeline-custom-build python3 -c \
  "import psycopg2,os; psycopg2.connect(host='host.docker.internal',port=5432,\
dbname='viuna_map',user='marziyeh',password='bashiri-2020'); print('DB OK')"
```

---

## ۴. اجرای کامل (مسیر معمول)

```bash
make all      # ساخت osm.mbtiles و سپس custom.mbtiles
make serve    # راه‌اندازی Martin روی پورت 3000
```

یا مرحله‌به‌مرحله:

```bash
make build-osm      # ۱۰ تا ۳۰ دقیقه (Planetiler)
make build-custom   # چند ثانیه (PostGIS → Tippecanoe)
make serve          # راه‌اندازی سرور tile
make stop           # خاموش کردن Martin
make clean          # حذف osm.mbtiles و custom.mbtiles
```

---

## ۵. لایه‌های OSM (`osm.mbtiles`)

تعریف لایه‌ها در `osm/profile.yml` است. اگر خواستید لایه یا فیلدی اضافه/کم کنید، فقط همین فایل را ویرایش کنید و دوباره `make build-osm` بزنید.

| لایه | نوع | زوم شروع |
|------|-----|----------|
| `road_major` / `road_intermediate` / `road_minor` | خط | 5 / 9 / 13 |
| `road_footway` / `road_other` | خط | 12 |
| `landuse` | چندضلعی | 2 |
| `river` | خط + چندضلعی | 6 |
| `admin_divisions_polygon` | چندضلعی | 1 |
| `admin_divisions_point_major` / `_minor` | نقطه | 3 / 8 |

---

## ۶. لایه‌های Custom (`custom.mbtiles`) — مهم‌ترین بخش

### چطور کار می‌کند (خودکار)

اسکریپت `custom/build.py` این مراحل را خودش انجام می‌دهد:

```
۱. کشف لایه‌ها     → همهٔ جدول‌های دارای geometry در schema public
۲. خواندن style    → تشخیص اینکه هر لایه واقعاً چه فیلدهایی را رندر می‌کند
۳. export          → فقط همان فیلدها به GeoJSONSeq (با دقت مختصات کاهش‌یافته)
۴. ساخت tile       → Tippecanoe با پارامتر بهینه بر اساس نوع geometry
۵. ادغام + اعتبارسنجی → tile-join و سپس بررسی metadata خروجی
۶. گزارش آمار      → تعداد feature، حجم، tile برای هر لایه
```

**هیچ لیست دستی لازم نیست.** هر جدول جدیدی که در دیتابیس بسازید، در اجرای بعدی خودکار کشف می‌شود.

### لایه‌های فعلی

| لایه (جدول) | نوع | زوم | فیلدهای نگه‌داشته | منبع DB |
|------|-----|-----|------|------|
| `complex_service` | POINT | 6–14 | `axis_name` | `axisname` |
| `police` | POINT | 6–14 | — (فقط نقطه) | — |
| `label_object` | MULTIPOINT | 3–14 | `name` | `name` |
| `station` | MULTIPOINT | 6–14 | `name` | `name` |
| `violation_camera` | MULTIPOINT | 6–14 | — (فقط نقطه) | — |

> **اصل بهینه‌سازی:** هر property که در style رندر نشود از tile حذف می‌شود تا حجم خروجی کمینه شود. مثلاً جدول `complex_service` ۵۵ ستون دارد ولی فقط `axis_name` در tile می‌ماند.

### تنظیمات لایه‌ها (`custom/config.yml`)

این فایل فقط چیزهایی را دارد که از دیتابیس یا style قابل تشخیص نیستند:

```yaml
defaults:
  minzoom: 6
  maxzoom: 14          # بیشتر از این لازم نیست؛ overzoom سمت کلاینت انجام می‌شود

layers:
  complex_service:
    columns:
      axis_name: axisname   # نگاشت نام فیلد style → ستون واقعی دیتابیس
```

**چه وقت این فایل را ویرایش کنید:**
- زوم یک لایه را عوض کنید → `minzoom` / `maxzoom`
- نام فیلد در style با نام ستون دیتابیس فرق دارد → بخش `columns` (نگاشت)
- لایه‌ای را کلاً نخواهید → `exclude: [table_name]`
- فقط چند لایه خاص بسازید → `include: [table1, table2]`

---

## ۷. Incremental rebuild (ساخت فقط بخش تغییریافته)

برای هر لایه یک «امضای محتوا» (تعداد رکورد + آخرین تغییر + تنظیمات) در
`custom/data/.custom_cache/manifest.json` ذخیره می‌شود.

- اجرای بعدی: فقط لایه‌هایی که **تغییر کرده‌اند** دوباره ساخته می‌شوند.
- لایه‌های بدون تغییر از cache استفاده می‌کنند (تقریباً آنی).
- اگر هیچ لایه‌ای تغییر نکند، حتی مرحلهٔ ادغام هم رد می‌شود.

```bash
make build-custom          # فقط تغییرات
FORCE=1 make build-custom  # ساخت کامل همه‌چیز از صفر
```

---

## ۸. چه چیزهایی را بعد از build چک کنید

### الف) خروجی build درست بوده؟

در انتهای `make build-custom` باید جدول آمار را ببینید و خط آخر:

```
custom.mbtiles: 2.7MB, 12515 tiles, 5 layers (5 rebuilt) in 4.0s
```

اگر خطی با `FAILED` یا `layers failed` دیدید، آن لایه ساخته نشده — لاگ بالایش علت را می‌گوید.

### ب) فیلدهای داخل tile درست هستند؟

```bash
python3 - <<'EOF'
import sqlite3, json
con = sqlite3.connect("data/custom.mbtiles")
meta = dict(con.execute("SELECT name,value FROM metadata").fetchall())
for vl in json.loads(meta["json"])["vector_layers"]:
    print(vl["id"], "→ fields:", list(vl["fields"].keys()))
EOF
```

باید دقیقاً فیلدهای جدول بخش ۶ را ببینید (نه بیشتر).

### ج) Martin سرویس می‌دهد؟

```bash
make serve
curl -s http://localhost:3000/catalog        # باید custom و osm را ببینید
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/custom/6/40/26   # باید 200
```

### endpointهای Martin

```
GET /catalog                 لیست همه منابع
GET /osm                     TileJSON لایه OSM
GET /custom                  TileJSON لایه‌های custom
GET /osm/{z}/{x}/{y}         tile وکتور OSM
GET /custom/{z}/{x}/{y}      tile وکتور custom
```

---

## ۹. به‌روزرسانی ماهانه (کاری که هر ماه انجام می‌دهید)

```bash
# ۱) دانلود PBF جدید ایران
curl -L -o data/iran.osm.pbf https://download.geofabrik.de/asia/iran-latest.osm.pbf

# ۲) ساخت مجدد OSM
make build-osm

# ۳) ساخت custom (اگر دیتابیس عوض شده باشد، خودکار تشخیص می‌دهد)
make build-custom

# ۴) ری‌استارت سرور تا فایل‌های جدید را بخواند
docker compose restart martin
```

> داده‌های PostGIS را هر وقت آپدیت کردید کافی است `make build-custom` بزنید؛
> فقط لایه‌های تغییریافته دوباره ساخته می‌شوند.

---

## ۱۰. عیب‌یابی (مشکلات رایج)

| علامت | علت محتمل | راه‌حل |
|------|-----------|--------|
| `DB_HOST is required` | فایل `.env` خوانده نشده | از داخل `mbtile_pipeline/` اجرا کنید |
| اتصال DB ناموفق | کانتینر postgres خاموش یا پورت اشتباه | `docker ps`، مقادیر `.env` را چک کنید |
| `style needs '...' but no matching column` | فیلد style در دیتابیس نیست | در `config.yml` بخش `columns` نگاشت اضافه کنید |
| لایه‌ای در tile نیست | جدول صفر رکورد دارد یا در `exclude` است | تعداد رکورد و `config.yml` را چک کنید |
| Martin لایه را نشان نمی‌دهد | بعد از build ری‌استارت نشده | `docker compose restart martin` |
| Tippecanoe خطای حافظه | tileهای خیلی بزرگ | `maxzoom` را در `config.yml` کم کنید |
| تغییر دیتابیس اعمال نمی‌شود | cache قدیمی | `FORCE=1 make build-custom` |

---

## ۱۱. ساختار پروژه

```
mbtile_pipeline/
├── data/                    # خروجی‌ها (osm.mbtiles، custom.mbtiles) — در git نیست
│   └── iran.osm.pbf         # ورودی OSM
├── osm/
│   └── profile.yml          # تعریف لایه‌های OSM (Planetiler)
├── custom/
│   ├── Dockerfile           # image شامل Tippecanoe + ogr2ogr + python
│   ├── build.py             # منطق اصلی ساخت custom (کشف، export، tile، اعتبارسنجی)
│   ├── build.sh             # entrypoint نازک → build.py را صدا می‌زند
│   ├── config.yml           # زوم و نگاشت فیلدها
│   └── data/                # cache و فایل‌های موقت — در git نیست
├── martin/
│   └── config.yaml          # تنظیمات tile server
├── docker-compose.yml       # تعریف سرویس‌ها
├── Makefile                 # دستورات کوتاه
├── .env                     # رمز دیتابیس — در git نیست
└── .env.example             # نمونهٔ .env
```

---

## ۱۲. بهینه‌سازی‌ها (و محل اعمال در کد)

همهٔ موارد زیر در کد **پیاده‌سازی شده‌اند**. ستون «محل در کد» نشان می‌دهد هر کدام کجا اعمال می‌شود.

### الف) کمینه‌کردن حجم MBTiles (اولویت اول)

**۱. حذف فیلدهای بلااستفاده**
هر feature شامل هندسه + خصوصیات (ستون‌های دیتابیس) است. style خوانده می‌شود و فقط فیلدهایی که واقعاً رندر می‌شوند نگه داشته می‌شوند؛ بقیه حذف می‌شوند.

- مثال: `complex_service` در دیتابیس ۵۵ ستون دارد ولی فقط `axis_name` در tile می‌ماند. `police` و `violation_camera` چون در style فیلدی ندارند، فقط مختصات نقطه ذخیره می‌شود.
- محل در کد:
  - `custom/build.py` → `style_properties_by_layer()` (خواندن فیلدهای style)
  - `custom/build.py` → `resolve_columns()` و `SELECT` انتخابی در `export_geojson()`
  - `custom/build.py` → `build_layer_tiles()`: برای فیلدهای لازم `-y <field>` و اگر هیچ فیلدی لازم نباشد `-X` (حذف کامل خصوصیات)

**۲. cap زوم روی ۱۴**
هر سطح زوم بیشتر، تعداد tile را ~۴ برابر می‌کند. ساخت تا z14 متوقف می‌شود و کلاینت با overzoom تا z22 نمایش می‌دهد (برای نقطه‌ها بدون افت کیفیت).

- محل در کد: `custom/config.yml` → `defaults.maxzoom: 14` (و per-layer)؛ اعمال در `build.py` با `-z {maxzoom}`

**۳. حذف `--no-tile-size-limit`**
نسخهٔ قدیمی این پرچم را داشت که سقف ~۵۰۰KB هر tile را برمی‌داشت و tileها را حجیم می‌کرد. این پرچم **حذف شده** و به‌جایش `--drop-densest-as-needed` گذاشته شده تا فقط در نقاط شلوغ (زوم پایین) متراکم‌ترین featureها کنار گذاشته شوند.

- محل در کد: `custom/build.py` → `tippecanoe_flags()` (هیچ `--no-tile-size-limit` ندارد؛ `--drop-densest-as-needed` برای هر نوع geometry)

### ب) سرعت build (اولویت دوم)
- خواندن موازی Tippecanoe: پرچم `-P` در `tippecanoe_flags()`
- rebuild افزایشی: `layer_signature()` + `manifest.json` (فقط لایه‌های تغییریافته ساخته می‌شوند)

### ج) مصرف کم حافظه (اولویت سوم)
- استریم `GeoJSONSeq` (یک feature در هر خط): `export_geojson()` با `-f GeoJSONSeq`
- کاهش دقت مختصات به ۶ رقم: `-lco COORDINATE_PRECISION=6`

### د) معماری تمیز و نگه‌داری آسان (اولویت چهارم)
- کشف خودکار لایه‌ها از PostGIS: `discover_layers()`
- تنظیمات اعلانی (زوم، نگاشت فیلد): `custom/config.yml`

---

## ۱۳. مشخصات فنی

| ابزار | کاربرد |
|-------|--------|
| Planetiler | تبدیل OSM PBF به MBTiles |
| Tippecanoe (felt) | تبدیل GeoJSON به MBTiles |
| ogr2ogr (GDAL) | export از PostGIS |
| Martin | سرویس‌دهی Vector Tile |

- فرمت tile: MVT — فشرده‌سازی: gzip
- حداکثر زوم ساخت: ۱۴ (overzoom تا ۲۲ سمت کلاینت)
- محدوده: ایران (`44.32, 24.76, 63.28, 39.64`)
