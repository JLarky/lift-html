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
 * import { targetRefs } from '@lift-html/incentive';
 *
 * liftHtml('my-element', {
 *   init() {
 *     const refs = targetRefs(this, {
 *       button: HTMLElement,
 *       input: HTMLInputElement,
 *     });
 *     // note that typescript will know that input has the `value` property
 *     refs.button.onclick = () => refs.input.value = 'Hello world';
 *   }
 * });
 * </script>
 * ```
 */
export function targetRefs<Targets extends Record<string, Constructor>>(
  self: HTMLElement,
  targets: Targets,
): { [K in keyof Targets]: InstanceType<Targets[K]> | undefined } {
  const refs = {} as {
    [K in keyof Targets]: InstanceType<Targets[K]> | undefined;
  };
  for (const [key, targetType] of Object.entries(targets)) {
    Object.defineProperty(refs, key, {
      get() {
        return findTarget(self, key, targetType);
      },
    });
  }
  return refs;
}
