<div dir="rtl">

پروژه مپ سرویس یک پروژه شامل تمام نیازمندی ها برای لود و مسیریابی در نقشه است.هدف این پروژه تبدیل فایل pbf به یک نقشه زیبا و قابل فهم برای کابر است.

1.مسیر فعلی ساخت tile در پوشه `mbtile_pipeline` قرار دارد. فایل OSM PBF مستقیماً با Planetiler به `osm.mbtiles` تبدیل می‌شود و داده‌های شخصی از PostGIS با Tippecanoe به `custom.mbtiles` تبدیل می‌شوند.
2.سرویس Martin داخل `mbtile_pipeline` خروجی‌های `osm.mbtiles` و `custom.mbtiles` را سرو می‌کند.
3.سرویس تایل سرور (پوشه تایل سرور)جهت نمایش نقشه و تایل کردن ان چندین نیازمندی دارد:
الف)فونت:به صورت استاتیک و بدون تغییر داخل فولدر font
ب)استایل:استایل ها داخل فولدر استایل هستند.برای اینکه به توان به صورت داینامیک و با صرف کمترین زمان استایل جدید تولید شود؛داخل پوشه base استایل اولیه و توکن های رنگی و ادرس سرور ها قرار داده شده است.سپس توسط اسکریپت style_convertor  به فایل استایل کامل و قابل قبول برای مپ باکس تبدیل میشود.
پ)sprite:در پوشه ای با همین نام قرار دارد .ایکون های موجود در فایل icon توسط combine_image.py  به فایل sprite  تبدیل میشوند.
ت)فایل کانفیگ:یک فایل استایتک و ثابت
ث)mbfile: در پوشه tile  قرار دارد.توسط مرحله 3 ایجاد شده است.
4.فولدر graphhopper مربوط به یک سرویس اوپن سورس جهت مسیریاب است.ایمیج بیلد شده این سرویس در این پوشه نیز موجود است.
5.مپ باکس سایت یک سایت تست است که در آن کاربر میتواند استایل های مختلف نقشه را مشاهده کند و باگ های آن را برطرف کند.
اگر در اینده تست مسیریاب هم اضافه شود بهتر است
6.سرویس map_gateway مربوط به کانفیگ nginx  میباشد.



# پرامپت کامل و جامع برای تحلیل و دیپلوی پروژه Map Services

# تحلیل جامع و ساخت Ansible Playbook برای پروژه Map Services

## 1️⃣ معرفی کامل پروژه

این پروژه یک **سیستم نقشه‌ی کامل و مستقل** است که شامل چندین سرویس مجزا و وابسته به هم می‌باشد:

### معماری کلی سیستم
پروژه از **معماری Microservices** استفاده می‌کند و شامل این کامپوننت‌های اصلی است:

#### A) **mbtile_pipeline / OSM build** — OSM Tile Generation
- وظیفه: خواندن فایل OSM PBF و تولید `osm.mbtiles` با Planetiler
- استفاده از `mbtile_pipeline/osm/profile.yml` برای تعریف لایه‌ها و فیلدهای OSM
- این مسیر دیگر برای OSM به import واسط داخل PostgreSQL وابسته نیست

#### B) **mbtile_pipeline / Custom build** — Custom Tile Generation
- وظیفه: خواندن داده‌های شخصی از PostGIS و تولید `custom.mbtiles`
- خروجی: فایل‌های `osm.mbtiles` و `custom.mbtiles` در `mbtile_pipeline/data/`
- این مسیر لایه‌ها را خودکار کشف می‌کند و فقط فیلدهای استفاده‌شده در style را داخل tile نگه می‌دارد

#### C) **Martin + Map Assets** — Core Tile and Asset Service
- **پورت Martin:** 3000
- **وظیفه Martin:** سرو کردن `osm.mbtiles` و `custom.mbtiles` از `mbtile_pipeline/data/`
- **فایل‌های asset:**
  - **Font:** فایل‌های فونت استاتیک در `map_assets/fonts/`
  - **Style:**
    - `map_assets/styles/base/` → استایل‌های اولیه، tokenهای رنگی و configهای خروجی
    - `map_assets/styles/server_*` → خروجی‌های تولیدشده
    - `map_assets/styles/base/style_convertor.py` → تولید styleهای MapLibre و publish به gateway
  - **Sprite:**
    - `map_assets/sprites/`
    - تولید شده از فایل‌های `icon` با اسکریپت `combine_images.py`

