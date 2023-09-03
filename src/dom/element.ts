export class JSElement {
  /**
   * HTML Element
   */
  public element!: HTMLElement;

  /**
   * Constructor
   */
  public constructor(public tagName: string | HTMLElement | JSElement) {
    if (typeof tagName === "string") {
      this.element = document.createElement(tagName);
    } else if (tagName instanceof JSElement) {
      this.element = tagName.element;
      this.tagName = tagName.tagName;
    } else if (tagName instanceof HTMLElement) {
      this.element = tagName;
      this.tagName = tagName.tagName;
    }
  }

  /**
   * Add the given class name to class list
   */
  public class(className: string) {
    this.element.classList.add(className);
    return this;
  }

  /**
   * Append the given child to current element
   */
  public append(child: JSElement) {
    this.element.appendChild(child.element);
    return this;
  }

  /**
   * Append current element to the given parent
   */
  public appendTo(parent: JSElement) {
    parent.append(this);

    return this;
  }

  /**
   * Hide the current element
   */
  public hide() {
    this.attr("hidden", "true");
    return this;
  }

  /**
   * Show the current element
   */
  public show() {
    return this.removeAttr("hidden");
  }

  /**
   * Add the given text as inner text
   */
  public text(text: string) {
    this.element.innerText = text;
    return this;
  }

  /**
   * Get text of the element
   */
  public getText() {
    return this.element.innerText;
  }

  /**
   * Set the given attribute
   */
  public attr(name: string, value: string) {
    this.element.setAttribute(name, value);
    return this;
  }

  /**
   * Remove the given attribute
   */
  public removeAttr(attribute: string) {
    this.element.removeAttribute(attribute);
    return this;
  }

  /**
   * Listen to the given event
   */
  public on(event: string, callback: any) {
    this.element.addEventListener(event, callback);
    return this;
  }

  /**
   * Remove element from the DOM
   */
  public remove() {
    this.element.remove();
    return this;
  }
}

export function el(tagName: string | HTMLElement | JSElement) {
  return new JSElement(tagName);
}
