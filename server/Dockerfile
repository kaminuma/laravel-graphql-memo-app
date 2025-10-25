  FROM php:8.2-fpm

  # Install system dependencies
  RUN apt-get update && apt-get install -y \
      git \
      curl \
      libpng-dev \
      libonig-dev \
      libxml2-dev \
      zip \
      unzip \
      nodejs \
      npm \
      nginx

  # Clear cache
  RUN apt-get clean && rm -rf /var/lib/apt/lists/*

  # Install PHP extensions
  RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

  # Install Xdebug
  RUN pecl install xdebug-3.3.2 \
      && docker-php-ext-enable xdebug

  # Get latest Composer
  COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

  # Set working directory
  WORKDIR /var/www/html

  # Copy Xdebug configuration
  COPY xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

  # Copy existing application directory contents
  COPY . /var/www/html

  # Copy existing application directory permissions
  COPY --chown=www-data:www-data . /var/www/html

  # Install Lighthouse and publish its config
  RUN composer require nuwave/lighthouse && \
      php artisan vendor:publish --provider="Nuwave\\Lighthouse\\LighthouseServiceProvider"

  # Create Nginx configuration
  RUN echo 'server { \
      listen 8000; \
      index index.php index.html; \
      error_log  /var/log/nginx/error.log; \
      access_log /var/log/nginx/access.log; \
      root /var/www/html/public; \
      client_max_body_size 10M; \
      location ~ \.php$ { \
          try_files $uri =404; \
          fastcgi_split_path_info ^(.+\.php)(/.+)$; \
          fastcgi_pass 127.0.0.1:9000; \
          fastcgi_index index.php; \
          include fastcgi_params; \
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \
          fastcgi_param PATH_INFO $fastcgi_path_info; \
      } \
      location / { \
          try_files $uri $uri/ /index.php?$query_string; \
          gzip_static on; \
      } \
  }' > /etc/nginx/sites-available/default

  # Remove default Nginx configuration
  RUN rm /etc/nginx/sites-enabled/default

  # Enable our configuration
  RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

  # Create startup script
  RUN echo '#!/bin/bash \n\
  service nginx start \n\
  php-fpm' > /usr/local/bin/start.sh

  RUN chmod +x /usr/local/bin/start.sh

  # Expose port 8000 and 9003 (Xdebug)
  EXPOSE 8000 9003

  # Start Nginx and PHP-FPM
  CMD ["/usr/local/bin/start.sh"]