- **اسکریپت‌های کلیدی:**
  - `map_assets/styles/base/style_convertor.py` → انتشار assetها برای Nginx gateway
- **بهبود**
  - در صورت نیاز میتوان ساختار و نام پروژه تغییر کند.

#### D) **map_gateway** — Nginx Reverse Proxy & Static Asset Server
- **پورت host:** 8080
- **وظیفه:**
  - سرو کردن asset های استاتیک versioned (styles, sprites, fonts)
  - Proxy کردن درخواست‌های tile به tile backend
- **Endpoint های اصلی:**
  - `/styles/v1/*.json` → استایل‌های versioned
  - `/sprite/v1/*` → sprite های versioned
  - `/fonts/{fontstack}/{range}.pbf` → فونت‌ها
  - `/data/*.json` یا endpointهای tile backend → metadata تایل‌ها
  - مسیرهای tile backend → proxy به سرویس tile

- **فایل‌های تنظیمات:**
  - `nginx/nginx.conf` → تنظیمات اصلی
  - `nginx/conf.d/00-upstreams.conf` → تعریف upstream ها
  - `nginx/conf.d/10-gateway-http.conf` → تنظیمات HTTP
  - `nginx/conf.d/map.ssl.conf.example` → نمونه تنظیمات HTTPS
  - `nginx/snippets/` → snippet های proxy/cache/security

- **Volume های مهم:**
  - `data/map_assets/styles/v1/` → استایل‌های منتشر شده
  - `data/map_assets/sprite/v1/` → sprite های منتشر شده
  - `data/map_assets/fonts/` → فونت‌های منتشر شده

#### E) **GraphHopper** — Routing Service
- **پورت:** 8989
- **وظیفه:** سرویس مسیریابی open-source
- **API endpoint:** `/route`
- **وابستگی‌ها:**
  - سورس کد GraphHopper در `graphhopper/graphhopper/`
  - فایل‌های OSM در `./data/`
  - Graph cache در `./data/default-gh/`
  - Log ها در `./data/logs/`

- **تنظیمات:**
  - `config-example.yml` → تنظیمات GraphHopper
  - `graphhopper.sh` → اسکریپت اجرا
  - `JAVA_OPTS`: `-Xms512m -Xmx4g` (قابل تنظیم برای dataset های بزرگ)

- **Healthcheck:**
  - Endpoint: `http://localhost:8989/health`
  - `curl` نصب شده در image

#### F) **mapbox_site** — Frontend Testing Interface
- **فایل اصلی:** `index.html`
- **وظیفه:** 
  - تست و debug استایل‌های نقشه
  - نمایش نقشه با Mapbox GL JS
- **پیشنهاد آینده:** افزودن تست routing و خواندن استایل ها از nginx

### شبکه‌های Docker
- **`map_services_net`:**
  - شبکه اصلی بین Nginx، GraphHopper، GeoServer و tile backend
  - در صورت نیاز دستی ایجاد می‌شود: `docker network create map_services_net`
  - دسترسی service-to-service: `http://graphhopper:8989` و سرویس tile backend تنظیم‌شده در gateway

- **`fleet-net`:**
  - شبکه backend برای اتصال GraphHopper به معماری Fleet

### فلوی دیپلوی (Hybrid Mode)
bash
# مرحله 1: انتشار asset های hybrid
python3 map_assets/styles/base/style_convertor.py

# مرحله 2: اجرای tile backend
cd mbtile_pipeline
make serve

# مرحله 3: اجرای Nginx Gateway
cd ../map_gateway
docker compose up -d --build

**چرا این ترتیب مهم است؟**
- اگر شبکه وجود نداشته باشد: `docker network create map_services_net`
- Nginx باید به سرویس tile backend و assetهای منتشرشده دسترسی داشته باشد

