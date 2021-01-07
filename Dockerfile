FROM node:12-alpine


WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install

COPY ./lerna.json ./
COPY ./common ./common
COPY ./server ./server

ARG SERVICE
RUN npm run bootstrap -- --scope=${SERVICE} --includeDependencies
RUN npm run build -- --scope=${SERVICE} --includeDependencies

ENV SERVICE=${SERVICE}

ENTRYPOINT [ "npm", "run", "start", "--", "--stream", "--scope=${SERVICE}" ]
