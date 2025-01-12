import { FastifyInstance, FastifyPluginAsync } from "fastify";
//import * as ListController from "../../controllers/lists.controller";
import * as RedisListController from "../../controllers/redis.lists.controller";
import { addItemSchema, addListSchema, listItemsSchema, listListsSchema } from "../../schemas/listSchemas";
import { checkRedisHealth } from "../../controllers/redis.controller";

const lists: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {

  fastify.put("/:id", RedisListController.updateList);
  fastify.delete("/:id", RedisListController.deleteList);
  fastify.get("/:id", RedisListController.getList);
  fastify.put("/:id/items/:itemId", RedisListController.updateListItem);
  fastify.delete("/:id/items/:itemId", RedisListController.deleteListItem);

  // fastify.get("/", ListController.listLists);
  // fastify.post("/", ListController.addLists);
  fastify.get("/", { schema: listListsSchema }, RedisListController.listLists);
  fastify.post("/", { schema: addListSchema }, RedisListController.addLists);

  // fastify.get("/:id/items", ListController.listItems);
  // fastify.post("/:id/items", ListController.addListItem);
  fastify.get("/:id/items", { schema: listItemsSchema }, RedisListController.listItems);
  fastify.post("/:id/items", { schema: addItemSchema }, RedisListController.addListItem);

  fastify.get("/redis_health", checkRedisHealth);

};

export default lists;