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

/**
 * Extending this interface allows you to define custom element once and
 * get type definitions for it in Solid JSX as well as regular HTML and
 * sometimes other frameworks like React. There's nothing special
 * about this interface, feel free to create your own for your project
 * or library if you need to.
 *
 * @example
 *
 *```ts
   // rendered with <hello-el name="world"></hello-el>
   import { tinyLift } from "@lift-html/tiny";

   const HelloEl = tinyLift("hello-el", {
     connectedCallback() {
       this.innerText = "Hello, " + this.getAttribute("name");
     },
   });

   declare module "@lift-html/tiny" {
     interface KnownElements {
       "hello-el": typeof HelloEl;
     }
   }
```
 */
export interface KnownElements {}

/**
 * Add this to your env.d.ts file to make all lift-html components
 * available as Solid JSX elements. You only need to do this once
 * per project.
 *
 * @example
 * ```ts
 * import type { Solidify, KnownElements } from "@lift-html/tiny";
 *
 * declare module "solid-js" {
 *   namespace JSX {
 *     interface IntrinsicElements extends Solidify<JSX.HTMLAttributes<HTMLDivElement>, KnownElements> {}
 *   }
 * }
 * ```
 */

export type Solidify<Base, T> = {
  [K in keyof T]: Base & ResolveProps<T[K]>;
};

/**
 * Add this to your env.d.ts file to make all lift-html components
 * available as React JSX elements. You only need to do this once
 * per project.
 *
 * @example
 * ```ts
 * import type { Reactify, KnownElements } from "@lift-html/tiny";
 *
 * declare global {
 *   namespace JSX {
 *     interface IntrinsicElements extends Reactify<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, KnownElements> {}
 *   }
 * }
 * ```
 */
export type Reactify<Base, T> = {
  [P in keyof T]?:
    & Omit<Base, "className">
    & { class?: string }
    & ResolveProps<T[P]>;
};

/**
 * Add this to your app.d.ts file to make all lift-html components available
 * as Svelte elements. You only need to do this once per project.
 *
 * @example
 * ```ts
 * import type { HTMLAttributes } from "svelte/elements";
 * import type { Sveltify, KnownElements } from "@lift-html/tiny";
 *
 * declare global {
 *   namespace svelteHTML {
 *     interface IntrinsicElements extends Sveltify<HTMLAttributes<HTMLSpanElement>, KnownElements> {}
 *   }
 * }
 * ```
 */
export type Sveltify<Base, T> = {
  [P in keyof T]?: Base & ResolveProps<T[P]>;
};

/**
 * Converts a type of `KnownElements` to a type that can be used in
 * `HTMLElementTagNameMap` to make all lift-html components available as
 * global HTML elements. You only need to do this once per project.
 *
 * @example
 * ```ts
 * import type { Htmlify, KnownElements } from "@lift-html/tiny";
 *
 * declare global {
 *   interface HTMLElementTagNameMap extends Htmlify<KnownElements> {}
 * }
 * ```
 */
export type Htmlify<T> = {
  [K in keyof T]:
    & HTMLElement
    & (T[K] extends (abstract new (...args: any) => any) ? InstanceType<T[K]>
      : T[K]);
};

type ResolveProps<T> = T extends { props: infer P } ? P : {};
