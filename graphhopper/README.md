<div dir="rtl">

# GraphHopper

## توضیحات

سرویس مسیریابی **GraphHopper** با تصویر ساخته‌شده از همین مخزن (`Dockerfile`) و Docker Compose اجرا می‌شود. API وب پیش‌فرض روی پورت **8989** است (مثلاً `/route`).

## پیش‌نیازها

- **Docker** و **Docker Compose**
- سورس رسمی GraphHopper داخل پوشهٔ **`graphhopper/graphhopper/`** (کلون از [GitHub](https://github.com/graphhopper/graphhopper))؛ طبق نیاز پروژه، فایل‌های اضافی مثل `config.xml` قدیمی را حذف کنید.
- شبکه‌های Docker از قبل ایجاد شده باشند:
  - **`map_services_net`** — مشترک با Tile Server، Gateway، GeoServer و …
  - **`fleet-net`** — برای ارتباط با بک‌اند

```bash
docker network create map_services_net   # اگر هنوز وجود ندارد
docker network create fleet-net
```

## ساخت تصویر

از ریشهٔ همین پوشه (`graphhopper/`):

```bash
docker build -t graphhopper:latest .
```

برای انتقال تصویر به سرور دیگر (اختیاری):

```bash
docker save -o graphhopper.tar graphhopper:latest
```

## داده و ولوم‌ها

مسیر **`./data`** نسبت به همان پوشه‌ای است که `docker-compose.yml` قرار دارد:

| نقش | مسیر نسبی (میزبان) |
|-----|---------------------|
| گراف و ورودی OSM / کش | `./data` (پیش‌فرض اسکریپت: `/data/default-gh` داخل کانتینر) |
| لاگ | `./data/logs` |

پوشه‌ها در اولین اجرا در صورت نبودن توسط Docker ساخته می‌شوند؛ در صورت خطای دسترسی، مالکیت را با `chown` اصلاح کنید.

## اجرا

```bash
docker compose up --build -d
```

بازسازی کامل کانتینر:

```bash
docker compose up --build -d --force-recreate
```

- رابط/API: **`http://<سرور>:8989`** (داخل Docker برای سرویس‌های روی **`map_services_net`**: **`http://graphhopper:8989`**)
- پورت **8990** در `docker-compose` نقشه شده است؛ در صورت استفاده در `config-example.yml` باید با پیکربندی هم‌خوان باشد.

اولین بار با import گراف ممکن است زمان‌بر باشد؛ **`start_period`** healthcheck این تأخیر اولیه را در نظر می‌گیرد.

## شبکه

- **`map_services_net`:** درخواست بین سرویس‌های نقشه (مثلاً از Gateway یا سرویس دیگر به `graphhopper:8989`).
- **`fleet-net`:** دسترسی به بک‌اند طبق معماری Fleet شما.

## پیکربندی و منابع

- **`config-example.yml`** و **`graphhopper.sh`** به مسیرهای داخل کانتینر mount می‌شوند؛ برای تغییر رفتار، این فایل‌ها را روی میزبان ویرایش کنید و در صورت نیاز کانتینر را دوباره بالا بیاورید.
- **`JAVA_OPTS`** در Compose (پیش‌فرض `-Xms512m -Xmx4g`) باید با **`deploy.resources.limits.memory`** هم‌خوان باشد (فضای غیر heap و سیستم‌عامل).
- برای داده و گراف خیلی بزرگ، حد حافظه و `JAVA_OPTS` را متناسب افزایش دهید.

## عیب‌یابی

```bash
docker compose logs -f graphhopper
docker inspect --format='{{json .State.Health}}' graphhopper
```

Healthcheck روی **`http://localhost:8989/health`** داخل کانتینر است (نیاز به **`curl`** در تصویر، در `Dockerfile` نصب شده است).

</div>
