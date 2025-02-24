// PUBLIC DOMAIN: https://github.com/JLarky/lift-html/blob/main/packages/incentive/mod.ts

export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Find a target element by name. Returns undefined if not found.
 * @internal
 */
function findTarget<T extends Element>(
  host: HTMLElement,
  name: string,
  type: Constructor<T>,
): T | undefined {
  const selector = `[data-target~="${host.tagName.toLowerCase()}:${name}"]`;
  for (const element of host.querySelectorAll(selector)) {
    if (element.closest(host.tagName) === host && element instanceof type) {
      return element;
    }
  }
}

type Target<T> =
  | Constructor<T>
  | [Constructor<T>, ...Constructor<T>[], null]
  | [Constructor<T>];

type TargetMap = Record<string, Target<any>>;

type InferTarget<T> = T extends [any, ...any[], null]
  ? InstanceType<T[0]> | null
  : T extends [any] ? InstanceType<T[0]>
  : T extends Constructor<any> ? InstanceType<T>
  : never;

type InferTargets<T extends TargetMap> = { [K in keyof T]: InferTarget<T[K]> };

/**
 * Define and access element targets with type safety and validation.
 * Required targets will throw an error if not found.
 *
 * @example
 * ```ts
 * const refs = targetRefs(this, {
 *   // Optional target - type will be HTMLElement | null
 *   target1: [HTMLElement, null],
 *   // Optional target - type will be HTMLDivElement | HTMLSpanElement | null
 *   target2: [HTMLDivElement, HTMLSpanElement, null],
 *   // Required target - type will be HTMLInputElement
 *   target3: [HTMLInputElement]
 * });
 *
 * // TypeScript knows target1 might be undefined
 * refs.target1?.focus();
 * // TypeScript knows target3 is not undefined
 * refs.target3.value = "Hello";
 * ```
 */
export function targetRefs<T extends TargetMap>(
  host: HTMLElement,
  targets: T,
): InferTargets<T> {
  const refs = {} as InferTargets<T>;
  const tag = host.tagName.toLowerCase();

  for (const [name, config] of Object.entries(targets)) {
    const types = Array.isArray(config) ? config : [config];
    const isOptional = types[types.length - 1] === null;
    const elementTypes =
      (isOptional ? types.slice(0, -1) : types) as Constructor<Element>[];

    Object.defineProperty(refs, name, {
      get() {
        for (const type of elementTypes) {
          const el = findTarget(host, name, type);
          if (el) return el;
        }
        if (!isOptional) {
          throw new Error(
            `Missing required target "${name}" in <${tag}>. Use data-target="${tag}:${name}"`,
          );
        }
        return null;
      },
    });
  }

  return refs;
}
