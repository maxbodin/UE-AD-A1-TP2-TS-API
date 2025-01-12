# UE-AD-A1-TP2-TS-API

This project consists of a **Frontend**, an **API**, and an **API Client** that allow users to create and manage todo
lists. The API exposes endpoints to perform CRUD operations on todo lists, and the frontend provides a user-friendly
interface to interact with these operations. The API Client is generated using **OpenAPI Generator** to ensure a
consistent and easy-to-use interface for interacting with the API.

## Project Structure

- **Frontend**: A React-based application that allows users to view and manage their todo lists.
- **API**: A backend service that provides RESTful endpoints to create, update, and delete todo lists.
- **API Client**: A utility to interact with the backend API from the frontend or other services, generated using
  OpenAPI Generator.

## Features

- **Create Todo Lists**: Users can create new todo lists.
- **Manage Todo Items**: Add, update, and delete items in todo lists.
- **Update and Delete Todo Lists**: Users can edit the details of an existing todo list or remove it entirely.
- **Persistent Data Storage**: Data is saved using Redis for high-speed and reliable storage.

## Running the Project

This project uses **Docker** for easy deployment and running both frontend and API services in isolated environments.

### Running with Docker

1. Clone the repository:

    ```bash
    git clone https://github.com/maxbodin/UE-AD-A1-TP2-TS-API.git
    ```

2. Build and run the services using `docker-compose`:

    ```bash
    docker-compose up --build
    ```

   This will start both the frontend and API services along with Redis in containers. By default, the frontend will be
   available at `http://localhost:3006`, and the API will run at `http://localhost:3000`.

## API Endpoints

Here are the available API routes:

### Todo Lists

- **GET /lists**: Fetch all todo lists.
- **POST /lists**: Create a new todo list.
    - **Request body schema**: `addListSchema`
- **GET /lists/{id}**: Retrieve a specific todo list by its ID.
- **PUT /lists/{id}**: Update an existing todo list.
- **DELETE /lists/{id}**: Delete a todo list.

### Todo List Items

- **GET /lists/{id}/items**: Fetch all items in a specific todo list.
- **POST /lists/{id}/items**: Add a new item to a todo list.
    - **Request body schema**: `addItemSchema`
- **PUT /lists/{id}/items/{itemId}**: Update an item in a todo list.
- **DELETE /lists/{id}/items/{itemId}**: Delete an item from a todo list.

### Health Check

- **GET /redis_health**: Check if Redis is running and reachable.

### Documentation

- **GET /docs**: Access the API documentation generated with Swagger-UI. This route provides an interactive way to
  explore and test the API endpoints.

## API Client

The **API Client** is automatically generated using **OpenAPI Generator**. This ensures that the client is always in
sync with the backend API, making it easier to interact with the endpoints in a consistent manner.

To generate or update the client :

1. Generate the client from the OpenAPI spec:

    ```bash
    npm run generate:client
    ```

## Links that were useful during development

- [Using
  `npm link` with Docker Compose](https://www.reddit.com/r/docker/comments/9whbpu/use_npm_link_with_dockercompose/?rdt=43999)
- [Yalc npm package v1.0.0-pre.23](https://www.npmjs.com/package/yalc/v/1.0.0-pre.23)