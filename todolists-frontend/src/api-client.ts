// import { ITodoList, TodoListStatus } from './api-types'
import { ItemsApi, ListsApi } from "todo-list-client";
import { Item, List as TodoList } from "./api-types";
import axios from "axios";

const itemsApi = new ItemsApi(
  {
    isJsonMime: (mime: string) => mime.startsWith("application/json")
  },
  "http://localhost:3000",
  axios,
);


const listsApi = new ListsApi(
  {
    isJsonMime: (mime: string) => mime.startsWith("application/json")
  },
  "http://localhost:3000",
  axios,
);

export const apiClient = {
  getLists: async (): Promise<TodoList[]> => {
    try {
      // return Promise.resolve(lists)
      // const api = new ListsApi()

      const response = await listsApi.listsGet();
      return response.data;
    } catch (error) {
      console.error("Error fetching lists:", error);
      throw error;
    }
  },
  addList: async (listName: string): Promise<TodoList[]> => {
    try {
      // lists.push({id: listName, name: listName})
      // console.debug('-- addList', listName, lists);
      // return Promise.resolve(lists)

      const response = await listsApi.listsPost({ id: listName, name: listName, items: [] });
      const updatedLists = await listsApi.listsGet(); // Fetch updated lists.
      return updatedLists.data;
    } catch (error) {
      console.error("Error adding list:", error);
      throw error;
    }
  },
  getTodos: async (listId: string): Promise<Item[]> => {
    try {
      //return Promise.resolve(listItems[listName])

      const response = await itemsApi.listsIdItemsGet(listId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching todos for list ${ listId }:`, error);
      throw error;
    }
  },
  addTodo: async (listId: string, todo: string): Promise<Item[]> => {
    try {
      // console.debug('-- addTodo', listName, todo, listItems);
      // if (!listItems[listName]) {
      //     listItems[listName] = []
      // }
      // listItems[listName].push(todo)
      // return Promise.resolve(listItems[listName])

      const response = await itemsApi.listsIdItemsPost(listId, { name: todo, id: todo, listId: listId, status: todo });
      const updatedItems = await itemsApi.listsIdItemsGet(listId); // Fetch updated todos.
      return updatedItems.data;
    } catch (error) {
      console.error(`Error adding todo to list ${ listId }:`, error);
      throw error;
    }
  }
};
