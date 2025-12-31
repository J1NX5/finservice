FROM node:trixie-slim

RUN npm install -g npm@latest

WORKDIR /app
COPY package*.json tsconfig.json ./

RUN npm install

COPY src ./src
RUN npm run build

COPY symbols.yaml .