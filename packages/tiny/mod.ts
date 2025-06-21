// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/tiny/mod.ts

/**
 * Options for `tinyLift` function.
 *
 * This is the main way to configure your component.
 */
export interface TinyOptions {
  connectedCallback: (this: HTMLElement) => void;
}

/**
 * Type returned by `tinyLift` function.
 */
export interface TinyLiftBaseConstructor {
  new (): HTMLElement;
}

/**
 * Creates a custom element. The `connectedCallback` function is called when
 * the element is connected to the DOM. Generally speaking, this is a wrong
 * thing to do, because you are not handling cases like changing attributes
 * or removing the element from the DOM. 9 times out of 10 you should use
 * `liftHtml` instead. But this is a great fit for components used in static
 * pages generated with frameworks like Eleventy, Hugo, or Astro.
 *
 * @example
 *```ts
   // rendered with <hello-el name="world"></hello-el>
   import { tinyLift } from "@lift-html/tiny";

   tinyLift("hello-el", {
     connectedCallback() {
      this.innerText = "Hello, " + this.getAttribute("name");
     },
   });
```
 */
export function tinyLift<Options extends TinyOptions>(
  tagName: string,
  opts: Options,
): TinyLiftBaseConstructor {
  class TinyLiftElement extends HTMLElement {
    connectedCallback() {
      opts.connectedCallback.call(this);
    }
  }
  if (!customElements.get(tagName)) {
    customElements.define(tagName, TinyLiftElement);
  }
  return TinyLiftElement;
}
