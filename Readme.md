# Repo to launch all Chess microservices

This repo in github will host all chess Microservices.

# Steps to run all microservices with one command in development environment

1. Clone the repository if it was not made yet
2. Duplicate `.env.example` or create `.env` file in the root directory of chess-microservices and fill out environment variables.
3. Run all microservices with command `docker compose -f docker-compose.dev.yml up -d`
4. If you need to down the containers run `docker compose -f docker-compose.dev.yml down`

# Steps to insert pgn files with new structure

1. Create parent lesson if it not exists at the moment.
2. Store new pgn file/s into code and push the commit.
3. Maybe update switch statement method on function where you automatically find the filename.
4. Call the endpoint from Postman (at the moment May 10) to seed the lessons.
5. Be sure to send all required body data on the endpoint to seed lessons.
