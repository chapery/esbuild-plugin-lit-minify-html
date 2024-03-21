import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('my-compunent')
export default class MyComponent extends LitElement {
  private name = 'MyComponent'
  render() {
    return html`
      ${this.name}
      <div>
        <span> this is span element </span>
      </div>
      this is paragraph
    `
  }
}
