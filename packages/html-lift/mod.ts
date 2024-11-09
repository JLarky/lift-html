// to fix crashes in SSR/Node
const HTMLElement_ = typeof HTMLElement !== "undefined"
  ? HTMLElement
  : (class {} as unknown as typeof HTMLElement);

interface LiftOptions {
  observedAttributes?: string[] | undefined;
  formAssociated?: boolean | undefined;
  connectedCallback?: (this: LiftBaseClass<LiftOptions>) => void;
  disconnectedCallback?: (this: LiftBaseClass<LiftOptions>) => void;
  attributeChangedCallback?: (
    this: LiftBaseClass<LiftOptions>,
    attrName: string,
    oldValue: string | null,
    newValue: string,
    namespace?: string,
  ) => void;
  adoptedCallback?: (this: LiftBaseClass<LiftOptions>) => void;
}

export interface LiftBaseConstructor<Options extends LiftOptions> {
  readonly observedAttributes: Options["observedAttributes"];
  readonly formAssociated: Options["formAssociated"];

  new (): LiftBaseClass<Options>;
}

export abstract class LiftBaseClass<
  T extends LiftOptions,
> extends HTMLElement_ {
  abstract readonly options: T;
  static readonly formAssociated: boolean | undefined;
  static readonly observedAttributes: undefined | string[];
  abstract attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string,
  ): void;
  abstract connectedCallback(): void;
  abstract disconnectedCallback(): void;
  abstract adoptedCallback(): void;
}

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
      newValue: string,
    ) {
      opts.attributeChangedCallback?.call(this, attrName, oldValue, newValue);
    }
    override connectedCallback() {
      opts.connectedCallback?.call(this);
    }
    override disconnectedCallback() {
      opts.disconnectedCallback?.call(this);
    }
    override adoptedCallback() {
      opts.adoptedCallback?.call(this);
    }
  }
  if (!customElements.get(tagName)) {
    customElements.define(tagName, LiftElement);
  }
  return LiftElement;
}
