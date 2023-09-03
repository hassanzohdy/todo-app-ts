import { JSElement, el } from "../dom/element";
import { JSInputElement, inputEl } from "../dom/input-element";

export class TodoListItem {
  /**
   * List element
   */
  protected element!: JSElement;

  /**
   * List item text element
   */
  protected textElement!: JSElement;

  /**
   * List item edit button element
   */
  protected editButtonElement!: JSElement;

  /**
   * List item delete button element
   */
  protected deleteButtonElement!: JSElement;

  /**
   * Update list item text input element
   */
  protected updateInputElement!: JSInputElement;

  /**
   * Save button element
   */
  protected saveButtonElement!: JSElement;

  /**
   * Cancel button element
   */
  protected cancelButtonElement!: JSElement;

  /**
   * Error element
   */
  protected errorElement!: JSElement;

  /**
   * List item value
   */
  public value!: string;

  /**
   * Events callbacks
   */
  protected eventsCallback = {
    delete: (_listItem: this) => {},
    update: (_listItem: this) => {},
  };

  /**
   * Constructor
   */
  public constructor(protected container: JSElement) {
    this.createElements();

    this.listenToEvents();
  }

  /**
   * Create all list item elements
   */
  protected createElements() {
    // create list item
    // todo list item text
    this.element = el("li").class("todo-list-item");
    this.textElement = el("span")
      .class("todo-list-text")
      .appendTo(this.element);

    // edit button
    this.editButtonElement = el("button")
      .class("todo-list-edit-btn")
      .text("Edit")
      .appendTo(this.element);

    // delete button
    this.deleteButtonElement = el("button")
      .class("todo-list-delete-btn")
      .text("Delete")
      .appendTo(this.element);

    this.updateInputElement = inputEl("input")
      .class("todo-list-update-input")
      .placeholder("Update todo")
      .appendTo(this.element)
      .hide();

    this.cancelButtonElement = el("button")
      .class("todo-list-cancel-btn")
      .text("Cancel")
      .appendTo(this.element)
      .hide();

    this.errorElement = el("div")
      .class("todo-list-error")
      .appendTo(this.element);

    this.saveButtonElement = el("button")
      .class("todo-list-update-btn")
      .text("Save")
      .appendTo(this.element)
      .hide();

    // append list item to todo list
    this.element.appendTo(this.container);
  }

  /**
   * Listen to events
   */
  protected listenToEvents() {
    this.removeItemOnDeleteClick();

    this.editValueOnEditClick();

    this.cancelEditOnCancelClick();

    this.validateInputOnChange();

    this.saveListItemValueOnSaveClick();

    this.saveOnEnterPress();

    this.cancelOnEscapePress();
  }

  /**
   * Cancel on escape press
   */
  protected cancelOnEscapePress() {
    this.updateInputElement.on("keydown", (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      this.resetElementsDisplay();
    });
  }

  /**
   * Save on enter press
   */
  protected saveOnEnterPress() {
    this.updateInputElement.on("keydown", (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;

      this.update();
    });
  }

  /**
   * Validate input on change
   */
  protected validateInputOnChange() {
    this.updateInputElement.on("input", this.validateInput.bind(this));
  }

  /**
   * Validate input value
   */
  protected validateInput() {
    const value = this.updateInputElement.value().trim();

    if (!value) {
      this.setError("Empty input");
      return;
    }

    this.setError("");

    return value;
  }

  /**
   * Set error
   */
  protected setError(message: string) {
    this.errorElement.text(message);
  }

  /**
   * Save list item value on save button click
   */
  protected saveListItemValueOnSaveClick() {
    this.saveButtonElement.on("click", this.update.bind(this));
  }

  /**
   * Update list item
   */
  protected update() {
    const value = this.validateInput();

    if (!value) return;

    this.setContent(value);

    this.resetElementsDisplay();
  }

  /**
   * Cancel edit on cancel button click
   */
  protected cancelEditOnCancelClick() {
    this.cancelButtonElement.on("click", this.resetElementsDisplay.bind(this));
  }

  /**
   * Reset elements display
   */
  protected resetElementsDisplay() {
    this.textElement.show();
    this.editButtonElement.show();
    this.deleteButtonElement.show();
    this.updateInputElement.hide();

    this.errorElement.text("").hide();
    this.saveButtonElement.hide();
    this.cancelButtonElement.hide();
  }

  /**
   * Edit value on edit button click
   */
  protected editValueOnEditClick() {
    this.editButtonElement.on("click", () => {
      this.textElement.hide();
      this.editButtonElement.hide();
      this.deleteButtonElement.hide();
      this.updateInputElement.setValue(this.value).show().autoFocus();

      this.saveButtonElement.show();
      this.cancelButtonElement.show();
    });
  }

  /**
   * Remove item on delete click
   */
  protected removeItemOnDeleteClick() {
    this.deleteButtonElement.on("click", () => {
      this.element.remove();

      this.eventsCallback.delete(this);
    });
  }

  /**
   * Set text content
   */
  public setContent(value: string) {
    const isInitialValue = this.value === undefined;

    this.value = value;
    this.textElement.text(value);

    if (!isInitialValue) {
      this.eventsCallback.update(this);
    }

    return this;
  }

  /**
   * Trigger the given call back when the list item is deleted
   */
  public onDelete(callback: (listItem: this) => void) {
    this.eventsCallback.delete = callback;
    return this;
  }

  /**
   * Trigger the given callback when list item value is changed
   */
  public onChange(callback: (listItem: this) => void) {
    this.eventsCallback.update = callback;
    return this;
  }
}
