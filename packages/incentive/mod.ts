// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/incentive/mod.ts

export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Find a target element by name. Returns undefined if not found.
 * @internal
 */
function findTarget<T>(
  host: HTMLElement,
  name: string,
  type: Constructor<T>,
): T | undefined {
  const tag = host.tagName.toLowerCase();
  for (
    const el of host.querySelectorAll(`[data-target~="${tag}:${name}"]`)
  ) {
    if (el.closest(tag) === host && el instanceof type) {
      return el;
    }
  }
}

type Target<T> = {
  /** Element type constructor */
  type: Constructor<T>;
  /** Whether the target is required. If true and target is not found, an error will be thrown */
  required?: boolean;
  /** Custom error message when target is not found */
  message?: string;
};

type TargetMap = Record<string, Target<any>>;

type InferTarget<T extends Target<any>> = T["required"] extends true
  ? InstanceType<T["type"]>
  : InstanceType<T["type"]> | undefined;

type InferTargets<T extends TargetMap> = {
  [K in keyof T]: InferTarget<T[K]>;
};

/**
 * Define and access element targets with type safety and validation.
 * Required targets will throw an error if not found.
 *
 * @example
 * ```ts
 * const refs = targetRefs(this, {
 *   // Optional target - type will be HTMLElement | undefined
 *   optional: { type: HTMLElement },
 *   // Required target - type will be HTMLInputElement
 *   input: {
 *     type: HTMLInputElement,
 *     required: true,
 *     message: "Input element is required for this component"
 *   }
 * });
 *
 * // TypeScript knows input is not undefined
 * refs.input.value = "Hello";
 * // TypeScript knows optional might be undefined
 * refs.optional?.focus();
 * ```
 */
export function targetRefs<T extends TargetMap>(
  host: HTMLElement,
  targets: T,
): InferTargets<T> {
  const refs = {} as InferTargets<T>;
  const tag = host.tagName.toLowerCase();

  for (const [name, config] of Object.entries(targets)) {
    Object.defineProperty(refs, name, {
      get() {
        const el = findTarget(host, name, config.type);
        if (config.required && !el) {
          throw new Error(
            config.message ??
              `Required target "${name}" not found in <${tag}>. ` +
                `Add data-target="${tag}:${name}" to the target element.`,
          );
        }
        return el;
      },
    });
  }

  return refs;
}
