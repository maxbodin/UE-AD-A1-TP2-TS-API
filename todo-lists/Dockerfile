FROM node:23.1.0

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/max-api-client
RUN npm install
RUN npm run build
RUN npm link
RUN npm i yalc -g
RUN yalc publish

WORKDIR /app

#RUN npm link todo-list-client

EXPOSE 3000

CMD ["npm", "run", "start"]

# Generate schema and client for the API.
# RUN npm run generate:schema && npm run generate:client


