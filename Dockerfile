FROM node:alpine

RUN apk update && apk add g++ make py3-pip
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src src
RUN npm build:server

CMD [ "npx", "ts-node", "src/server/index.ts" ]
