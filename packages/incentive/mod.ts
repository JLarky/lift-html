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

type ValidationMode = "immediate" | "lazy" | "none";

type TargetConfig<T> = {
  type: Constructor<T>;
  required?: boolean;
  /**
   * Validation mode:
   * - 'immediate': validate when targetRefs is called (default for required refs)
   * - 'lazy': validate when the ref is accessed (default for optional refs)
   * - 'none': no validation, refs will be undefined if not found
   */
  validate?: ValidationMode;
  /**
   * Custom error message when target is not found.
   * If not provided, a default message will be used.
   */
  errorMessage?: string;
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

function getDefaultErrorMessage(
  key: string,
  tagName: string,
): string {
  return `Required target "${key}" not found in <${tagName.toLowerCase()}>. ` +
    `Make sure the element has data-target="${tagName.toLowerCase()}:${key}" attribute.`;
}

/**
 * This is a wrapper around `querySelector` that finds elements with specified target names.
 * You can mark targets as required and customize validation behavior.
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
 *       // Required target with immediate validation
 *       input: {
 *         type: HTMLInputElement,
 *         required: true,
 *         validate: 'immediate',
 *         errorMessage: 'Input element is required for this component to work'
 *       },
 *       // Required target with lazy validation (only throws when accessed)
 *       label: {
 *         type: HTMLElement,
 *         required: true,
 *         validate: 'lazy'
 *       }
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
    const validate = typeof config === "function"
      ? "lazy"
      : config.validate ?? (required ? "immediate" : "lazy");
    const errorMessage = typeof config === "function"
      ? undefined
      : config.errorMessage;

    // Immediate validation for required refs
    if (validate === "immediate") {
      const element = findTarget(self, key, targetType);
      if (required && !element) {
        throw new Error(
          errorMessage ?? getDefaultErrorMessage(key, self.tagName),
        );
      }
    }

    Object.defineProperty(refs, key, {
      get() {
        const element = findTarget(self, key, targetType);
        if (required && !element && validate !== "none") {
          throw new Error(
            errorMessage ?? getDefaultErrorMessage(key, self.tagName),
          );
        }
        return element;
      },
    });
  }

  return refs;
}
