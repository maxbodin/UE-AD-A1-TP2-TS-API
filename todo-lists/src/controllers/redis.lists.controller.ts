import { FastifyReply, FastifyRequest } from "fastify";
import { redisClient } from "../db";
import { List } from "../interfaces/list";
import { Item } from "../interfaces/item";

interface Params {
  id: string;
}

/**
 * Fetches all lists from Redis.
 *
 * @param request
 * @param reply
 */
export async function listLists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const client = await redisClient();
  const keys = await client.keys("todo-list:*");

  const result: List[] = [];
  for (const key of keys) {
    const listData = await client.get(key);
    if (listData) {
      const parsedList: List = JSON.parse(listData);
      result.push(parsedList);
    }
  }

  reply.send(result);
}

/**
 * Adds a new list to Redis.
 *
 * @param request
 * @param reply
 */
export async function addLists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const client = await redisClient();
  const list = request.body as List;

  const redisKey: string = `todo-list:${ list.id }`;

  const redisValue: string = JSON.stringify({
    id: list.id,
    name: list.name,
    items: []
  });

  await client.set(redisKey, redisValue);
  reply.send({ message: "List created", list });
}


/**
 * Updates an existing list in Redis.
 *
 * @param request
 * @param reply
 */
export async function updateList(
  request: FastifyRequest<{ Params: Params, Body: List }>,
  reply: FastifyReply
) {
  const client = await redisClient();
  const id: string = request.params.id;
  const redisKey: string = `todo-list:${ id }`;

  const existingList: string | null = await client.get(redisKey);
  if (!existingList || !JSON.parse(existingList).id) {
    reply.status(404).send({ message: "List not found" });
    return;
  }

  const updatedList: List = {
    ...JSON.parse(existingList), // Keep the existing values.
    ...request.body,     // Override with the updated values.
  };

  const redisValue: string = JSON.stringify(updatedList);

  await client.set(redisKey, redisValue);
  reply.send({ message: "List updated", list: updatedList });
}


/**
 * Deletes a list from Redis.
 *
 * @param request
 * @param reply
 */
export async function deleteList(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const client = await redisClient();
  const id: string = request.params.id;
  const redisKey: string = `todo-list:${ id }`;

  const existingList: string | null = await client.get(redisKey);
  if (!existingList || !JSON.parse(existingList).id) {
    reply.status(404).send({ message: "List not found" });
    return;
  }

  await client.del(redisKey);
  reply.send({ message: "List deleted", list: JSON.parse(existingList) });
}

/**
 * Retrieves a specific list from Redis.
 *
 * @param request
 * @param reply
 */
export async function getList(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const client = await redisClient();
  const id: string = request.params.id;
  const redisKey: string = `todo-list:${ id }`;

  const listData: string | null = await client.get(redisKey);
  if (listData) {
    const list: List = JSON.parse(listData);
    reply.send(list);
  } else {
    reply.status(404).send({ message: "List not found" });
  }
}

/**
 * Retrieves all items in a specific list.
 *
 * @param request
 * @param reply
 */
export async function listItems(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const client = await redisClient();
  const id = request.params.id;
  const redisKey = `todo-list:${ id }`;

  const listData: string | null = await client.get(redisKey);
  if (listData) {
    const items = JSON.parse(listData).items;
    reply.send(items);
  } else {
    reply.status(404).send({ message: "List not found" });
  }
}

/**
 * Adds an item to a specific list.
 *
 * @param request
 * @param reply
 */
export async function addListItem(
  request: FastifyRequest<{ Params: Params, Body: Item }>,
  reply: FastifyReply
) {
  const client = await redisClient();
  const id: string = request.params.id;
  const redisKey: string = `todo-list:${ id }`;

  const listData: string | null = await client.get(redisKey);
  if (!listData || !JSON.parse(listData).id) {
    reply.status(404).send({ message: "List not found" });
    return;
  }

  const items: Item[] = JSON.parse(listData).items || [];
  const newItem: Item = request.body;
  items.push(newItem);

  await client.set(redisKey, JSON.stringify({ ...JSON.parse(listData), items: items }));
  reply.send(newItem);
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
  const client = await redisClient();
  const listId: string = request.params.id;
  const itemId: string = request.params.itemId;
  const redisKey: string = `todo-list:${ listId }`;

  // Fetch the list from Redis.
  const listData: string | null = await client.get(redisKey);
  if (!listData || !JSON.parse(listData).id) {
    reply.status(404).send({ message: `List with id: ${ listId } not found` });
    return;
  }

  // Parse list data.
  const list: List = JSON.parse(listData);

  // Parse the items array.
  const items: Item[] = list.items || [];
  const itemIndex: number = items.findIndex((i: Item): boolean => i.id === itemId);

  if (itemIndex === -1) {
    reply.status(404).send({ message: `Item with id: ${ itemId } not found` });
    return;
  }

  // Merge the existing item with the updated fields from the request body.
  // This ensures that only the provided fields are updated, while the rest remain the same.
  const updatedItem: Item = {
    ...items[itemIndex], // Keep the existing values.
    ...request.body,     // Override with the updated values.
  };

  // Update the item in the list.
  items[itemIndex] = updatedItem;

  // Save the updated list back to Redis.
  await client.set(redisKey, JSON.stringify({ ...list, items }));

  // Respond with the updated item.
  reply.send(updatedItem);
};

/**
 * Deletes an item from a specific list.
 *
 * @param request
 * @param reply
 */
export async function deleteListItem(
  request: FastifyRequest<{ Params: { id: string, itemId: string } }>,
  reply: FastifyReply
) {
  const client = await redisClient();
  const listId: string = request.params.id;
  const itemId: string = request.params.itemId;
  const redisKey: string = `todo-list:${ listId }`;

  const listData: string | null = await client.get(redisKey);
  if (!listData || !JSON.parse(listData).id) {
    reply.status(404).send({ message: "List not found" });
    return;
  }

  const items: Item[] = JSON.parse(listData).items || [];
  const index: number = items.findIndex((i: Item) => i.id === itemId);
  if (index === -1) {
    reply.status(404).send({ message: "Item not found" });
    return;
  }

  const deletedItem: Item[] = items.splice(index, 1);
  await client.set(redisKey, JSON.stringify({ ...JSON.parse(listData), items: items }));
  reply.send(deletedItem[0]);
}
