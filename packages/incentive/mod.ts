// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/incentive/mod.ts

export type Constructor<T = object, A extends any[] = any[], Static = {}> =
  & (new (...a: A) => T)
  & Static;

// inspired by @github/catalyst
/**
 * This is a wrapper around `querySelector` that finds the first element with a
 * specified target name. To make things more explicit you have to specify the
 * name of the custom element as a prefix, the second difference is that if you
 * have nested components selector will ignore targets from nested ones.
 *
 * @example
 * ```html
 * <my-element>
 *   <button data-target="my-element:button">Click me</button>
 *   <input data-target="my-element:input" />
 * </my-element>
 * <script>
 * import { liftHtml } from '@lift-html/core';
 * import { findTarget } from '@lift-html/incentive';
 *
 * liftHtml('my-element', {
 *   init() {
 *     const button = findTarget(this, 'button');
 *     const input = findTarget(this, 'input', HTMLInputElement);
 *     // note that typescript will know that input has the `value` property
 *     button.onclick = () => input.value = 'Hello world';
 *   }
 * });
 * </script>
 * ```
 */
export function findTarget<T = HTMLElement>(
  wcElement: HTMLElement,
  name: string,
  targetType: Constructor<T> = HTMLElement as Constructor<T>,
): T | undefined {
  const tag = wcElement.tagName.toLowerCase();
  for (
    const el of wcElement.querySelectorAll(`[data-target~="${tag}:${name}"]`)
  ) {
    if (el.closest(tag) === wcElement) {
      return el instanceof targetType ? el : undefined;
    }
  }
  return undefined;
}

type TargetConfig<T> = {
  type: Constructor<T>;
  required?: boolean;
};

type TargetDefinition<T> = Constructor<T> | TargetConfig<T>;

type InferTargetType<T extends TargetDefinition<any>> = T extends
  Constructor<infer U> ? U
  : T extends TargetConfig<infer U> ? U
  : never;

type InferTargetRequired<T extends TargetDefinition<any>> = T extends
  Constructor<any> ? false
  : T extends TargetConfig<any> ? T["required"] extends true ? true
    : false
  : never;

type TargetsConfig = Record<string, TargetDefinition<any>>;

type InferTargetTypes<T extends TargetsConfig> = {
  [K in keyof T]: InferTargetRequired<T[K]> extends true ? InferTargetType<T[K]>
    : InferTargetType<T[K]> | undefined;
};

/**
 * This is a wrapper around `querySelector` that finds elements with specified target names.
 * You can mark targets as required to ensure they exist at runtime.
 *
 * @example
 * ```html
 * <my-element>
 *   <button data-target="my-element:button">Click me</button>
 *   <input data-target="my-element:input" />
 * </my-element>
 * <script>
 * import { liftHtml } from '@lift-html/core';
 * import { targetRefs } from '@lift-html/incentive';
 *
 * liftHtml('my-element', {
 *   init() {
 *     const refs = targetRefs(this, {
 *       // Optional target - type will be HTMLElement | undefined
 *       button: HTMLElement,
 *       // Required target - type will be HTMLInputElement
 *       input: { type: HTMLInputElement, required: true },
 *     });
 *     // TypeScript knows input is not undefined
 *     refs.button?.onclick = () => refs.input.value = 'Hello world';
 *   }
 * });
 * </script>
 * ```
 */
export function targetRefs<Targets extends TargetsConfig>(
  self: HTMLElement,
  targets: Targets,
): InferTargetTypes<Targets> {
  const refs = {} as InferTargetTypes<Targets>;

  for (const [key, config] of Object.entries(targets)) {
    const targetType = typeof config === "function" ? config : config.type;
    const required = typeof config === "function"
      ? false
      : config.required ?? false;

    Object.defineProperty(refs, key, {
      get() {
        const element = findTarget(self, key, targetType);
        if (required && !element) {
          throw new Error(
            `Required target "${key}" not found in <${self.tagName.toLowerCase()}>. ` +
              `Make sure the element has data-target="${self.tagName.toLowerCase()}:${key}" attribute.`,
          );
        }
        return element;
      },
    });
  }

  return refs;
}
