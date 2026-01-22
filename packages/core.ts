import { createSignal, useEffect } from "./signals";

export function customElement(tagName: string) {
  return (targetClass: any) => {
    customElements.define(tagName, targetClass);
  }
}

export function signal(target: any, key: string, descriptor?: any) {
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

export function For(props: {
  each: () => any[];
  key?: string;
  children: any; // Change this to any for a moment to handle the array
}) {
  const container = document.createElement('div');
  const nodeMap = new Map<any, HTMLElement>();
  const keyField = props.key || 'id';

  // FIX: Unwrap the function from the children array
  // JSX turns <For>{fn}</For> into props.children = [fn]
  const renderFn = Array.isArray(props.children) ? props.children[0] : props.children;

  if (typeof renderFn !== 'function') {
    console.error("PretzelHTML: <For> requires a function as a child.");
    return container;
  }

  useEffect(() => {
    const items = props.each();
    const activeKeys = new Set();
    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const key = item[keyField] ?? index;
      activeKeys.add(key);

      let node = nodeMap.get(key);

      if (!node) {
        // Use the unwrapped renderFn here
        node = renderFn(item, index);
        nodeMap.set(key, node);
      }

      fragment.appendChild(node);
    });

    for (const [key, node] of nodeMap) {
      if (!activeKeys.has(key)) {
        node.remove();
        nodeMap.delete(key);
      }
    }

    container.appendChild(fragment);
  });

  return container;
}

export function ErrorBoundary(props: {
  fallback: (err: any) => HTMLElement | string;
  children?: any[];
}) {
  const container = document.createElement('div');

  // JSX wraps content in an array: [ () => h("div", ...) ]
  const renderFn = props.children?.[0];

  try {
    if (typeof renderFn !== 'function') {
      throw new Error("ErrorBoundary requires a function as a child: {() => <App />} ");
    }

    // Execute the function to get the actual DOM element
    const content = renderFn();

    if (Array.isArray(content)) {
      container.append(...content);
    } else if (content) {
      container.append(content);
    }
  } catch (err) {
    console.error("[Pretzel Boundary caught]:", err);
    container.innerHTML = "";
    const fallback = props.fallback(err);

    if (fallback instanceof Node) {
      container.append(fallback);
    } else {
      container.append(document.createTextNode(String(fallback)));
    }
  }

  return container;
}
