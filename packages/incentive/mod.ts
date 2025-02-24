// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/incentive/mod.ts

export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Find target elements by name.
 * @internal
 */
function findTargets<T extends Element>(
  host: HTMLElement,
  name: string,
  types: Constructor<T> | Constructor<T>[],
  required = false,
): T[] | T {
  const tag = host.tagName.toLowerCase();
  const selector = `[data-target~="${tag}:${name}"]`;
  const typeArray = Array.isArray(types) ? types : [types];

  const elements = typeArray.flatMap((type) => {
    const found: T[] = [];
    for (const element of host.querySelectorAll(selector)) {
      if (element.closest(host.tagName) === host && element instanceof type) {
        found.push(element as T);
      }
    }
    return found;
  });

  if (required) {
    if (elements.length === 0) {
      throw new Error(
        `Required target "${name}" not found in <${tag}>. Use data-target="${tag}:${name}"`,
      );
    }
    return elements[0];
  }

  return elements;
}

type Target<T> = Constructor<T> | Constructor<T>[];

type TargetMap = Record<string, Target<any>>;

type InferTarget<T> = T extends readonly Constructor<infer U>[] ? U[]
  : T extends Constructor<infer U> ? U
  : never;

type InferTargets<T extends TargetMap> = { [K in keyof T]: InferTarget<T[K]> };

/**
 * Define and access element targets with type safety and validation.
 * Required targets will throw an error if not found.
 *
 * @example
 * ```ts
 * const refs = targetRefs(this, {
 *   // Optional target - type will be HTMLElement[]
 *   target1: [HTMLElement],
 *   // Optional target - type will be [HTMLDivElement | HTMLSpanElement][]
 *   target2: [HTMLDivElement, HTMLSpanElement],
 *   // Required target - type will be HTMLInputElement
 *   target3: HTMLInputElement
 * });
 *
 * // TypeScript knows target1[0] might be undefined
 * refs.target1[0].focus();
 * // TypeScript knows target3 is not undefined
 * refs.target3.value = "Hello";
 * ```
 */
export function targetRefs<T extends TargetMap>(
  host: HTMLElement,
  targets: T,
): InferTargets<T> {
  const refs = {} as InferTargets<T>;

  for (const [name, config] of Object.entries(targets)) {
    Object.defineProperty(refs, name, {
      get() {
        return findTargets(host, name, config, !Array.isArray(config));
      },
    });
  }

  return refs;
}
