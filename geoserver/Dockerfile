ARG GEOSERVER_VERSION=2.28.3
FROM geoserver:${GEOSERVER_VERSION}
COPY extensions/*.jar /usr/local/tomcat/webapps/geoserver/WEB-INF/lib/
COPY jdbc/context.xml /usr/local/tomcat/conf/