FROM mirror-docker.runflare.com/maven:3.9.5-eclipse-temurin-21 as build

WORKDIR /graphhopper

COPY graphhopper .

RUN mvn clean install -DskipTests

FROM mirror-docker.runflare.com/eclipse-temurin:21.0.1_12-jre

ENV JAVA_OPTS="-Xms512m -Xmx4g"

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /data

WORKDIR /graphhopper

COPY --from=build /graphhopper/web/target/graphhopper*.jar ./

COPY graphhopper.sh config-example.yml ./

# Enable connections from outside of the container
RUN sed -i '/^ *bind_host/s/^ */&# /p' config-example.yml

VOLUME [ "/data" ]

EXPOSE 8989 8990

HEALTHCHECK --interval=2m --timeout=10s --start-period=120s --retries=3 \
  CMD curl -fsS --max-time 5 -o /dev/null http://localhost:8989/health || exit 1
