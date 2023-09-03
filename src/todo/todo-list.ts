import { JSElement, el } from "../dom/element";
import { JSInputElement, inputEl } from "../dom/input-element";
import { TodoListItem } from "./todo-list-item";

export class TodoList {
  /**
   * Elements list
   */
  protected container!: JSElement;
  protected todoListElement!: JSElement;
  protected todoListInput!: JSInputElement;
  protected todoListButton!: JSElement;
  protected errorContainer!: JSElement;

  protected messagesList = {
    emptyInput: "Please enter a todo",
    createdMessage: "Todo created successfully",
    updateMessage: "Todo updated successfully",
  };

  /**
   * List items
   */
  public listItems: TodoListItem[] = [];

  /**
   * Events list
   */
  protected events = {
    create: (_listItem: TodoListItem) => {},
    delete: (_listItem: TodoListItem) => {},
    update: (_listItem: TodoListItem) => {},
  };

  public constructor() {
    this.initialize();
  }

  /**
   * Initialize and prepare the html elements
   */
  protected initialize() {
    this.createElements();

    this.listenToEvents();
  }

  /**
   * Create and prepare elements list
   */
  protected createElements() {
    const container = el("div").class("todo-list-container");

    this.container = container;

    this.todoListInput = inputEl("input")
      .class("todo-list-input")
      .placeholder("Add todo")
      .appendTo(container);

    this.todoListButton = el("button")
      .class("todo-list-button")
      .appendTo(container)
      .text("Add todo");

    this.errorContainer = el("div")
      .class("todo-list-error")
      .appendTo(container);

    this.todoListElement = el("ul").class("todo-list").appendTo(container);
  }

  /**
   * Listen to elements events
   */
  protected listenToEvents() {
    this.listenToButtonClick();

    this.listenToInputChange();

    this.createOnEnterPress();
  }

  /**
   * Create new todo list item on enter press
   */
  protected createOnEnterPress() {
    this.todoListInput.on("keypress", (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;

      this.submitNewTodoListItem();
    });
  }

  /**
   * Create new todo list on submit
   */
  protected submitNewTodoListItem() {
    const value = this.validateInputValue();

    if (!value) return;

    this.createNewTodoListItem(value);

    // clear input value
    this.todoListInput.setValue("");
  }

  /**
   * Listen to button click
   */
  protected listenToButtonClick() {
    this.todoListButton.on("click", this.submitNewTodoListItem.bind(this));
  }

  /**
   * Create new todo list item
   */
  protected createNewTodoListItem(value: string) {
    const listItem = new TodoListItem(this.todoListElement).setContent(value);

    this.listItems.push(listItem);

    this.events.create(listItem);

    listItem
      .onDelete(() => {
        const index = this.listItems.indexOf(listItem);

        this.listItems.splice(index, 1);

        this.events.delete(listItem);
      })
      .onChange(() => {
        this.events.update(listItem);
      });
  }

  /**
   * Validate and return input value if is valid
   */
  protected validateInputValue() {
    const value = this.inputValue;

    if (!value) {
      this.setError(this.messagesList.emptyInput);

      return;
    }

    this.setError("");

    return value;
  }

  /**
   * Listen to input change
   */
  protected listenToInputChange() {
    this.todoListInput.on("input", this.validateInputValue.bind(this));
  }

  /**
   * Get input value
   */
  protected get inputValue() {
    return this.todoListInput.value().trim();
  }

  /**
   * Set the error message
   */
  protected setError(message: string) {
    this.errorContainer.text(message);
    return this;
  }

  /**
   * Render
   */
  public render() {
    const app = el(document.getElementById("app")!);

    this.container.appendTo(app);
  }

  /**
   * On Create event
   */
  public onCreate(callback: (listItem: TodoListItem) => void) {
    this.events.create = callback;

    return this;
  }

  /**
   * On update event
   */
  public onUpdate(callback: (listItem: TodoListItem) => void) {
    this.events.update = callback;

    return this;
  }

  /**
   * On delete event
   */
  public onDelete(callback: (listItem: TodoListItem) => void) {
    this.events.delete = callback;

    return this;
  }
}
