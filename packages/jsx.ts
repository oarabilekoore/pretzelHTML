import { useEffect } from "./signals";

export function h(tag: any, props: any, ...children: any[]) {
  // Handle Functional Components
  if (typeof tag === 'function') {
    return tag({ ...props, children });
  }

  const el = document.createElement(tag);

  // Handle Props
  if (props) {
    Object.entries(props).forEach(([key, val]: [string, any]) => {
      if (key.startsWith('on')) {
        // Event Listeners (onclick -> click)
        el.addEventListener(key.toLowerCase().substring(2), val);
      } else if (typeof val === 'function') {
        // Reactive Attributes (Signals)
        useEffect(() => el.setAttribute(key, String(val())));
      } else {
        // Static Attributes
        el.setAttribute(key, String(val));
      }
    });
  }

  // Handle Children
  children.flat().forEach((child) => {
    if (typeof child === 'function') {
      // Reactive Text Node
      const text = document.createTextNode('');
      useEffect(() => {
        text.textContent = String(child());
      });
      el.appendChild(text);
    } else {
      // Static Text/Nodes
      el.append(child);
    }
  });

  return el;
}
