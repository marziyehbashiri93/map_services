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
    && make install DESTDIR=/tippecanoe-install \
    && rm -rf /var/lib/apt/lists/*


FROM ubuntu:22.04

COPY --from=tippecanoe-build /tippecanoe-install/usr/local/bin/ /usr/local/bin/

RUN apt-get update && apt-get install -y --no-install-recommends \
    gdal-bin \
    && rm -rf /var/lib/apt/lists/*

COPY build.sh /build.sh
RUN chmod +x /build.sh

ENTRYPOINT ["/build.sh"]
