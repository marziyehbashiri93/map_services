# OSM2pgsql

## توضیحات
این سرویس برای تبدیل داده‌های OpenStreetMap (OSM) به فرمت PostgreSQL با پشتیبانی از PostGIS استفاده می‌شود. با استفاده از Docker، می‌توانید داده‌های OSM را به پایگاه داده PostgreSQL وارد کنید.

## پیش‌نیازها
- Docker
- PostgreSQL با افزونه‌های PostGIS و hstore

## ایجاد پایگاه داده
1. ایجاد کاربر:
   ```sql
   CREATE USER "osmuser" WITH PASSWORD '123';
   ```
2. ایجاد پایگاه داده:
   ```sql
   CREATE DATABASE "osm" WITH OWNER "osmuser" ENCODING 'UTF8';
   ```
3. نصب افزونه‌های مورد نیاز:
   ```sql
   CREATE EXTENSION postgis;
   CREATE EXTENSION hstore;
   ```

## دانلود آخرین فایل OSM از Geofabrik
برای دانلود آخرین فایل OSM از Geofabrik، می‌توانید از لینک زیر استفاده کنید:
[دانلود فایل OSM](https://download.geofabrik.de/)

## نحوه اجرا
برای تبدیل فایل OSM به PostgreSQL، از دستور زیر استفاده کنید:
```bash
docker run -it --volume ${PWD}:/usr/local/share/osm2pgsql/file/ 3f56494444d7 --create --slim --database=osm -U osmuser -W --host=192.168.1.107 --port=5432 --style=/usr/local/share/osm2pgsql/file/default.style --input-reader=pbf /usr/local/share/osm2pgsql/file/iran-latest.osm.pbf
```

یا با استفاده از تصویر Docker دیگر:
```bash
docker run -it --volume ${PWD}:/usr/local/share/osm2pgsql/file/ iboates/osm2pgsql --create --slim --database=osm -U osmuser -W --host=192.168.1.107 --port=5432 --style=/usr/local/share/osm2pgsql/file/style.lua --output=flex --input-reader=pbf /usr/local/share/osm2pgsql/file/iran-latest.osm.pbf
```

## ورودی‌ها
- فایل OSM (مثلاً iran-latest.osm.pbf)
- فایل‌های style (default.style یا style.lua)

## خروجی‌ها
- داده‌های OSM در پایگاه داده PostgreSQL با پشتیبانی از PostGIS
- امکان استفاده از داده‌ها در سرویس‌های نقشه‌برداری

