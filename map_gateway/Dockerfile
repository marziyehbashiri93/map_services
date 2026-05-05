FROM nginx:1.27-alpine

# Base image ships default.conf; remove it so only our conf.d snippets apply.
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d /etc/nginx/conf.d
COPY nginx/snippets /etc/nginx/snippets
