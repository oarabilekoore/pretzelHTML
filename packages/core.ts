import { createSignal } from "./signals";

export function customElement(tagName: string) {
  return (targetClass: any) => {
    customElements.define(tagName, targetClass);
  }
}

export function state(target: any, key: string, descriptor?: any) {
  // Use a unique symbol for every instance property
  const signalKey = Symbol(`__signal_${key}`);

  // If the user did "count = 0", this captures that 0
  const initialValue = descriptor?.initializer ? descriptor.initializer() : undefined;

  return {
    configurable: true,
    enumerable: true,
    get() {
      // Lazy initialization: Create the signal the first time it's used
      if (!this[signalKey]) {
        this[signalKey] = createSignal(initialValue);
      }
      return this[signalKey][0](); // Call read()
    },
    set(newVal: any) {
      if (!this[signalKey]) {
        this[signalKey] = createSignal(newVal);
      } else {
        this[signalKey][1](newVal); // Call write()
      }
    }
  };
}


export class PretzelComponent extends HTMLElement {
  render(): any { return null; }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot?.firstChild) {
      this.shadowRoot?.appendChild(this.render());
    }
  }
}
