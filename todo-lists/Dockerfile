FROM node:23.1.0

# Set the working directory inside the container.
WORKDIR /app

# Copy only the package.json and package-lock.json to install dependencies.
COPY . .

# Install dependencies for both the main project and the API client.
RUN npm install

RUN apt-get update && \
    apt-get install -y default-jdk

# Verify Java installation
RUN java -version

WORKDIR /app/api-client
RUN npm install
RUN npm run build
# RUN npm link
RUN npm i yalc -g
RUN yalc publish

WORKDIR /app

#RUN npm link todo-list-client

# Expose the API's port.
EXPOSE 3000

# Start the API.
CMD ["npm", "run", "start"]

# Generate schema and client for the API.
# RUN npm run generate:schema && npm run generate:client


