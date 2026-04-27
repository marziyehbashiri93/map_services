<div dir="rtl">

# GeoServer

## توضیحات

این سرویس با تصویر رسمی `docker.osgeo.org/geoserver` و Docker Compose اجرا می‌شود و برای انتشار لایه‌های مکانی (مثلاً WMS/WMTS برای مصرف توسط Tile Server یا کلاینت‌های دیگر) مناسب است.

## پیش‌نیازها

- نصب **Docker** و **Docker Compose** (پلاگین `compose` روی Docker CLI کافی است؛ نیازی به نصب JRE روی میزبان نیست؛ JVM داخل کانتینر است).
- اگر از **SELinux** استفاده می‌کنید (مثلاً Fedora/RHEL/CentOS)، برچسب `:Z` روی ولوم‌ها در `docker-compose.yml` برای bind mount در نظر گرفته شده است.

## نصب و راه‌اندازی

### ۱. دایرکتوری داده (کنار Compose)

مسیرهای ولوم **نسبت به همان پوشه‌ای است که `docker-compose.yml` دارد** (`geoserver/`):

| نقش | مسیر روی میزبان (نسبی) |
|-----|------------------------|
| داده و پیکربندی GeoServer | `./data/geoserver_data` |
| کتابخانه‌ها / افزونه‌های اضافی | `./data/additional_libs` |
| تنظیمات Tomcat (مثلاً JNDI) | `./data/tomcat/conf` |

Docker در صورت نبودن این پوشه‌ها آن‌ها را می‌سازد (معمولاً خالی و با مالک root). در صورت خطای دسترسی، مثلاً:

```bash
cd geoserver
mkdir -p data/geoserver_data data/additional_libs data/tomcat/conf
sudo chown -R "$USER:$USER" data
```

در اولین اجرا، GeoServer دادهٔ اولیه را در `data/geoserver_data` می‌سازد؛ قبل از حذف این پوشه از بکاپ مطمئن شوید. پوشهٔ **`data/`** در `.gitignore` است تا دادهٔ حجیم وارد Git نشود. در production اگر ترجیح می‌دهید داده روی دیسک جدا (مثلاً `/srv/geoserver/...`) باشد، همان مسیرها را در `docker-compose.yml` جایگزین کنید.

### ۲. تنظیم Tomcat و JNDI (در صورت نیاز)

فایل **`context.xml`** را در **`geoserver/data/tomcat/conf/context.xml`** قرار دهید یا ویرایش کنید. این مسیر به **`/opt/apache-tomcat-9.0.89/conf`** داخل کانتینر متصل است.

**توجه:** شمارهٔ نسخهٔ Tomcat در مسیر داخل کانتینر (`9.0.89`) با نسخهٔ تصویر Docker یکی است؛ اگر در آینده نسخهٔ GeoServer/Tomcat در image عوض شود، ممکن است لازم باشد مسیر mount در `docker-compose.yml` را با مسیر واقعی داخل تصویر جدید هماهنگ کنید.

### ۳. شبکه‌های Docker

GeoServer به دو شبکه وصل است:

- **`map_services_net`:** شبکهٔ مشترک سرویس‌های نقشه (Tile Server، Gateway، GeoServer و …) تا با نام سرویس به هم درخواست بزنند. معمولاً این شبکه را **Tile Server** می‌سازد؛ در غیر این صورت یک بار روی میزبان اجرا کنید:
(الزامی). باید از قبل وجود داشته باشد، مثلاً:  

```bash
docker network create map_services_net
```

- **`fleet-net`:** شبکهٔ **خارجی** برای ارتباط با بک‌اند (الزامی). باید از قبل وجود داشته باشد، مثلاً:  
```bash
docker network create fleet-net
```

  (اگر در زیرساخت شما نام یا نحوهٔ ساخت دیگری دارید، همان را استفاده کنید.)

### ۴. اجرای سرویس

از داخل همین پوشه (`geoserver`):

```bash
docker compose up --build -d
```

در صورت نیاز به ساخت مجدد کامل:

```bash
docker compose up --build -d --force-recreate
```

### ۵. دسترسی به رابط وب

- مرورگر: **`http://<آدرس-سرور>:8090/geoserver`**
- داخل Docker، نام سرویس **`geoserver`** و پورت داخلی **`8080`** است (مثلاً برای سرویس دیگری روی همان شبکه: `http://geoserver:8080/geoserver/...`).

اولین بار ممکن است به‌خاطر نصب افزونه‌ها و بالا آمدن JVM، چند دقیقه طول بکشد؛ healthcheck با **`start_period: 120s`** این تأخیر را در نظر می‌گیرد.

## شبکهٔ مشترک نقشه

سرویس‌های map (مثل `tileserver`، `map_nginx`، `geoserver`) روی **`map_services_net`** هستند؛ آدرس داخلی GeoServer برای بقیهٔ همان سرویس‌ها: **`http://geoserver:8080/geoserver/...`**. برای بک‌اندهایی که روی **`fleet-net`** قرار می‌گیرند، از نام DNS همان شبکه استفاده کنید.

## پیکربندی مهم (خلاصه)

- **نسخه GeoServer:** از طریق آرگومان build **`GEOSERVER_VERSION`** در `docker-compose.yml` و **`Dockerfile`** (باید با هم یکسان بمانند).
- **حافظه JVM:** متغیر **`EXTRA_JAVA_OPTS`** (مثلاً `-Xms` / `-Xmx` و `SoftRefLRUPolicyMSPerMB`)؛ حد حافظهٔ کانتینر در بخش **`deploy.resources`** است و باید از `Xmx` بزرگ‌تر باشد تا فضای متaspace و فرآیندهای بومی کافی باشد.
- **افزونه‌ها:** **`STABLE_EXTENSIONS`** (مثلاً `oracle,vectortiles`)؛ برای Oracle ممکن است به JARهای اضافی در **`additional_libs`** نیاز باشد.
- **CORS:** **`CORS_ENABLED=true`** برای فراخوانی از دامنه‌های دیگر (در صورت نیاز محدودسازی مبدأ را در خود GeoServer بررسی کنید).

## ورودی‌ها و خروجی‌ها

- **ورودی:** داده در `data/geoserver_data`، افزونه/کتابخانه در `data/additional_libs`، `context.xml` و سایر فایل‌های `conf` در `data/tomcat/conf`.
- **خروجی:** سرویس‌های استاندارد GeoServer (REST، WMS، …) روی پورت منتشرشدهٔ میزبان (**8090**).

## عیب‌یابی

- لاگ کانتینر: `docker compose logs -f geoserver`
- وضعیت سلامت: `docker inspect --format='{{json .State.Health}}' geoserver`
- اگر healthcheck همیشه ناموفق است، بررسی کنید آیا REST در نصب شما بدون احراز هویت به **`/geoserver/rest/about/version`** پاسخ می‌دهد؛ در غیر این صورت باید endpoint یا امنیت REST را با پیکربندی شما هماهنگ کنید.

</div>
