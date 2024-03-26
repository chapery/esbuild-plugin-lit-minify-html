# esbuild-plugin-lit-minify-html

minify html template for lit (remove white space characters).

in IDE, the format tool usually add indent or linefeed in order to beauty the html template-literals, the white space characters will not remove by lit on runtime, this package solve that.

notice, this package is match `html` node tag name in AST and handle it template-literals parameter, so not define a alias for `html`.

## usage

```
npm install -D esbuild-plugin-lit-minify-html
```

```javascript
import * as esbuild from 'esbuild'
import minifyHtml from 'esbuild-plugin-lit-minify-html'

esbuild.context({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: ['esnext'],
  plugins: [minifyHtml()],
})
```

## example

### source

```javascript
import { LitElement, html } from 'lit'

export default class MyComponent extends LitElement {
  render() {
    return html`  <div>
        <span> this is span element </span>
      </div>
      this is paragraph `
  }
}
```

### handled
```javascript
import { LitElement, html } from "lit";
var MyComponent = class extends LitElement {
  render() {
    return html`<div><span>this is span element</span></div>this is paragraph`;
  }
};
export {
  MyComponent as default
};
```
