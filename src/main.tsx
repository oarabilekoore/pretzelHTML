import { h } from "../packages/jsx.ts"
import { PretzelComponent as Component, customElement, signal, For, ErrorBoundary } from '../packages/core.ts'


@customElement('app-root')
class App extends Component {
  @signal items = [
    { id: 1, text: 'Pretzel' },
    { id: 2, text: 'Mustard' }
  ];

  addItem() {
    const id = Date.now();
    // Immutable update to trigger signal
    this.items = [...this.items, { id, text: `Item #${id}` }];
  }

  removeItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
  }

  // A buggy function to test ErrorBoundary
  renderBug() {
    throw new Error("Ouch! I crashed.");
  }

  render() {
    return (
      <div style="padding: 20px;">
        <h1>PretzelHTML Functions</h1>

        {/* 1. THE FOR LOOP */}
        <h3>Shopping List</h3>
        <button onclick={() => this.addItem()}>+ Add Item</button>

        <div style="margin-top: 10px; border: 1px solid #ddd; padding: 10px;">
          <For each={() => this.items} key="id">
            {(item) => (
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee;">
                <span>{item.text}</span>
                <button onclick={() => this.removeItem(item.id)}>x</button>
              </div>
            )}
          </For>
        </div>

        {/* 2. THE ERROR BOUNDARY */}
        <h3>Danger Zone</h3>
        <ErrorBoundary fallback={(err) => <b style="color:red">Caught: {err.message}</b>}>
          {() => (
            <div>
              I am safe.
              {/* Uncomment below to test error */}
              {this.renderBug()}
            </div>
          )}
        </ErrorBoundary>
      </div>
    );
  }
}

document.body.innerHTML = '<app-root></app-root>';
