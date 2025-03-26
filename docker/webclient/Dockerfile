FROM kvb2univpitt/centos7-php-shibboleth:v1.2022.06

LABEL maintainer="Kevin Bui"

COPY resources/bin/startup.sh /usr/local/bin/

# COPY v1.8.1a.0001.zip /tmp
RUN curl -s -L -o /tmp/v1.8.1a.0001.zip https://github.com/i2b2/i2b2-webclient/archive/refs/tags/v1.8.1a.0001.zip
RUN unzip /tmp/v1.8.1a.0001.zip -d /var/www/html/ \
    && mv /var/www/html/i2b2-webclient-1.8.1a.0001 /var/www/html/webclient \
    && rm -f /tmp/v1.8.1a.0001.zip

COPY resources/www/ /var/www/html/

RUN rm /etc/httpd/conf.d/welcome.conf

EXPOSE 80 443

CMD ["/usr/local/bin/startup.sh"]
