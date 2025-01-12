FROM node:23.1.0

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/max-api-client
RUN npm install
RUN npm run build
RUN npm i yalc -g
RUN yalc publish

WORKDIR /app

EXPOSE 3000

CMD ["npm", "run", "start"]


