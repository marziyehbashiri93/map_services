# OSM2pgsql
## create Database
> 1. create user "osmuser" with password '123'; 
> 2. create database "osm" with owner "osmuser"   ENCODING 'UTF8'; 
> 3. create extension postgis; 
> 4. create extension hstore;

---
## Download last osm file from geofabrik

---

#  docker run -it   --volume ${PWD}:/usr/local/share/osm2pgsql/file/ 3f56494444d7 --create --slim  --database=osm -U osmuser -W  --host=192.168.1.107 --port=5432 --style=/usr/local/share/osm2pgsql/file/default.style --input-reader=pbf /usr/local/share/osm2pgsql/file/iran-latest.osm.pbf 
# docker run -it   --volume ${PWD}:/usr/local/share/osm2pgsql/file/  iboates/osm2pgsql  --create --slim  --database=osm -U osmuser -W  --host=192.168.1.107 --port=5432 --style=/usr/local/share/osm2pgsql/file/style.lua --output=flex --input-reader=pbf /usr/local/share/osm2pgsql/file/iran-latest.osm.pbf


amenity=bus_station  terminal
highway=speed_camera