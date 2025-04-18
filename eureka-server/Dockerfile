FROM node:14-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 8761

CMD ["node", "server.js"]
