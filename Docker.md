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
1. Run pending migration: `npx typeorm migration:run -d dist/db/typeorm.config.js`
1. Revert (apply down) last migration file: `npx typeorm migration:revert -d dist/db/typeorm.config.js`

1. Generate migration file(ONLY ON DEVELOPMENT)
   `npx typeorm migration:generate src/db/migrations/migration -d dist/db/typeorm.config.js`

# Configuration of Docker Service in VPS

**Docker service will both start and set to start automatically when your VPS reboots**
**Note** With both commands below the VPS always will have Docker Service activated  
`sudo systemctl start docker`

`sudo systemctl enable docker`

1. How to check status of some service like Docker
   `sudo systemctl status <name-server>`

# Free space on VPS due to cache build from Docker

1. See all the folders inside VPS has more space consumed `sudo du -h --max-depth=1 /`
2. See which folder or directory has more space `sudo du -h --max-depth=1 /var/lib/docker`

3. You can reclaim most of your space by removing unused build cache `docker builder prune`
4. If you want to reclaim everything not currently in use, add the --all flag `docker builder prune --all` (🔒 This is safe and does not affect your running containers or volumes.)

5. Run the full Docker system prune to remove unused:

- stopped containers
- unused networks
- dangling images
- build cache
  `docker system prune`

6. Or be more aggressive with `docker system prune --all --volumes`
   (❗⚠️ The --volumes flag will delete unused volumes — so don’t use it unless you're sure no important data is stored in volumes you’re not actively using.)
