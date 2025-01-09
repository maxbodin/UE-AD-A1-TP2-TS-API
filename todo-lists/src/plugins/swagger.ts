import JsonSchemas from "../schemas/all.json";
import fp from "fastify-plugin";
import { FastifySwaggerOptions } from "@fastify/swagger";


const swaggerOptions = {
  swagger: {
    info: {
      title: "Todo List Swagger",
      description: "My Todo List Application.",
      version: "1.0.0",
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "Default", description: "Default" }],
  },
  openapi: {
    info: { title: "Todo API", version: "1.0.0" },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server"
      }
    ]
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
  uiConfig: {
    docExpansion: "full",
    deepLinking: false
  },
};


export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.addSchema({
    $id: "List",
    ...JsonSchemas.definitions.List
  });
  fastify.addSchema({
    $id: "Item",
    ...JsonSchemas.definitions.Item
  });

  await fastify.register(require("@fastify/swagger"), swaggerOptions);
  await fastify.register(require("@fastify/swagger-ui"), swaggerUiOptions);
});


