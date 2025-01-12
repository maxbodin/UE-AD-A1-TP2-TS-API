import { Button, Layout, List, Menu, MenuProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { apiClient } from "./api-client";
import { useEffect, useState } from "react";
import { ListForm } from "./ListForm";
import { TodoForm } from "./TodoForm";
import { Item, List as TodoList } from "./api-types";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export default function App() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [selectedList, setSelectedList] = useState<TodoList | null>(null);
  const [showListForm, setShowListForm] = useState<boolean>(false);
  const [showTodoForm, setShowTodoForm] = useState<boolean>(false);
  const [selectedListItems, setSelectedListItems] = useState<Item[]>([]);

  useEffect((): void => {
    apiClient.getLists().then(setLists);
  }, []);

  useEffect((): void => {
    if (selectedList) {
      apiClient.getTodos(selectedList.id).then(setSelectedListItems);
    }
  }, [selectedList]);

  const handleItemClick = (key: string) => {
    if (key === "add") {
      setSelectedList(null);
      setShowListForm(true);
    } else {
      const list = lists.find((list) => list.id === key) || null;
      setSelectedList(list);
      setShowListForm(false); // Hide the form if switching to a list.
      setShowTodoForm(false); // Hide the todo form if switching lists.
    }
  };

  const items: MenuItem[] = lists.map((list) => ({
    key: list.id,
    label: list.name
  }));

  function handleListAdded(listName: string): void {
    apiClient.addList(listName).then((updatedLists) => {
      setLists(updatedLists); // Updated lists returned by the API.
    });
    setShowListForm(false);
  }

  function handleTodoAdded(todo: string): void {
    if (selectedList) {
      apiClient.addTodo(selectedList.id, todo).then((updatedItems) => {
        setSelectedListItems(updatedItems); // Updated todos returned by the API.
      });
    }
    setShowTodoForm(false);
  }


  return (
    <Layout className="min-h-screen bg-gray-100">
      {/* Header */ }
      <Header className="bg-blue-600 text-white text-lg font-bold px-6 py-4 shadow-md">
        TODO LISTS
      </Header>
      <Layout>
        {/* Sidebar */ }
        <Sider width={ 250 } className="bg-red-600">
          <Menu
            theme="dark"
            mode="inline"
            className="text-gray-300"
            items={ [
              { key: "add", label: "Add List", icon: <PlusOutlined/> },
              ...lists.map((list) => ({ key: list.id, label: list.name })),
            ] }
            onClick={ (e) => handleItemClick(e.key) }
          />
        </Sider>

        {/* Main Content */ }
        <Content className="p-6">
          {/* Show list creation form */ }
          { showListForm && (
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold mb-4">Create a New List</h2>
              <ListForm onListAdded={ handleListAdded }/>
            </div>
          ) }

          {/* Show selected list details */ }
          { selectedList && (
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">{ selectedList.name }</h2>

              <div className="flex items-center gap-4 mb-4">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  onClick={ () => setShowTodoForm(true) }
                >
                  Add Todo
                </Button>
              </div>

              <List
                className="border-t border-gray-200"
                dataSource={ selectedListItems }
                renderItem={ (item) => (
                  <List.Item className="border-b border-gray-200">
                    { item.name }
                  </List.Item>
                ) }
              />
            </div>
          ) }

          {/* Show todo creation form */ }
          { showTodoForm && (
            <div className="bg-white p-4 rounded-md shadow-md mt-6">
              <h2 className="text-lg font-semibold mb-4">Add a New Todo</h2>
              <TodoForm onTodoAdded={ handleTodoAdded }/>
            </div>
          ) }

          {/* Default message */ }
          { !selectedList && !showListForm && !showTodoForm && (
            <div className="text-gray-500 text-center mt-12">
              <h2 className="text-xl font-semibold">Select or Create a List</h2>
            </div>
          ) }
        </Content>
      </Layout>
    </Layout>
  );
}