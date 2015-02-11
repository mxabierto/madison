FROM ubuntu:precise

RUN apt-get update && apt-get -y install git curl mysql-client libmcrypt4 apache2 software-properties-common python-software-properties \
&& apt-get -y autoremove && apt-get clean

RUN add-apt-repository ppa:ondrej/php5-oldstable
RUN apt-get update && apt-get -y upgrade
RUN apt-get -y install php-pear php5-cli php5-common php5-curl php5-dev php5-gd php5-mcrypt php5-mysql php5-json libapache2-mod-php5

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

RUN rm /var/www/index.html

RUN git clone -b merge-upstream-e835 https://github.com/mxabierto/madison.git /var/www/madison

RUN a2enmod rewrite
RUN php5enmod mcrypt

ADD madison.conf /etc/apache2/sites-available/madison.conf
RUN a2ensite madison.conf
RUN a2dissite default

WORKDIR /var/www/madison
RUN /usr/bin/curl -sS https://getcomposer.org/installer |/usr/bin/php
RUN /bin/mv /var/www/madison/composer.phar /usr/local/bin/composer
RUN composer config -g github-oauth.github.com$ GITHUB_TOKEN
RUN /usr/local/bin/composer install --no-dev
RUN /bin/chown www-data:www-data -R /var/www/madison
RUN /bin/chmod -R 755 /var/www/madison/app/storage
ADD creds.php /var/www/madison/app/config/creds.php
ADD smtp.php /var/www/madison/app/config/smtp.php

EXPOSE 80

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
