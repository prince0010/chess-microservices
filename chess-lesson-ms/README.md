<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Chess Lesson Microservice

This is the Lesson module. All data related with lessons that players or student will play will be stored here.

## Docker config documentation

The file with name `Dockerfile` is what we will use for Development environment.
The file with name `Dockerfile.prod` is what we will use for Production environment.

## Packages already are Installed

1. Microservices
   `npm i @nestjs/microservices`

2. Dotenv and joi to handle environments variables
   `npm i dotenv joi`
3. Validator and transformer
   `npm i class-transformer class-validator`

4. TypeOrm with nestJs
   `npm i @nestjs/typeorm typeorm`

5. NestJs ConfigModule
   `npm i @nestjs/config`

6. Mysql
   `npm i mysql@^2.18.1`

7. Nats
   `npm i nats`
