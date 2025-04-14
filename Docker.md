# Docker commands - Chess Microservices

# Commands Needed in Development and Production

1. Build all docker images (For DEVELOPMENT )
   `docker compose -f docker-compose.dev.yml build --no-cache`

2. Up the containers from images created before (For DEVELOPMENT )
   `docker compose -f docker-compose.dev.yml up -d`

3. Build all docker images (For PRODUCTION )
   `docker compose -f docker-compose.prod.yml build --no-cache`

   3.1. Build all docker images (For TESTING )
   `docker compose -f docker-compose.test.yml build --no-cache`

4. Up the container for this image created before (For PRODUCTION )
   `docker compose -f docker-compose.prod.yml up -d`

5. Make the containers down (DEVELOPMENT)
   `docker compose -f docker-compose.dev.yml down`

6. Make the containers down (PRODUCTION)
   `docker compose -f docker-compose.prod.yml down`

# Database migrations files inside the container

1. Show all migrations status: `npx typeorm migration:show -d dist/db/typeorm.config.js`
2. Run pending migration: `npx typeorm migration:run -d dist/db/typeorm.config.js`

3. Generate migration file(ONLY ON DEVELOPMENT)
   `npx typeorm migration:generate src/db/migrations/migration -d dist/db/typeorm.config.js`

# Configuration of Docker Service in VPS

**Docker service will both start and set to start automatically when your VPS reboots**
**Note** With both commands below the VPS always will have Docker Service activated  
`sudo systemctl start docker`

`sudo systemctl enable docker`

1. How to check status of some service like Docker
   `sudo systemctl status <name-server>`
