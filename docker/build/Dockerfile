FROM ubuntu:18.04 as prod

#RUN apk --no-cache add bash curl wget
# install nginx
RUN apt-get update \
    && apt-get -y install nginx \
    && rm -rf /var/lib/apt/lists/*

# copy nginx.conf in /nginx (use -v when start docker daemon to replace this)
# nginx's logs in /nginx/logs
COPY docs        /nginx
COPY dist        /dist
# make dir of nginx log
RUN mkdir -p /usr/share/nginx/log

WORKDIR /nginx
EXPOSE 5000


# start nginx commond
ENTRYPOINT nginx -c /nginx/nginx.conf