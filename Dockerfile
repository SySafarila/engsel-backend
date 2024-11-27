FROM node:20.17

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

RUN npm run build

RUN npx prisma generate

EXPOSE 3000 3030

CMD [ "node", "./dist/index.js" ]