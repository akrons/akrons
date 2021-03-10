FROM node:14-alpine

COPY ./ .
RUN npm i
RUN npm run build

ENTRYPOINT [ "npm", "start" ]