### فلوی انتشار استایل (Style Publishing)
**چرا نیاز است؟**
- استایل‌ها در `map_assets/styles/base` تولید می‌شوند و sourceهای vector tile به endpointهای Martin (`/osm` و `/custom`) اشاره می‌کنند
- کلاینت نیاز به URL های HTTP برای style، sprite، font و tile endpointها دارد

**اسکریپت `style_convertor.py` چه کاری انجام می‌دهد؟**
1. استایل‌های JSON را به `map_gateway/data/map_assets/styles/v1/` می‌نویسد
2. URL ها را تنظیم می‌کند:
   - `glyphs` → `/fonts/{fontstack}/{range}.pbf`
   - `sprite` → `/sprite/v1/sprite`
   - sourceهای OSM → `/osm/{z}/{x}/{y}`
   - sourceهای custom → `/custom/{z}/{x}/{y}`
3. sprite ها را به `map_gateway/data/map_assets/sprite/v1/` کپی می‌کند
4. فونت‌ها را به `map_gateway/data/map_assets/fonts/` کپی می‌کند
5. کاتالوگ استایل‌ها را تولید می‌کند: `styles/v1/styles.json`

**دیپلوی بعد از تغییر استایل:**
bash
python3 map_assets/styles/base/style_convertor.py
cd map_gateway
docker compose restart nginx

**اگر فایل‌های `nginx/` تغییر کردند:**
bash
docker compose up -d --build

---

## 2️⃣ نیازمندی‌های تحلیل و خروجی

من نیاز دارم که **تمام فایل‌های پروژه** (Dockerfile ها، docker-compose ها، config ها، اسکریپت‌ها، nginx conf ها) را با **دقت خط‌به‌خط** بررسی کنی و موارد زیر را ارائه دهی:

### A) 🔒 تحلیل امنیتی جامع (Security Audit)

#### Dockerfile ها:
- استفاده از base image های امن و به‌روز
- اجرای container به‌عنوان non-root user
- عدم استفاده از `--privileged`
- مدیریت صحیح secret ها و credential ها
- استفاده از multi-stage build برای کاهش attack surface
- scan کردن vulnerability ها

#### docker-compose ها:
- network isolation صحیح
- عدم استفاده از `privileged: true`
- محدودیت منابع (memory, CPU limits)
- مدیریت volume permission ها
- استفاده از read-only volume ها جایی که امکان دارد
- expose نکردن پورت‌های غیرضروری به host

#### Nginx Configuration:
- CORS policy مناسب
- Rate limiting برای جلوگیری از abuse
- Security headers (X-Frame-Options, CSP, HSTS, etc.)
- محدودیت request size
- timeout های مناسب
- محافظت در برابر DDoS

#### اسکریپت‌ها (Python/Bash):
- Input validation
- Path traversal prevention
- Command injection prevention
- مدیریت خطا و exception handling

### B) ⚡ تحلیل پرفورمنس (Performance Analysis)

#### Martin / Tile Backend:
- استراتژی caching تایل‌ها
- pre-rendering vs on-demand rendering
- بهینه‌سازی memory برای font/sprite loading
- connection pooling به PostgreSQL
- تنظیمات worker/thread

#### Nginx:
- HTTP/2 support
- Gzip/Brotli compression
- Static asset caching (Cache-Control headers)
- Proxy caching برای tile endpoint ها
- Buffer size optimization
- Keepalive settings

#### GraphHopper:
- تنظیمات JVM heap size مناسب با dataset
- Graph caching strategy
- Memory mapping optimization

#### PostgreSQL (اگر در پروژه هست):
- Connection pooling
- Index optimization
- Query performance
- Shared buffer settings

### C) 🛡️ تحلیل پایداری (Stability & Reliability)

#### Container Orchestration:
- Restart policies مناسب (`unless-stopped`, `on-failure`)
- Health checks برای تمام سرویس‌ها
- Dependency ordering (`depends_on` با `condition: service_healthy`)
- Graceful shutdown handling

#### Logging & Monitoring:
- Log rotation
- Centralized logging
- Metrics collection (Prometheus-ready endpoints)
- Error tracking

#### Data Persistence:
- Volume backup strategy
- Data integrity checks
- Disaster recovery plan

