// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/solid/mod.ts

import { effectScope, signal } from "npm:alien-signals@^1.0.4";
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
 * connected to the DOM, and you can safely use alien-signals reactive primitives
 * like `effect` and `signal` inside it.
 *
 * @example
 *```ts
 * // rendered with <hello-el name="world"></hello-el>
 * import { liftAlien, useAttributes } from "@lift-html/alien";
 * import { effect } from "alien-signals";
 *
 * liftAlien("hello-el", {
 *   observedAttributes: ["name"],
 *   init() {
 *     const props = useAttributes(this);
 *     effect(() => {
 *       this.innerText = "Hello, " + props.name;
 *     });
 *   },
 * });
```
 */
export function liftAlien<
  TAttributes extends Attributes,
  Options extends LiftOptions<TAttributes>,
>(
  tagName: string,
  opts: Partial<LiftOptions<TAttributes>>,
): LiftBaseConstructor<TAttributes, Options> {
  return liftHtml(tagName, {
    ...opts,
    init(deinit) {
      deinit(effectScope(() => {
        opts.init?.call(this, deinit);
      }));
    },
  });
}

/**
 * Makes attributes reactive. Returns an object where each key is a signal
 * based on the `options.observedAttributes` of the component.
 */
export function useAttributes<TAttributes extends Attributes>(
  instance: LiftBaseClass<TAttributes, LiftOptions<TAttributes>>,
): Record<NonNullable<TAttributes>[number], () => string | null> {
  const attributes = instance.options.observedAttributes as TAttributes;
  const props = {} as Record<
    NonNullable<TAttributes>[number],
    () => string | null
  >;
  type SignalType = ReturnType<typeof signal<string | null>>;
  const signals = new Map<string, SignalType>();

  if (attributes) {
    for (const key of attributes) {
      const sig = signal<string | null>(instance.getAttribute(key));
      signals.set(key, sig);
      // Cast key to the correct type since we know it's from attributes
      props[key as NonNullable<TAttributes>[number]] = () => sig();
    }
    instance.acb = (attrName: string, newValue: string | null) => {
      const sig = signals.get(attrName);
      if (sig) {
        sig(newValue);
      }
    };
  }
  return props;
}
