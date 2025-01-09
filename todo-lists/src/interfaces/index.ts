interface List {
    id: string;
    name: string;
    items: Item[];
}

interface Item {
    id: string;
    name: string;
    listId: string;
    status: string;
    // TODO : user: User;
    // TODO : Assigning an item to an User + creating User interface.
    // TODO : If all the items of a list are DONE, then the list as a DONE status too.
}

/*

TODO : item status as enum.
enum Status {
    PENDING,
    IN_PROGRESS,
    DONE
}*/

export type {List, Item};

// TODO : /api-docs → La documentation OpenAPI