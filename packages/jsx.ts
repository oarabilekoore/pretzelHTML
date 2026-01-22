export function h(tag: any, props: any, ...children: any[]) {
  // 1. Handle Functional Components (For, ErrorBoundary, etc.)
  if (typeof tag === 'function') {
    // We flatten the children and pass them as a prop. 
    // We do NOT process them here; we let the component handle them.
    return tag({ ...props, children: children.flat() });
  }

  const el = document.createElement(tag);

  // 2. Handle Props
  if (props) {
    Object.entries(props).forEach(([key, val]: [string, any]) => {
      if (key.startsWith('on')) {
        el.addEventListener(key.toLowerCase().substring(2), val);
      } else if (typeof val === 'function') {
        useEffect(() => el.setAttribute(key, String(val())));
      } else {
        el.setAttribute(key, String(val));
      }
    });
  }

  // 3. Handle Children (Inside standard tags like <div> or <span>)
  children.flat().forEach((child) => {
    if (typeof child === 'function') {
      // Here, we check if the function is a Signal or a JSX element creator.
      // If it looks like a component's internal render prop, we might need a 
      // check, but usually, functions inside standard tags ARE signals.
      const text = document.createTextNode('');
      useEffect(() => {
        const value = child();
        // If the signal returns a Node, append it; otherwise, set text content.
        if (value instanceof Node) {
          el.innerHTML = ''; // Basic cleanup
          el.appendChild(value);
        } else {
          text.textContent = String(value);
        }
      });
      el.appendChild(text);
    } else {
      el.append(child);
    }
  });

  return el;
}
