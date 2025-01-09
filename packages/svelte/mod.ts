/**
 * Use `liftSvelte` and `createAttributes` to create custom elements with Svelte.
 *
 * The biggest difference with regular `<svelte:options tag="my-tag" />` is that
 * `liftSvelte` doesn't have render function, instead you are expected to work with
 * the HTML you got from the server.
 *
 * @module
 *
 * @example
 *
 * This code is about 10kb gzipped all together (svelte + lift-html + component code)
 *
 * ```html
 * <my-button>
 *   <button disabled>Loading...</button>
 * </my-button>
 * <script module lang="ts">
 *   import { liftSvelte } from "@lift-html/svelte";
 *   // define a custom element
 *   const MyButton = liftSvelte("my-button", {
 *     init() {
 *       const button = this.querySelector("button");
 *       if (!button) throw new Error("<my-button> must contain a <button>");
 *       button.disabled = false;
 *       let count = $state(0);
 *       button.onclick = () => count++;
 *       $effect(() => {
 *         button.textContent = `Clicks: ${count}`;
 *       });
 *     },
 *   });
 * </script>
 */

// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/svelte/mod.ts

import {
  type Attributes,
  type LiftBaseClass,
  type LiftBaseConstructor,
  liftHtml,
  type LiftOptions,
} from "@lift-html/core";
export type {
  Attributes,
  Htmlify,
  KnownElements,
  LiftBaseClass,
  LiftBaseConstructor,
  LiftOptions,
  Reactify,
  Solidify,
} from "@lift-html/core";
import "npm:svelte@5/internal/disclose-version";
import { effect_root, get, set, state } from "npm:svelte@5/internal/client";

/**
 * Creates a custom element. The `init` function is called when the element is
 * connected to the DOM, and you can safely use Svelte's reactive primitives like
 * `$effect` and `$state` inside it.
 *
 * @example
 *```ts
 * // rendered with <hello-el name="world"></hello-el>
 * // note: to use runes this has to be inside .svelte file
 * import { liftSvelte, createAttributes } from "@lift-html/svelte";
 *
 * liftSvelte("hello-el", {
 *   observedAttributes: ["name"],
 *   init() {
 *     const props = createAttributes(this);
 *     $effect(() => {
 *       this.innerText = "Hello, " + props.name;
 *     });
 *   },
 * });
```
 */
export function liftSvelte<
  TAttributes extends Attributes,
  Options extends LiftOptions<TAttributes>,
>(
  tagName: string,
  opts: Partial<LiftOptions<TAttributes>>,
): LiftBaseConstructor<TAttributes, Options> {
  return liftHtml(tagName, {
    ...opts,
    init(onCleanup) {
      onCleanup(effect_root(() => {
        opts.init?.call(this, onCleanup);
      }));
    },
  });
}

/**
 * Makes attributes reactive. Returns an object where each key is an attribute
 * based on the `options.observedAttributes` of the component.
 */
export function createAttributes<TAttributes extends Attributes>(
  instance: LiftBaseClass<TAttributes, LiftOptions<TAttributes>>,
): Record<NonNullable<TAttributes>[number], string | null> {
  const attributes = instance.options.observedAttributes as TAttributes;
  const props = {} as Record<NonNullable<TAttributes>[number], string | null>;
  if (attributes) {
    for (const key of attributes) {
      const value = state(instance.getAttribute(key));
      Object.defineProperty(props, key, {
        get() {
          return get(value);
        },
        set(newValue) {
          set(value, newValue);
        },
      });
    }
    instance.acb = (attrName, newValue) => {
      props[attrName as keyof typeof props] = newValue;
    };
  }
  return props;
}
