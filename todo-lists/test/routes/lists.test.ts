import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../helper';

test('GET / - listLists', async (t) => {
  const app = await build(t);

  const res = await app.inject({
    method: 'GET',
    url: '/lists'
  });

  assert.strictEqual(res.statusCode, 200);
  assert.ok(Array.isArray(JSON.parse(res.payload)));
});

test('POST / - addLists', async (t) => {
  const app = await build(t);
  const list = { id: 1, name: 'Test List', items: [] };

  const res = await app.inject({
    method: 'POST',
    url: '/lists',
    payload: list
  });

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.payload), list);
});

test('PUT /:id - updateList', async (t) => {
  const app = await build(t);
  const updatedList = { id: 1, name: 'Updated Test List', items: [] };

  await app.inject({
    method: 'POST',
    url: '/lists',
    payload: { id: 1, name: 'Test List', items: [] }
  });

  const res = await app.inject({
    method: 'PUT',
    url: '/lists/1',
    payload: updatedList
  });

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.payload), updatedList);
});

test('DELETE /:id - deleteList', async (t) => {
  const app = await build(t);

  await app.inject({
    method: 'POST',
    url: '/lists',
    payload: { id: 1, name: 'Test List', items: [] }
  });

  const res = await app.inject({
    method: 'DELETE',
    url: '/lists/1'
  });

  assert.strictEqual(res.statusCode, 200);
  const deletedList = JSON.parse(res.payload);
  assert.strictEqual(deletedList.id, 1);
});

test('GET /:id - getList', async (t) => {
  const app = await build(t);

  const list = { id: 1, name: 'Test List', items: [] };
  await app.inject({
    method: 'POST',
    url: '/lists',
    payload: list
  });

  const res = await app.inject({
    method: 'GET',
    url: '/lists/1'
  });

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.payload), list);
});

test('GET /:id/items - listItems', async (t) => {
  const app = await build(t);

  const list = { id: 1, name: 'Test List', items: [{ id: 'item1', name: 'Item 1' }] };
  await app.inject({
    method: 'POST',
    url: '/lists',
    payload: list
  });

  const res = await app.inject({
    method: 'GET',
    url: '/lists/1/items'
  });

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.payload), list.items);
});

test('POST /:id/items - addListItem', async (t) => {
  const app = await build(t);

  const list = { id: 1, name: 'Test List', items: [] };
  const item = { id: 'item1', name: 'Item 1' };

  await app.inject({
    method: 'POST',
    url: '/lists',
    payload: list
  });

  const res = await app.inject({
    method: 'POST',
    url: '/lists/1/items',
    payload: item
  });

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.payload), item);
});

test('PUT /:id/items/:itemId - updateListItem', async (t) => {
  const app = await build(t);

  const list = { id: 1, name: 'Test List', items: [{ id: 'item1', name: 'Item 1' }] };
  const updatedItem = { id: 'item1', name: 'Updated Item 1' };

  await app.inject({
    method: 'POST',
    url: '/lists',
    payload: list
  });

  const res = await app.inject({
    method: 'PUT',
    url: '/lists/1/items/item1',
    payload: updatedItem
  });

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.payload), updatedItem);
});

test('DELETE /:id/items/:itemId - deleteListItem', async (t) => {
  const app = await build(t);

  const list = { id: 1, name: 'Test List', items: [{ id: 'item1', name: 'Item 1' }] };

  await app.inject({
    method: 'POST',
    url: '/lists',
    payload: list
  });

  const res = await app.inject({
    method: 'DELETE',
    url: '/lists/1/items/item1'
  });

  assert.strictEqual(res.statusCode, 200);
  const deletedItem = JSON.parse(res.payload);
  assert.strictEqual(deletedItem.id, 'item1');
});
