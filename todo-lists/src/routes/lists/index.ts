// routes/lists/index.ts

import {FastifyInstance, FastifyPluginAsync} from 'fastify'
import * as ListController from '../../controllers/lists.controller'

const lists: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
    fastify.get("/", ListController.listLists);
    fastify.post("/", ListController.addLists);
    fastify.put("/:id", ListController.updateList);
    fastify.delete("/:id", ListController.deleteList);
    fastify.get("/:id", ListController.getList);
    fastify.get("/:id/items", ListController.listItems);
    fastify.post("/:id/items", ListController.addListItem);
    fastify.put("/:id/items/:itemId", ListController.updateListItem);
    fastify.delete("/:id/items/:itemId", ListController.deleteListItem);
}

export default lists