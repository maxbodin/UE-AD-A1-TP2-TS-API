import S from "fluent-json-schema";

export const listCreateSchema = {
  body: S.object()
    .prop("id", S.string().required())
    .prop("description", S.string().required()),
  queryString: S.object(),
  params: S.object(),
  headers: S.object()
};

export const addListSchema = {
  tags: ["lists"],
  summary: "Add a new list",
  body: {
    $ref: "List#"
  }
};

export const listListsSchema = {
  tags: ["lists"],
  summary: "List all the lists",
  response: {
    200: {
      description: "Successful response",
      type: "array",
      items: {
        $ref: "List#"
      }
    }
  }
};

export const addItemSchema = {
  tags: ["items"],
  summary: "Add a new item to a list",
  body: {
    $ref: "Item#"
  }
};

export const listItemsSchema = {
  tags: ["items"],
  summary: "List all the items of a list",
  response: {
    200: {
      description: "Successful response",
      type: "array",
      items: {
        $ref: "Item#"
      }
    }
  }
};