#### Resource Management:
- Memory limits واقع‌بینانه
- CPU limits
- Disk space monitoring
- OOM killer prevention

### D) 📐 تحلیل معماری (Architecture Analysis)

- Service dependency graph
- Single points of failure
- Scalability bottlenecks
- Network topology optimization
- Service discovery mechanism
- Load balancing strategy

### E) 🚀 قابلیت استقرار (Deployability)

- Zero-downtime deployment strategy
- Rollback mechanism
- Configuration management
- Environment-specific configs (dev/staging/prod)
- CI/CD readiness

---

## 3️⃣ خروجی نهایی مورد انتظار

### 1. گزارش تحلیل جامع شامل:
- **Security Audit Report** با priority بندی (Critical/High/Medium/Low)
- **Performance Bottleneck Analysis** با پیشنهادات بهینه‌سازی
- **Stability Assessment** با نقاط ضعف و راه‌حل‌ها
- **Architecture Review** با diagram و توضیحات
- **Actionable Recommendations** با اولویت‌بندی اجرا

### 2. Ansible Playbook کامل و production-ready که:

#### مراحل نصب و راه‌اندازی:
yaml
# ساختار کلی playbook مورد انتظار:

1. Pre-flight checks:
   - بررسی OS compatibility
   - بررسی منابع سیستم (RAM, Disk, CPU)
   - بررسی دسترسی‌های شبکه

2. System preparation:
   - نصب Docker Engine
   - نصب Docker Compose plugin
   - تنظیمات kernel (sysctl)
   - تنظیمات firewall/iptables
   - ایجاد user/group مخصوص

3. Directory structure:
   - ایجاد `/opt/map_services/`
   - ایجاد data directories با permission صحیح
   - ایجاد log directories

4. Network setup:
   - ایجاد `map_services_net`
   - ایجاد `fleet-net`

5. Service deployment (به ترتیب):
   - PostgreSQL (اگر وجود دارد)
   - Martin / MBTile Pipeline:
     - کپی configها و فایل‌های mbtiles
     - اجرای `make serve`
     - Health check
   - GraphHopper:
     - کپی configs و data
     - Build و start container
     - Health check
   - Nginx Gateway:
     - کپی nginx configs
     - کپی SSL certificates (اگر وجود دارد)
     - Build و start container
     - Health check

6. Post-deployment:
   - Verification tests
   - Smoke tests برای endpoint ها
   - Setup monitoring/logging
   - Backup configuration

7. Maintenance tasks:
   - Log rotation setup
   - Cron jobs برای cleanup
   - Update scripts

#### ویژگی‌های playbook:
- **Idempotent:** قابل اجرای مکرر بدون مشکل
- **Modular:** تقسیم به role های مجزا
- **Configurable:** استفاده از variables برای تنظیمات
- **Environment-aware:** پشتیبانی از dev/staging/prod
- **Error handling:** مدیریت خطا و rollback
- **Documented:** توضیحات کامل برای هر task

#### فایل‌های مورد نیاز:

ansible/
├── playbook.yml                 # Main playbook
├── inventory/
│   ├── production.yml
│   └── staging.yml
├── group_vars/
│   ├── all.yml                  # Global variables
│   └── production.yml
├── roles/
│   ├── common/                  # System prep
│   ├── docker/                  # Docker installation
│   ├── mbtile_pipeline/
│   ├── graphhopper/
│   ├── nginx_gateway/
│   └── monitoring/
└── README.md                    # Deployment guide

---

## 4️⃣ دستورالعمل اجرا

لطفاً:
1. **تمام فایل‌های پروژه را بررسی کن** (من به کل repository دسترسی دارم)
2. **تحلیل عمیق و دقیق** از هر فایل انجام بده
3. **نکات امنیتی، پرفورمنس و پایداری** را شناسایی کن
4. **پیشنهادات عملی** با کد و config واقعی ارائه بده
5. **Ansible playbook کامل** با تمام role ها و task ها بساز

**توجه:** من نیاز به یک سیستم production-ready دارم که بتوان آن را روی سرور واقعی deploy کرد.

آیا آماده‌ای که شروع کنیم؟

</div>
