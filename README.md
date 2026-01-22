# pretzelHTML

This is an experimental JavaScript framework designed to explore the intersection of Web Components, Signals, and JSX without relying on a Virtual DOM.

The intent of this project is to understand how fine-grained reactivity can drive standard HTML Custom Elements directly, removing the abstraction layer typically found in libraries like React or Vue. It is a proof-of-concept, not a production-ready library.

## Project Philosophy

This experiment acknowledges that it is **reinventing the wheel**. By combining TypeScript decorators, class-based Custom Elements, and JSX, the result naturally feels like **Stencil.js** or a "SolidJS-flavored" Angular.

The goal isn't to create a better wheel, but to strip away the "magic" of established frameworks to see if a performant, portable UI can be built using only browser standards and a minimal reactivity engine.

## The Concept

Modern frameworks often rely on a Virtual DOM to determine what to update. pretzelHTML attempts to bypass this by binding reactive signals directly to DOM nodes.

1. **Web Components:** Uses the native browser `customElements` API for component encapsulation and lifecycle.
2. **Signals:** Implements a basic observer pattern. When a signal changes, it notifies only the specific subscribers (text nodes or attributes) linked to it.
3. **JSX:** Transforms XML-like syntax into raw DOM operations (`document.createElement`) rather than Virtual DOM objects.

## Core Mechanics

* **No Diffing:** There is no reconciliation process. Updates are  time complexity because the signal knows exactly which node to modify.
* **Native Standards:** Components are just classes that extend `HTMLElement`.
* **Decorators:** Uses TypeScript decorators (`@customElement`, `@signal`) to reduce boilerplate.

---

---

## Setup

This project relies on Vite and TypeScript to handle JSX compilation and decorators.

**tsconfig.json requirements:**

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "jsx": "react",
    "jsxFactory": "h"
  }
}

```

## Usage

Components are defined as classes. State changes are handled by mutating properties decorated with `@signal`.

```tsx
/** @jsx h */
import { h, PretzelComponent, customElement, signal } from './pretzel';

@customElement('simple-counter')
class SimpleCounter extends PretzelComponent {
  @signal count = 0;

  increment() {
    this.count++;
  }

  render() {
    return (
      <div>
        <p>Current count: {() => this.count}</p>
        <button onclick={() => this.increment()}>Increment</button>
      </div>
    );
  }
}

```

## Limitations

As this is an experiment, several features expected in modern tooling are intentionally absent or handled naively:

* **Manual List Management:** While the library includes a functional `<For>` component, it lacks the sophisticated reconciliation algorithms found in mature frameworks.
* **No Router:** Navigation logic is not included.
* **No SSR:** This is strictly a client-side rendering library; SEO requires additional implementation of Declarative Shadow DOM.

## License

MIT


