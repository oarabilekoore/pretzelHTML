let context: Function | null = null;

export function createSignal<T>(initialValue: T) {
  let value = initialValue;
  const subscribers = new Set<Function>();

  const read = () => {
    if (context) subscribers.add(context);
    return value;
  }
  const write = (newValue: T) => {
    value = newValue;
    subscribers.forEach((fn) => fn());
  };

  return [read, write] as const;
}

export function useEffect(fn: Function) {
  context = fn;
  fn();
  context = null;
}
