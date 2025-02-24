import { expectTypeOf } from "npm:expect-type";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { assertEquals, assertThrows } from "jsr:@std/assert";

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
        return null;
      }
    };
    const myHTMLDivElement = class extends myHTMLElement {
      constructor() {
        super("div");
      }
    };
    const myHTMLSpanElement = class extends myHTMLElement {
      constructor() {
        super("span");
      }
    };
    globalThis.HTMLElement = myHTMLElement as unknown as typeof HTMLElement;
    globalThis.HTMLInputElement = class
      extends myHTMLElement {} as unknown as typeof HTMLInputElement;
    globalThis.HTMLButtonElement = class
      extends myHTMLElement {} as unknown as typeof HTMLButtonElement;
    globalThis.HTMLDivElement =
      myHTMLDivElement as unknown as typeof HTMLDivElement;
    globalThis.HTMLSpanElement =
      myHTMLSpanElement as unknown as typeof HTMLSpanElement;
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
          "test-target": [HTMLElement, null],
        });

        // Accessing the target should trigger the query
        refs["test-target"];
        assertSpyCallArgs(mockFn, 0, [expect]);
        assertSpyCalls(mockFn, 1);

        // Second access should reuse the same query
        refs["test-target"];
        assertSpyCalls(mockFn, 2);
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
          optional: [HTMLElement, null],
          required: [HTMLElement],
        });

        // Optional target should be null
        expectTypeOf<typeof refs.optional>().toEqualTypeOf<
          HTMLElement | null
        >();
        const optional = refs.optional;
        expectTypeOf<typeof optional>().toEqualTypeOf<
          HTMLElement | null
        >();
        assertEquals(optional, null);

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
          button: [HTMLButtonElement],
          div: [HTMLDivElement, null],
          span: [HTMLSpanElement, null],
        });

        // TypeScript should know these types
        expectTypeOf<typeof refs.input>().toEqualTypeOf<HTMLInputElement>();
        expectTypeOf<typeof refs.button>().toEqualTypeOf<HTMLButtonElement>();
        expectTypeOf<typeof refs.div>().toEqualTypeOf<HTMLDivElement | null>();
        expectTypeOf<typeof refs.span>().toEqualTypeOf<
          HTMLSpanElement | null
        >();

        // @ts-expect-error unknown fields do not exist
        refs.unknown;
      },
    });

    await t.step({
      name: "returns found elements",
      fn() {
        const div = document.createElement("my-element");
        const target = new myHTMLDivElement() as unknown as HTMLDivElement;
        const mockFn = spy(() => [target]);
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];

        // Mock closest to return null to simulate element not being a child
        (target as unknown as { closest: () => HTMLElement | null }).closest =
          () => null;
        const refs = targetRefs(div, {
          target: [HTMLDivElement, null],
        });
        assertEquals(refs.target, null);

        // Mock closest to return the host element
        (target as unknown as { closest: () => HTMLElement | null }).closest =
          () => div;
        const refs2 = targetRefs(div, {
          target: [HTMLDivElement],
        });
        assertEquals(refs2.target, target);
      },
    });

    await t.step({
      name: "handles multiple element types",
      fn() {
        const div = document.createElement("my-element");
        const divTarget = new myHTMLDivElement() as unknown as HTMLDivElement;
        const spanTarget =
          new myHTMLSpanElement() as unknown as HTMLSpanElement;
        let currentTarget: Element | null = null;
        const mockFn = spy(() => currentTarget ? [currentTarget] : []);
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];

        // Set up closest behavior
        (divTarget as unknown as { closest: () => HTMLElement | null })
          .closest = () => div;
        (spanTarget as unknown as { closest: () => HTMLElement | null })
          .closest = () => div;

        const refs = targetRefs(div, {
          div: [HTMLDivElement, null],
          span: [HTMLSpanElement, null],
        });

        // Should find div element
        currentTarget = divTarget;
        assertEquals(refs.div, divTarget);
        assertEquals(refs.span, null);

        // Should find span element
        currentTarget = spanTarget;
        assertEquals(refs.div, null);
        assertEquals(refs.span, spanTarget);

        // Should return null when no element found
        currentTarget = null;
        assertEquals(refs.div, null);
        assertEquals(refs.span, null);
      },
    });
  },
});
