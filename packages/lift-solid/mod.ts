import { createRoot, createSignal } from "solid-js";

// to fix crashes in SSR/Node
const HTMLElement_ = typeof HTMLElement !== "undefined"
  ? HTMLElement
  : (class {} as unknown as typeof HTMLElement);

/**
 * Options for `liftHtml` function.
 *
 * This is the main way to configure your component.
 */
export interface LiftOptions<State> {
  observedAttributes?: string[] | undefined;
  formAssociated?: boolean | undefined;
  connectedCallback?: (this: LiftBaseClass<State, LiftOptions<State>>) => void;
  disconnectedCallback?: (
    this: LiftBaseClass<State, LiftOptions<State>>,
  ) => void;
  attributeChangedCallback?: (
    this: LiftBaseClass<State, LiftOptions<State>>,
    attrName: string,
    oldValue: string | null,
    newValue: string | null,
  ) => void;
  adoptedCallback?: (this: LiftBaseClass<State, LiftOptions<State>>) => void;
}

/**
 * Type returned by `liftHtml` function.
 *
 * You probably don't need to use this type directly, but it provides a better
 * type-safety when using `liftHtml` function.
 */
export interface LiftBaseConstructor<
  State,
  Options extends LiftOptions<State>,
> {
  state: State;

  new (): LiftBaseClass<State, Options>;
}

/**
 * Base class for components created with `liftHtml` function.
 *
 * You probably don't need to use this class directly, it helps with type-safety
 * inside `liftHtml` function.
 */
export abstract class LiftBaseClass<
  State,
  T extends LiftOptions<State>,
> extends HTMLElement_ {
  abstract state: State;
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
export function liftHtml<State, Options extends LiftOptions<State>>(
  tagName: string,
  opts: {
    observedAttributes?: string[];
    formAssociated?: boolean;
    init(this: LiftBaseClass<State, LiftOptions<State>>): State;
  },
): LiftBaseConstructor<State, Options> {
  class LiftElement extends LiftBaseClass<State, Options> {
    static override observedAttributes = opts.observedAttributes;
    static override formAssociated = opts.formAssociated;
    override attributeChangedCallback(
      attrName: string,
      oldValue: string | null,
      newValue: string | null,
    ) {
      opts.attributeChangedCallback?.call(this, attrName, oldValue, newValue);
    }
    override connectedCallback() {
      this.cb(true);
    }
    override adoptedCallback() {
      this.cb(true);
    }
    override disconnectedCallback() {
      this.cb();
    }
    cleanup = [] as (() => void)[];
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
