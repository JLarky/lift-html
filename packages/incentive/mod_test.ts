import { expectTypeOf } from "npm:expect-type";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { assertThrows } from "jsr:@std/assert";

import { findTarget, targetRefs } from "./mod.ts";

Deno.test({
  name: "test",
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

    await t.step({
      name: "targetRefs supports required refs",
      fn() {
        const div = document.createElement("my-element");
        const mockFn = spy((_element: HTMLElement) => []);
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];

        const refs = targetRefs(div, {
          optional: HTMLElement,
          required: { type: HTMLElement, required: true, validate: "lazy" },
        });

        // Optional ref should be undefined
        expectTypeOf<typeof refs.optional>().toEqualTypeOf<
          HTMLElement | undefined
        >();
        const optional = refs.optional;
        expectTypeOf<typeof optional>().toEqualTypeOf<
          HTMLElement | undefined
        >();

        // Required ref should throw error when accessed
        expectTypeOf<typeof refs.required>().toEqualTypeOf<HTMLElement>();
        assertThrows(
          () => refs.required,
          Error,
          'Required target "required" not found in <my-element>',
        );
      },
    });

    await t.step({
      name: "targetRefs supports validation modes",
      fn() {
        const div = document.createElement("my-element");
        const mockFn = spy((_element: HTMLElement) => []);
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];

        // Immediate validation should throw right away
        assertThrows(
          () =>
            targetRefs(div, {
              immediate: {
                type: HTMLElement,
                required: true,
                validate: "immediate",
              },
            }),
          Error,
          'Required target "immediate" not found in <my-element>',
        );

        // Lazy validation should only throw when accessed
        const refs = targetRefs(div, {
          lazy: {
            type: HTMLElement,
            required: true,
            validate: "lazy",
          },
        });
        assertThrows(
          () => refs.lazy,
          Error,
          'Required target "lazy" not found in <my-element>',
        );

        // No validation should return undefined without throwing
        const noValidation = targetRefs(div, {
          none: {
            type: HTMLElement,
            required: true,
            validate: "none",
          },
        });
        noValidation.none; // Should not throw
      },
    });

    await t.step({
      name: "targetRefs supports custom error messages",
      fn() {
        const div = document.createElement("my-element");
        const mockFn = spy((_element: HTMLElement) => []);
        div.querySelectorAll =
          mockFn as unknown as typeof div["querySelectorAll"];

        const customMessage = "Custom error message";
        assertThrows(
          () =>
            targetRefs(div, {
              custom: {
                type: HTMLElement,
                required: true,
                validate: "immediate",
                errorMessage: customMessage,
              },
            }),
          Error,
          customMessage,
        );
      },
    });
  },
});
