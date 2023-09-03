import "./style.css";
import { TodoList } from "./todo/todo-list";

// TODO List

const todo = new TodoList();

todo.render();

todo
  .onCreate((listItem) => {
    console.log("Created Item", todo.listItems.length);
  })
  .onDelete((listItem) => {
    console.log("Deleted Item", todo.listItems.length);
  })
  .onUpdate((listItem) => {
    console.log("Updated Item");
  });
