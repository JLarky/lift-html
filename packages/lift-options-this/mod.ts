// to fix crashes in SSR/Node
const HTMLElement_ = typeof HTMLElement !== "undefined"
  ? HTMLElement
  : (class {} as unknown as typeof HTMLElement);

/**
 * Options for `liftHtml` function.
 *
 * This is the main way to configure your component.
 */
export interface LiftOptions {
  observedAttributes?: string[] | undefined;
  formAssociated?: boolean | undefined;
  connectedCallback?: (element: LiftBaseClass<LiftOptions>) => void;
  disconnectedCallback?: (element: LiftBaseClass<LiftOptions>) => void;
  attributeChangedCallback?: (
    element: LiftBaseClass<LiftOptions>,
    attrName: string,
    oldValue: string | null,
    newValue: string | null,
  ) => void;
  adoptedCallback?: (element: LiftBaseClass<LiftOptions>) => void;
}

/**
 * Type returned by `liftHtml` function.
 *
 * You probably don't need to use this type directly, but it provides a better
 * type-safety when using `liftHtml` function.
 */
export interface LiftBaseConstructor<Options extends LiftOptions> {
  new (): LiftBaseClass<Options>;
}

/**
 * Base class for components created with `liftHtml` function.
 *
 * You probably don't need to use this class directly, it helps with type-safety
 * inside `liftHtml` function.
 */
export abstract class LiftBaseClass<
  T extends LiftOptions,
> extends HTMLElement_ {
  abstract readonly options: T;
  static readonly formAssociated: boolean | undefined;
  static readonly observedAttributes: undefined | string[];
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
export function liftHtml<Options extends LiftOptions>(
  tagName: string,
  opts: Options,
): LiftBaseConstructor<Options> {
  class LiftElement extends LiftBaseClass<Options> {
    override options = opts;
    static override observedAttributes = opts.observedAttributes;
    static override formAssociated = opts.formAssociated;
    override attributeChangedCallback(
      attrName: string,
      oldValue: string | null,
      newValue: string | null,
    ) {
      opts.attributeChangedCallback?.(this, attrName, oldValue, newValue);
    }
    override connectedCallback() {
      opts.connectedCallback?.(this);
    }
    override disconnectedCallback() {
      opts.disconnectedCallback?.(this);
    }
    override adoptedCallback() {
      opts.adoptedCallback?.(this);
    }
  }
  if (typeof customElements !== "undefined" && !customElements.get(tagName)) {
    customElements.define(tagName, LiftElement);
  }
  return LiftElement;
}
