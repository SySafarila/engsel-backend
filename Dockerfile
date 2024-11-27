FROM node:20.17

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

RUN npm run build

CMD [ "node", "./dist/index.js" ]