import { JSElement } from "./element";

export class JSInputElement extends JSElement {
  /**
   * Add placeholder
   */
  public placeholder(placeholder: string) {
    return this.attr("placeholder", placeholder);
  }

  /**
   * Get input value
   */
  public value() {
    return (this.element as HTMLInputElement).value;
  }

  /**
   * Set input value
   */
  public setValue(value: string) {
    (this.element as HTMLInputElement).value = value;
    return this;
  }

  /**
   * Auto focus
   */
  public autoFocus() {
    (this.element as HTMLInputElement).focus();
    return this;
  }
}

export function inputEl(tagName: string | HTMLElement | JSElement) {
  return new JSInputElement(tagName);
}
