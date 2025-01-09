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
  const [showListForm, setShowListForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [selectedListItems, setSelectedListItems] = useState<Item[]>([]);

  useEffect(() => {
    apiClient.getLists().then(setLists);
  }, []);

  useEffect(() => {
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
    <Layout style={ { minHeight: "100vh" } }>
      <Header style={ { display: "flex", alignItems: "center", color: "white" } }>
        TODO LISTS
      </Header>
      <Layout>
        <Sider width={ 200 } style={ { background: "black" } }>
          <Menu
            theme="dark"
            mode="inline"
            items={ [{ key: "add", label: "Add list", icon: <PlusOutlined/> }, ...items] }
            onClick={ (e) => handleItemClick(e.key) }
          />
        </Sider>
        <Content
          style={ {
            padding: 24,
            margin: 0,
            minHeight: 280,
          } }
        >
          { showListForm && <ListForm onListAdded={ handleListAdded }/> }
          { selectedList && (
            <div>
              <Button onClick={ () => setShowTodoForm(true) }>Add Todo</Button>
              <List
                dataSource={ selectedListItems }
                renderItem={ (item) => <List.Item>{ item.name }</List.Item> }
              />
            </div>
          ) }
          { !selectedList && !showListForm && <div>Select a list</div> }
          { showTodoForm && <TodoForm onTodoAdded={ handleTodoAdded }/> }
        </Content>
      </Layout>
    </Layout>
  );
}