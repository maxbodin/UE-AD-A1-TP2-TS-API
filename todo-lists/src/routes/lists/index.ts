// routes/lists/index.ts

import { FastifyInstance, FastifyPluginAsync } from "fastify";
import * as ListController from "../../controllers/lists.controller";
import { addItemSchema, addListSchema, listItemsSchema, listListsSchema } from "../../schemas/listSchemas";

const lists: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  // fastify.get("/", ListController.listLists);
  // fastify.post("/", ListController.addLists);
  fastify.put("/:id", ListController.updateList);
  fastify.delete("/:id", ListController.deleteList);
  fastify.get("/:id", ListController.getList);
  // fastify.get("/:id/items", ListController.listItems);
  // fastify.post("/:id/items", ListController.addListItem);
  fastify.put("/:id/items/:itemId", ListController.updateListItem);
  fastify.delete("/:id/items/:itemId", ListController.deleteListItem);

  fastify.get("/", { schema: listListsSchema }, ListController.listLists);
  fastify.post("/", { schema: addListSchema }, ListController.addLists);


  fastify.get("/:id/items", { schema: listItemsSchema }, ListController.listItems);
  fastify.post("/:id/items", { schema: addItemSchema }, ListController.addListItem);
};

export default lists;