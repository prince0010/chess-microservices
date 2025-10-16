# STEPS to optimize server performance

1 Custom MariaDB Config (my.cnf)

```
[mysqld]
# Memory Optimization
innodb_buffer_pool_size = 4G
innodb_log_file_size = 512M
innodb_log_buffer_size = 64M
key_buffer_size = 256M
query_cache_size = 128M
query_cache_type = 1
query_cache_limit = 4M

# Connection Optimization
max_connections = 400
thread_cache_size = 16
table_open_cache = 2000

# Performance
innodb_flush_log_at_trx_commit = 2
sync_binlog = 0
innodb_flush_method = O_DIRECT

# Logging
slow_query_log = 1
long_query_time = 1
log_queries_not_using_indexes = 1
```

2. NestJS Application Optimization and Database connection pooling

```
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Never true in production!
      // Connection pool settings
      extra: {
        connectionLimit: 50,
        acquireTimeout: 60000,
        timeout: 60000,
      },
      logging: ['error'], // Only log errors in production
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: 6379,
      ttl: 300, // 5 minutes default
    }),
  ],
})
export class AppModule {}
```

3. Cloudflare Configuration (This step is done and ready)

- Point DNS: Change your domain's nameservers to Cloudflare
- Enable Caching:
  . Cache Level: Standard
  . Browser Cache TTL: 1 month
  . Always Online: On

4. Horizontal Scaling Strategy
   4.1 Load Balancer Setup

```
# docker-compose.scale.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

  app:
    build: .
    deploy:
      replicas: 3
    environment:
      - DB_HOST=mariadb
      - REDIS_HOST=redis

  mariadb:
    # ... same as before but consider moving to managed service

  redis:
    # ... same as before
```

4.2 Nginx Load Balancer Config

```
# nginx.conf
upstream app_servers {
    least_conn;
    server app1:3000 max_fails=3 fail_timeout=30s;
    server app2:3000 max_fails=3 fail_timeout=30s;
    server app3:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;

    location / {
        proxy_pass http://app_servers;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

5. Deployment Strategy. Use Docker Swarm for Scaling

```
# Initialize swarm
docker swarm init

# Deploy with 3 replicas
docker stack deploy -c docker-compose.scale.yml myapp

# Scale up when needed
docker service scale myapp_app=5
```
