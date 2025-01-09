// import { ITodoList, TodoListStatus } from './api-types'
import { ListsApi } from 'todo-list-client'
import axios from 'axios'

const lists = [
    {
        id: '1',
        name: 'Work Tasks'
    }, 
    {
        'id': '2',
        name: 'Personal Tasks'
    }, 
    {
        'id': '3',
        name: 'Shopping List'
    }
]
const listItems: Record<string, string[]> = {
    'Work Tasks': ['Buy groceries', 'Complete React project', 'Exercise for 30 minutes', 'Read a book chapter'],
    'Personal Tasks': ['Buy groceries', 'Complete React project', 'Exercise for 30 minutes', 'Read a book chapter'],
    'Shopping List': ['Buy groceries', 'Complete React project', 'Exercise for 30 minutes', 'Read a book chapter']
}

// const api = new ListsApi(
//     {
//         isJsonMime: (mime: string) => mime.startsWith('application/json')
//     },
//     'http://localhost:3000',
//     axios,
// )

export const apiClient = {
    getLists: async () => {
        return Promise.resolve(lists)
        // const response = await api.listsGet()
        // return response.data
    },
    addList: async (listName: string) => {
        lists.push({id: listName, name: listName})
        console.debug('-- addList', listName, lists);
        return Promise.resolve(lists)
    },
    getTodos: async (listName: string): Promise<string[]> => {
        return Promise.resolve(listItems[listName])
    },
    addTodo: async (listName: string, todo: string) => {
        console.debug('-- addTodo', listName, todo, listItems);
        if (!listItems[listName]) {
            listItems[listName] = []
        }
        listItems[listName].push(todo)
        return Promise.resolve(listItems[listName])
    }
}
