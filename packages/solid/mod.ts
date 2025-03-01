// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/solid/mod.ts

import { createRoot, createSignal } from "npm:solid-js@^1.9";
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

/**
 * Creates a custom element. The `init` function is called when the element is
 * connected to the DOM, and you can safely use Solid's reactive primitives like
 * `createEffect` and `onCleanup` and `createSignal` inside it.
 *
 * @example
 *```ts
 * // rendered with <hello-el name="world"></hello-el>
 * import { liftSolid, useAttributes } from "@lift-html/solid";
 * import { createEffect } from "solid-js";
 *
 * liftSolid("hello-el", {
 *   observedAttributes: ["name"],
 *   init() {
 *     const props = useAttributes(this);
 *     createEffect(() => {
 *       this.innerText = "Hello, " + props.name;
 *     });
 *   },
 * });
```
 */
export function liftSolid<
  TAttributes extends Attributes,
  Options extends LiftOptions<TAttributes>,
>(
  tagName: string,
  opts: Partial<LiftOptions<TAttributes>>,
): LiftBaseConstructor<TAttributes, Options> {
  return liftHtml(tagName, {
    ...opts,
    init(deinit) {
      createRoot((dispose) => {
        opts.init?.call(this, deinit);
        deinit(dispose);
      });
    },
  });
}

/**
 * Makes attributes reactive. Returns an object where each key is an attribute
 * based on the `options.observedAttributes` of the component.
 */
export function useAttributes<TAttributes extends Attributes>(
  instance: LiftBaseClass<TAttributes, LiftOptions<TAttributes>>,
): Record<NonNullable<TAttributes>[number], string | null> {
  const attributes = instance.options.observedAttributes as TAttributes;
  const props = {} as Record<NonNullable<TAttributes>[number], string | null>;
  if (attributes) {
    for (const key of attributes) {
      const [get, set] = createSignal(instance.getAttribute(key));
      Object.defineProperty(props, key, { get, set });
    }
    instance.acb = (attrName, newValue) => {
      props[attrName as keyof typeof props] = newValue;
    };
  }
  return props;
}
