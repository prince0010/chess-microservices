FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD npx typeorm migration:run -d dist/db/typeorm.config.js && npm run start:dev
