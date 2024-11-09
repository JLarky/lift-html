interface TinyOptions {
  connectedCallback: (this: HTMLElement) => void;
}

export interface TinyLiftBaseConstructor {
  new (): HTMLElement;
}

export function tinyLift<Options extends TinyOptions>(
  tagName: string,
  opts: Options
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
