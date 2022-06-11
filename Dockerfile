FROM node:16-alpine

WORKDIR /usr/src/server

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
