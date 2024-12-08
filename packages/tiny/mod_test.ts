import { expectTypeOf } from "npm:expect-type";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { tinyLift } from "./mod.ts";

Deno.test({
  name: "test",
  async fn(t) {
    globalThis.HTMLElement = class {} as unknown as typeof HTMLElement;
    globalThis.customElements = {
      get: () => true,
    } as unknown as typeof customElements;

    await t.step({
      name: "calls connectedCallback",
      fn() {
        const mockFn = spy((_element: HTMLElement) => {});
        const TestElement = tinyLift("test-element", {
          connectedCallback() {
            mockFn(this);
          },
        });
        const element = new TestElement();
        // basically checks `TestElement instance of HTMLElement`
        expectTypeOf<ReturnType<typeof element.getAttribute>>().toEqualTypeOf<
          string | null
        >();
        (element as typeof element & { connectedCallback: () => void })
          .connectedCallback();
        assertSpyCallArgs(mockFn, 0, [element]);
        assertSpyCalls(mockFn, 1);
      },
    });
  },
});
