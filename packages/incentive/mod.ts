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

type Target<T> = Constructor<T> | [Constructor<T>, true];

type TargetMap = Record<string, Target<any>>;

type InferTarget<T extends Target<any>> = T extends [any, true]
  ? InstanceType<T[0]>
  : T extends Constructor<any> ? InstanceType<T> | undefined
  : never;

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
 *   optional: HTMLElement,
 *   // Required target - type will be HTMLInputElement
 *   input: [HTMLInputElement, true]
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
    const [type, required] = Array.isArray(config) ? config : [config, false];

    Object.defineProperty(refs, name, {
      get() {
        const el = findTarget(host, name, type);
        if (required && !el) {
          throw new Error(
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
