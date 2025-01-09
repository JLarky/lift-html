import { assertEquals } from "jsr:@std/assert";
// import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { createAttributes, liftSvelte } from "./mod.ts";

// Deno.test("this crashes in server build unfortunatelly", () => {
//   const mockFn = spy((_element: HTMLElement) => {});
//   const TestElement = liftSolid("test-element", {
//     observedAttributes: ["test"],
//     init() {
//       mockFn(this);
//     },
//   });
//   const element = new TestElement();
//   Object.defineProperty(element, "isConnected", { value: true });
//   element.connectedCallback();
//   //   element.attributeChangedCallback("test", "old", "new");
// });

Deno.test("createAttributes creates props", () => {
  const TestElement = liftSvelte("test-element", {
    observedAttributes: ["count"],
  });
  const el = new TestElement();
  el.getAttribute = () => "1";
  assertEquals(typeof el.acb, "undefined");
  const props = createAttributes(el);
  assertEquals(typeof el.acb, "function");
  assertEquals(props.count, "1");
  // other props do nothing
  el.acb!("not-count", "10");
  assertEquals(props.count, "1");
  // changing count updates props
  el.acb!("count", "10");
  assertEquals(props.count, "10");
});
