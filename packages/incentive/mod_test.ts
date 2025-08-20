import { expectTypeOf } from "npm:expect-type";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { assertEquals, assertThrows } from "jsr:@std/assert";

import { targetRefs } from "./mod.ts";

Deno.test({
  name: "targetRefs",
  async fn(t) {
    const myHTMLElement = class {
      constructor(public tagName: string) {
        this.dataset = {};
      }
      querySelectorAll() {
        return [];
      }
      closest(_selector: string) {
        return null;
      }
      dataset: Record<string, string>;
    };
    const myHTMLDivElement = class extends myHTMLElement {
      constructor() {
        super("DIV");
      }
    };
    const myHTMLSpanElement = class extends myHTMLElement {
      constructor() {
        super("SPAN");
      }
    };
    globalThis.HTMLElement = myHTMLElement as unknown as typeof HTMLElement;
    globalThis.HTMLInputElement = class extends myHTMLElement {
      constructor() {
        super("INPUT");
      }
    } as unknown as typeof HTMLInputElement;
    globalThis.HTMLButtonElement = class extends myHTMLElement {
      constructor() {
        super("BUTTON");
      }
    } as unknown as typeof HTMLButtonElement;
    globalThis.HTMLDivElement =
      myHTMLDivElement as unknown as typeof HTMLDivElement;
    globalThis.HTMLSpanElement =
      myHTMLSpanElement as unknown as typeof HTMLSpanElement;
    globalThis.document = {
      createElement: (tagName: string) =>
        new myHTMLElement(tagName.toUpperCase()) as unknown as HTMLElement,
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
          "test-target": [HTMLElement],
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
      name: "supports array and single targets",
      fn() {
        const div = document.createElement("my-element");
        const mockFn = spy((_element: HTMLElement) => []);
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];

        const refs = targetRefs(div, {
          array: [HTMLElement],
          required: HTMLElement,
        });

        // Array target should be empty array
        const array: HTMLElement[] = refs.array;
        assertEquals(array, []);

        // Required target should throw error when accessed
        expectTypeOf<typeof refs.required>().toEqualTypeOf<HTMLElement>();
        assertThrows(
          () => refs.required,
          Error,
          'Required target "required" not found in <my-element>',
        );
      },
    });

    await t.step({
      name: "enforces type safety",
      fn() {
        const div = document.createElement("MY-ELEMENT");
        const input =
          new (globalThis.HTMLInputElement as any)() as HTMLInputElement;
        const button =
          new (globalThis.HTMLButtonElement as any)() as HTMLButtonElement;
        const divEl = new myHTMLDivElement() as unknown as HTMLDivElement;
        const spanEl = new myHTMLSpanElement() as unknown as HTMLSpanElement;

        // Add data-target attributes
        input.dataset.target = "my-element:input";
        button.dataset.target = "my-element:button";
        divEl.dataset.target = "my-element:multi";
        spanEl.dataset.target = "my-element:multi";

        // Mock closest behavior
        const mockClosest = () => div;
        input.closest = mockClosest;
        button.closest = mockClosest;
        divEl.closest = mockClosest;
        spanEl.closest = mockClosest;

        // Mock querySelectorAll to return the correct elements
        div.querySelectorAll = ((selector: string) => {
          if (selector.includes("input")) return [input];
          if (selector.includes("button")) return [button];
          if (selector.includes("multi")) return [divEl, spanEl];
          return [];
        }) as unknown as typeof div["querySelectorAll"];

        const refs = targetRefs(div, {
          input: HTMLInputElement,
          button: [HTMLButtonElement],
          multi: [HTMLDivElement, HTMLSpanElement],
        });

        // TypeScript should know these types
        const inputEl: HTMLInputElement = refs.input;
        const buttons: HTMLButtonElement[] = refs.button;
        const multi: Array<HTMLDivElement | HTMLSpanElement> = refs.multi;

        assertEquals(inputEl, input);
        assertEquals(buttons, [button]);
        assertEquals(multi, [divEl, spanEl]);

        // @ts-expect-error unknown fields do not exist
        refs.unknown;
      },
    });

    await t.step({
      name: "returns found elements",
      fn() {
        const div = document.createElement("my-element");
        const target = new myHTMLDivElement() as unknown as HTMLDivElement;
        target.dataset.target = "my-element:target";

        // Mock closest behavior
        (target as unknown as { closest: () => HTMLElement | null }).closest =
          () => div;

        // Mock querySelectorAll to return the target
        div.querySelectorAll = ((selector: string) => {
          if (selector.includes("target")) return [target];
          return [];
        }) as unknown as typeof div["querySelectorAll"];

        const refs = targetRefs(div, {
          target: [HTMLDivElement],
        });
        assertEquals(refs.target, [target]);

        const refs2 = targetRefs(div, {
          target: HTMLDivElement,
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

        divTarget.dataset.target = "my-element:multi";
        spanTarget.dataset.target = "my-element:multi";

        // Mock closest behavior
        (divTarget as unknown as { closest: () => HTMLElement | null })
          .closest = () => div;
        (spanTarget as unknown as { closest: () => HTMLElement | null })
          .closest = () => div;

        // Mock querySelectorAll to return the correct elements
        div.querySelectorAll = ((selector: string) => {
          if (selector.includes("multi")) return [divTarget, spanTarget];
          return [];
        }) as unknown as typeof div["querySelectorAll"];

        const refs = targetRefs(div, {
          multi: [HTMLDivElement, HTMLSpanElement],
        });

        assertEquals(refs.multi, [divTarget, spanTarget]);
      },
    });
  },
});
