import { expectTypeOf } from "npm:expect-type";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { findTarget, targetRefs } from "./mod.ts";

Deno.test({
  name: "test",
  async fn(t) {
    const myHTMLElement = class {
      constructor(public tagName: string) {}
      querySelectorAll() {
        return [];
      }
    };
    globalThis.HTMLElement = myHTMLElement as unknown as typeof HTMLElement;
    globalThis.document = {
      createElement: (tagName: string) =>
        new myHTMLElement(tagName) as unknown as HTMLElement,
    } as unknown as Document;

    await t.step({
      name: "findTarget calls querySelectorAll",
      fn() {
        const expect = '[data-target~="my-element:test-target"]';
        const mockFn = spy((_element: HTMLElement) => []);
        const div = document.createElement("my-element");
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];
        const testElement = findTarget(div, "test-target");
        expectTypeOf<typeof testElement>().toEqualTypeOf<
          HTMLElement | undefined
        >();
        assertSpyCallArgs(mockFn, 0, [expect]);
        assertSpyCalls(mockFn, 1);
      },
    });

    await t.step({
      name: "targetRefs calls querySelectorAll",
      fn() {
        const expect = '[data-target~="my-element:test-target"]';
        const mockFn = spy((_element: HTMLElement) => []);
        const div = document.createElement("my-element");
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];
        const refs = targetRefs(div, { "test-target": HTMLElement });
        assertSpyCalls(mockFn, 0);
        const testElement = refs["test-target"];
        expectTypeOf<typeof testElement>().toEqualTypeOf<
          HTMLElement | undefined
        >();
        // @ts-expect-error unknown fields do not exist
        expectTypeOf<typeof refs["test-target2"]>().toEqualTypeOf<
          HTMLElement | undefined
        >();
        assertSpyCallArgs(mockFn, 0, [expect]);
        assertSpyCalls(mockFn, 1);
      },
    });
  },
});
