# Map Services

## توضیحات
این پروژه شامل چندین سرویس برای ارائه نقشه‌های جغرافیایی و داده‌های مکانی است. هر سرویس دارای فایل README مخصوص به خود است که توضیحات، پیش‌نیازها، نحوه اجرا، ورودی‌ها و خروجی‌های آن را ارائه می‌دهد.

## سرویس‌ها
- [GeoServer](geoserver/README.md): برای ارائه نقشه‌های جغرافیایی و داده‌های مکانی.
- [Map gateway](map_gateway/README.md): Nginx برای سرو استایل/اسپرایت/فونت استاتیک و پروکسی سرویس‌های نقشه.
- [MBTile Pipeline](mbtile_pipeline/README.md): مسیر فعلی ساخت `osm.mbtiles` از فایل OSM PBF با Planetiler و ساخت `custom.mbtiles` از داده‌های PostGIS با Tippecanoe.
- [Map Assets](map_assets/styles/base): استایل‌ها، توکن‌ها، sprite و فونت‌های نقشه که مستقل از سرویس legacy نگه‌داری می‌شوند.
- [GraphHopper](graphhopper/README.md): سرویس مسیریابی بر پایه داده‌های OSM.

## نمونه سایت با Mapbox
این پروژه همچنین شامل یک نمونه سایت با استفاده از Mapbox است که می‌توانید برای نمایش نقشه‌ها از آن استفاده کنید.
