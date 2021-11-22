FROM ubuntu:18.04 as prod

#RUN apk --no-cache add bash curl wget
# install nginx
RUN apt-get update \
    && apt-get -y install nginx \
    && rm -rf /var/lib/apt/lists/*

# copy nginx.conf in /nginx (use -v when start docker daemon to replace this)
# nginx's logs in /nginx/logs
COPY docs        /data/webase-web/nginx
COPY dist        /data/webase-web/dist
# make dir of nginx log
RUN mkdir -p /dist/log

WORKDIR /data/webase-web/
EXPOSE 5000


# start nginx commond
RUN echo "start nginx of webase-web"
ENTRYPOINT nginx -c /data/webase-web/nginx/nginx.conf -g 'daemon off;'