import { expectTypeOf } from "npm:expect-type";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { assertThrows } from "jsr:@std/assert";

import { targetRefs } from "./mod.ts";

Deno.test({
  name: "targetRefs",
  async fn(t) {
    const myHTMLElement = class {
      constructor(public tagName: string) {}
      querySelectorAll() {
        return [];
      }
      closest(_selector: string) {
        return this;
      }
    };
    globalThis.HTMLElement = myHTMLElement as unknown as typeof HTMLElement;
    globalThis.HTMLInputElement = class
      extends myHTMLElement {} as unknown as typeof HTMLInputElement;
    globalThis.HTMLButtonElement = class
      extends myHTMLElement {} as unknown as typeof HTMLButtonElement;
    globalThis.document = {
      createElement: (tagName: string) =>
        new myHTMLElement(tagName) as unknown as HTMLElement,
    } as unknown as Document;

    await t.step({
      name: "finds targets using querySelectorAll",
      fn() {
        const expect = '[data-target~="my-element:test-target"]';
        const mockFn = spy((_element: HTMLElement) => []);
        const div = document.createElement("my-element");
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];

        const refs = targetRefs(div, {
          "test-target": HTMLElement,
        });

        // Accessing the target should trigger the query
        refs["test-target"];
        assertSpyCallArgs(mockFn, 0, [expect]);
        assertSpyCalls(mockFn, 1);
      },
    });

    await t.step({
      name: "supports optional and required targets",
      fn() {
        const div = document.createElement("my-element");
        const mockFn = spy((_element: HTMLElement) => []);
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];

        const refs = targetRefs(div, {
          optional: HTMLElement,
          required: [HTMLElement, true],
        });

        // Optional target should be undefined
        expectTypeOf<typeof refs.optional>().toEqualTypeOf<
          HTMLElement | undefined
        >();
        const optional = refs.optional;
        expectTypeOf<typeof optional>().toEqualTypeOf<
          HTMLElement | undefined
        >();

        // Required target should throw error when accessed
        expectTypeOf<typeof refs.required>().toEqualTypeOf<HTMLElement>();
        assertThrows(
          () => refs.required,
          Error,
          'Missing required target "required" in <my-element>',
        );
      },
    });

    await t.step({
      name: "enforces type safety",
      fn() {
        const div = document.createElement("my-element");
        const refs = targetRefs(div, {
          input: HTMLInputElement,
          button: [HTMLButtonElement, true],
        });

        // TypeScript should know these types
        expectTypeOf<typeof refs.input>().toEqualTypeOf<
          HTMLInputElement | undefined
        >();
        expectTypeOf<typeof refs.button>().toEqualTypeOf<HTMLButtonElement>();

        // @ts-expect-error unknown fields do not exist
        refs.unknown;
      },
    });
  },
});
