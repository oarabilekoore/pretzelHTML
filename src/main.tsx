import { h } from "../packages/jsx.ts"
import { PretzelComponent, customElement, state } from '../packages/core.ts'

@customElement('my-counter')
class MyCounter extends PretzelComponent {
  @state count = 0;
  @state label = "Start";

  increment() {
    this.count++;
    this.label = this.count > 5 ? "High Number!" : "Keep Going";
  }

  render() {
    return (
      <div style="border: 1px solid #ccc; padding: 20px; font-family: sans-serif;" >
        <h1>pretzelHTML Framework Demo </h1>

        {/* Pass functions () => this.prop for reactivity */}
        <h2>Status: {() => this.label} </h2>
        < p > Current Count: {() => this.count} </p>

        < button onclick={() => this.increment()
        }>
          Add + 1
        </button>
      </div>
    )
  }
}

document.body.innerHTML = '<my-counter></my-counter>';
