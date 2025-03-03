// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/core/mod.ts

/**
 * We use fallback for HTMLElement on the server side.
 *
 * Because we only need to inherit from HTMLElement in the browser.
 * You are free to override global HTMLElement on the server with your
 * own implementation if that's something you need.
 */
const HTMLElement_ = typeof HTMLElement !== "undefined"
  ? HTMLElement
  : (class {} as unknown as typeof HTMLElement);

/**
 * Type used for `observedAttributes` property in `LiftOptions`.
 *
 * @example
 * ```ts
 * observedAttributes: ["name", "age"] as const,
 * ```
 */
export type Attributes = ReadonlyArray<string> | undefined;

/**
 * Options for `liftHtml` function.
 *
 * This is the main way to configure your component.
 */
export interface LiftOptions<TAttributes extends Attributes> {
  observedAttributes: TAttributes;
  formAssociated?: boolean | undefined;
  init(
    this: LiftBaseClass<TAttributes, LiftOptions<TAttributes>>,
    deinit: (dispose: () => void) => void,
  ): void;
  noHMR?: boolean;
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
  formAssociated: boolean | undefined;
  observedAttributes: TAttributes | undefined;
  hmr: Set<{ cb: (connect?: true | undefined) => void }>;
  options: Options;
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
  /**
   * **a**ttribute changed **c**all**b**ack. This is obviously there to
   * give you access to `attributeChangedCallback` method, but it's
   * primarily intended to be used by a wrapper like `useAttributes` from
   * `@lift-html/solid` package. If you still want to use it directly,
   * note that `oldValue` is not available.
   */
  abstract acb:
    | ((attrName: string, newValue: string | null) => void)
    | undefined;
  static readonly options: LiftOptions<Attributes>;
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
 * connected to the DOM.
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
    static hmr = new Set<{ cb: (connect?: true | undefined) => void }>();
    public acb:
      | ((attrName: string, newValue: string | null) => void)
      | undefined = undefined;
    static override options = opts as Options;
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
      LiftElement.hmr.delete(this);
    }
    cleanup = [] as (() => void)[];
    /** This callback is called to connect or disconnect the component. */
    cb(connect?: true | undefined) {
      while (this.cleanup.length) {
        this.cleanup.pop()!();
      }
      if (this.isConnected && connect) {
        LiftElement.options.init?.call(this, (cb) => {
          this.cleanup.push(cb);
        });
      }
      if (!opts.noHMR) {
        LiftElement.hmr.add(this);
      }
    }
  }
  if (typeof customElements !== "undefined") {
    const existing = customElements.get(tagName) as
      | undefined
      | LiftBaseConstructor<TAttributes, Options>;
    if (existing) {
      if (!opts.noHMR) {
        existing.options = opts as Options;
        existing.hmr.forEach((cb) => cb.cb(true));
      }
      return existing;
    }
    customElements.define(tagName, LiftElement);
  }
  return LiftElement;
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
   import { liftHtml } from "@lift-html/core";

   const HelloEl = liftHtml("hello-el", {
     init() {
       this.innerText = "Hello, " + this.getAttribute("name");
     },
   });

   declare module "@lift-html/core" {
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
 * import type { Solidify, KnownElements } from "@lift-html/core";
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
 * import type { Reactify, KnownElements } from "@lift-html/core";
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
 * import type { Sveltify, KnownElements } from "@lift-html/core";
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
 * import type { Htmlify, KnownElements } from "@lift-html/core";
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
