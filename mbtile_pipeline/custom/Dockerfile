FROM ubuntu:22.04 AS tippecanoe-build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsqlite3-dev \
    zlib1g-dev \
    git \
    ca-certificates \
    && git clone --depth 1 https://github.com/felt/tippecanoe.git /tippecanoe \
    && cd /tippecanoe \
    && make -j"$(nproc)" \
    && make install PREFIX=/tippecanoe-install/usr/local \
    && rm -rf /var/lib/apt/lists/*


FROM ubuntu:22.04

COPY --from=tippecanoe-build /tippecanoe-install/usr/local/bin/ /usr/local/bin/

# gdal-bin -> ogr2ogr (PostGIS export); python3 + psycopg2/yaml -> orchestrator
RUN apt-get update && apt-get install -y --no-install-recommends \
    gdal-bin \
    python3 \
    python3-psycopg2 \
    python3-yaml \
    && rm -rf /var/lib/apt/lists/*

COPY build.py /app/build.py
COPY build.sh /build.sh
RUN chmod +x /build.sh

ENTRYPOINT ["/build.sh"]
