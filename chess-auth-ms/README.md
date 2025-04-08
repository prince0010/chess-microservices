<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Chess Auth Microservice

This is the authentication module. All data related with User will be stores and handled here.

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

4. Bcryptjs for user authentication with json web token
   `npm i bcryptjs`

5. NestJs/JWT for use it on NestJs
   `npm i @nestjs/jwt`

6. TypeOrm with nestJs
   `npm i @nestjs/typeorm typeorm`

7. NestJs ConfigModule
   `npm i @nestjs/config`

8. Mysql
   `npm i mysql@^2.18.1`

9. Nats
   `npm i nats`

## Panda Logic

1. The auth_panda entity is created only the first time when user is registered to keep consistency and a OneToOne relationship between Auth - AuthPanda
