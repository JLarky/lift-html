import { createRoot, createSignal, type JSX } from "solid-js";

// to fix crashes in SSR/Node
const HTMLElement_ = typeof HTMLElement !== "undefined"
  ? HTMLElement
  : (class {} as unknown as typeof HTMLElement);

export type Attributes = ReadonlyArray<string> | undefined;

/**
 * Options for `liftHtml` function.
 *
 * This is the main way to configure your component.
 */
export interface LiftOptions<TAttributes extends Attributes> {
  observedAttributes: TAttributes;
  formAssociated?: boolean | undefined;
  init(this: LiftBaseClass<TAttributes, LiftOptions<TAttributes>>): void;
}

/**
 * Type returned by `liftHtml` function.
 *
 * You probably don't need to use this type directly, but it provides a better
 * type-safety when using `liftHtml` function.
 */
export interface LiftBaseConstructor<
  TAttributes extends Attributes,
  Options extends LiftOptions<TAttributes>,
> {
  new (): LiftBaseClass<TAttributes, Options>;
}

/**
 * Base class for components created with `liftHtml` function.
 *
 * You probably don't need to use this class directly, it helps with type-safety
 * inside `liftHtml` function.
 */
export abstract class LiftBaseClass<
  TAttributes extends Attributes,
  T extends LiftOptions<TAttributes>,
> extends HTMLElement_ {
  /** internal property to override attributeChangedCallback */
  abstract acb:
    | ((
      attrName: string,
      newValue: string | null,
    ) => void)
    | undefined;
  abstract readonly options: T;
  static readonly formAssociated: boolean | undefined;
  static readonly observedAttributes: Attributes;
  abstract attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null,
  ): void;
  abstract connectedCallback(): void;
  abstract disconnectedCallback(): void;
  abstract adoptedCallback(): void;
}

/**
 * Creates a custom element. The `init` function is called when the element is
 * connected to the DOM, and you can safely use Solid's reactive primitives like
 * `createEffect` and `onCleanup` and `createSignal` inside it.
 *
 * @example
 *```ts
   // rendered with <hello-el name="world"></hello-el>
   import { liftHtml, useAttributes } from "@lift-html/solid";
   import { createEffect } from "solid-js";

   liftHtml("hello-el", {
     observedAttributes: ["name"],
     init() {
       const props = useAttributes(this);
       createEffect(() => {
         this.innerText = "Hello, " + props.name;
       });
     },
   });
```
 */
export function liftHtml<
  TAttributes extends Attributes,
  Options extends LiftOptions<TAttributes>,
>(
  tagName: string,
  opts: Partial<LiftOptions<TAttributes>>,
): LiftBaseConstructor<TAttributes, Options> {
  class LiftElement extends LiftBaseClass<TAttributes, Options> {
    public acb:
      | ((
        attrName: string,
        newValue: string | null,
      ) => void)
      | undefined = undefined;
    override options = opts as Options;
    static override observedAttributes = opts.observedAttributes;
    static override formAssociated = opts.formAssociated;
    override attributeChangedCallback(
      attrName: string,
      _oldValue: string | null,
      newValue: string | null,
    ) {
      this.acb?.(attrName, newValue);
    }
    override connectedCallback() {
      this.cb(true);
    }
    override adoptedCallback() {
      this.cb(true);
    }
    override disconnectedCallback() {
      this.cb();
      this.acb = undefined;
    }
    cleanup = [] as (() => void)[];
    /** This callback is called to connect or disconnect the component. */
    cb(connect?: true | undefined) {
      while (this.cleanup.length) {
        this.cleanup.pop()!();
      }
      if (this.isConnected && connect) {
        createRoot((dispose) => {
          this.cleanup.push(dispose);
          opts.init?.call(this);
        });
      }
    }
  }
  if (typeof customElements !== "undefined" && !customElements.get(tagName)) {
    customElements.define(tagName, LiftElement);
  }
  return LiftElement;
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

/**
 * Extending this interface allows you to define custom once and get
 * type definitions for it in Solid JSX as well as regular HTML and
 * sometimes other frameworks like React.
 *
 * @example
 *
 *```ts
   // rendered with <hello-el name="world"></hello-el>
   import { liftHtml } from "@lift-html/solid";

   const HelloEl = liftHtml("hello-el", {
     init() {
       this.innerText = "Hello, " + this.getAttribute("name");
     },
   });

   declare module "@lift-html/solid" {
     interface KnownElements {
       "hello-el": typeof HelloEl;
     }
   }
```
 */
// deno-lint-ignore no-empty-interface
export interface KnownElements {}

/**
 * Add this to your env.d.ts file to make all lift-html components
 * available as Solid JSX elements. You only need to do this once
 * per project.
 *
 * @example
 * ```ts
 * import type { Solidify, KnownElements } from "@lift-html/solid";
 *
 * declare module "solid-js" {
 *   namespace JSX {
 *     interface IntrinsicElements extends Solidify<KnownElements> {}
 *   }
 * }
 * ```
 */

export type Solidify<T> = {
  [K in keyof T]: JSX.HTMLAttributes<HTMLDivElement>;
};

/**
 * Converts a type of `KnownElements` to a type that can be used in
 * `HTMLElementTagNameMap` to make all lift-html components available as
 * global HTML elements. You only need to do this once per project.
 *
 * @example
 * ```ts
 * import type { Htmlify, KnownElements } from "@lift-html/solid";
 *
 * declare global {
 *   interface HTMLElementTagNameMap extends Htmlify<KnownElements> {}
 * }
 * ```
 */
export type Htmlify<T> = {
  [K in keyof T]:
    & HTMLElement
    // deno-lint-ignore no-explicit-any
    & (T[K] extends (abstract new (...args: any) => any) ? InstanceType<T[K]>
      : T[K]);
};
