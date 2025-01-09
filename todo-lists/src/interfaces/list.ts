import { Item } from "./item";

export interface List {
  id: string;
  name: string;
  items: Item[];
}