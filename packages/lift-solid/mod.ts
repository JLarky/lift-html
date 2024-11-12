import { createRoot, createSignal } from "solid-js";

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
 * Creates a custom element with the given tag name and options.
 *
 * @example
 * ```ts
 * import { liftHtml } from "jsr:@lift-html/lift-html";
 *
 * liftHtml("my-element", {
 *   observedAttributes: ["name"],
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

export function useAttributes<TAttributes extends Attributes>(
  instance: LiftBaseClass<TAttributes, LiftOptions<TAttributes>>,
) {
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
