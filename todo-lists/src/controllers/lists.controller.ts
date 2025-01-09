import {FastifyReply, FastifyRequest} from "fastify";
import {Item, List} from "../interfaces";

interface Params {
    id: string;
}

/**
 * Fetches all lists from the database.
 *
 * @param request - The Fastify request object.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends an array of lists retrieved from the database.
 */
export async function listLists(
    request: FastifyRequest,
    reply: FastifyReply
) {
    console.log('DB status', request.server.level.listsdb.status)
    const listsIter = request.server.level.listsdb.iterator()

    const result: List[] = []
    // @ts-ignore
    for await (const [key, value] of listsIter) {
        result.push(JSON.parse(value))
    }
    reply.send(result)
}

/**
 * Adds a new list to the database.
 *
 * @param request - The Fastify request object, containing the list in the body.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends the newly created list.
 */
export async function addLists(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const list = request.body as List
    await request.server.level.listsdb.put(list.id.toString(), JSON.stringify(list))
    reply.send(list)
}

/**
 * Updates an existing list in the database.
 *
 * @param request - The Fastify request object, containing the list ID in params and updated data in the body.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends the updated list or a 404 error if the list does not exist.
 */
export const updateList = async (
    request: FastifyRequest<{ Params: Params, Body: List }>,
    reply: FastifyReply
) => {
    const id = request.params.id;
    const list = await request.server.level.listsdb.get(id).catch(() => null);
    if (!list) {
        reply.status(404).send();
        return;
    }

    const updatedList = request.body as List;
    await request.server.level.listsdb.put(id, JSON.stringify(updatedList));
    reply.send(updatedList);
}

/**
 * Deletes a list from the database.
 *
 * @param request - The Fastify request object, containing the list ID in params.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends the deleted list or a 404 error if the list does not exist.
 */
export const deleteList = async (
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) => {
    const id = request.params.id;
    const list = await request.server.level.listsdb.get(id).catch(() => null);
    if (!list) {
        reply.status(404).send();
        return;
    }

    await request.server.level.listsdb.del(id);
    reply.send(JSON.parse(list));
}

/**
 * Retrieves a specific list from the database.
 *
 * @param request - The Fastify request object, containing the list ID in params.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends the requested list or a 404 error if the list does not exist.
 */
export const getList = async (
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) => {
    const id = request.params.id;
    const list = await request.server.level.listsdb.get(id).catch(() => null);
    if (list) {
        reply.send(JSON.parse(list));
    } else {
        reply.status(404).send();
    }
}

/**
 * Retrieves all items in a specific list.
 *
 * @param request - The Fastify request object, containing the list ID in params.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends an array of items or a 404 error if the list does not exist.
 */
export const listItems = async (
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) => {
    const id = request.params.id;
    const list = await request.server.level.listsdb.get(id).catch(() => null);
    if (list) {
        reply.send(JSON.parse(list).items);
    } else {
        reply.status(404).send();
    }
}

/**
 * Adds an item to a specific list.
 *
 * @param request - The Fastify request object, containing the list ID in params and the item in the body.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends the added item or a 404 error if the list does not exist.
 */
export const addListItem = async (
    request: FastifyRequest<{ Params: Params, Body: Item }>,
    reply: FastifyReply
) => {
    const id = request.params.id;
    const list = await request.server.level.listsdb.get(id).catch(() => null);
    if (!list) {
        reply.status(404).send();
        return;
    }

    const parsedList = JSON.parse(list);
    const item = request.body;
    parsedList.items.push(item);
    await request.server.level.listsdb.put(id, JSON.stringify(parsedList));
    reply.send(item);
}

/**
 * Updates an item in a specific list.
 *
 * @param request - The Fastify request object, containing the list ID and item ID in params, and updated item data in the body.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends the updated item or a 404 error if the list or item does not exist.
 */
export const updateListItem = async (
    request: FastifyRequest<{ Params: { id: string, itemId: string }, Body: Item }>,
    reply: FastifyReply
) => {
    const listId = request.params.id;
    const itemId = request.params.itemId;
    const list = await request.server.level.listsdb.get(listId).catch(() => null);
    if (!list) {
        reply.status(404).send(`List with id: ${listId} not found`);
        return;
    }

    const parsedList = JSON.parse(list);
    const index = parsedList.items.findIndex((i: Item) => i.id === itemId);
    if (index === -1) {
        reply.status(404).send(`Item with id: ${itemId} not found`);
        return;
    }

    const item = request.body;
    parsedList.items[index] = item;
    await request.server.level.listsdb.put(listId, JSON.stringify(parsedList));
    reply.send(item);
}

/**
 * Deletes an item from a specific list.
 *
 * @param request - The Fastify request object, containing the list ID and item ID in params.
 * @param reply - The Fastify reply object.
 *
 * @returns Sends the deleted item or a 404 error if the list or item does not exist.
 */
export const deleteListItem = async (
    request: FastifyRequest<{ Params: { id: string, itemId: string } }>,
    reply: FastifyReply
) => {
    const listId = request.params.id;
    const itemId = request.params.itemId;
    const list = await request.server.level.listsdb.get(listId).catch(() => null);
    if (!list) {
        reply.status(404).send(`List with id: ${listId} not found`);
        return;
    }

    const parsedList = JSON.parse(list);
    const index = parsedList.items.findIndex((i: Item) => i.id === itemId);
    if (index === -1) {
        reply.status(404).send(`Item with id: ${itemId} not found`);
        return;
    }

    const item = parsedList.items[index];
    parsedList.items.splice(index, 1);
    await request.server.level.listsdb.put(listId, JSON.stringify(parsedList));
    reply.send(item);
}