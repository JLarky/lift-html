import { assertEquals } from "jsr:@std/assert";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { liftHtml } from "./mod.ts";

Deno.test("observedAttributes is set", () => {
  const TestElement = liftHtml("test-element", {
    observedAttributes: ["test"],
  });
  const element = new TestElement();
  assertEquals(element.options.observedAttributes, ["test"]);
  assertEquals(TestElement.observedAttributes, ["test"]);
});

Deno.test("formAssociated is set", () => {
  const TestElement = liftHtml("test-element", {
    formAssociated: true,
  });
  const element = new TestElement();
  assertEquals(element.options.formAssociated, true);
  assertEquals(TestElement.formAssociated, true);
});

Deno.test("connectedCallback is called", () => {
  const mockFn = spy((_element: HTMLElement) => {});
  const TestElement = liftHtml("test-element", {
    connectedCallback() {
      mockFn(this);
    },
  });
  const element = new TestElement();
  element.connectedCallback();
  assertSpyCallArgs(mockFn, 0, [element]);
  assertSpyCalls(mockFn, 1);
});

Deno.test("disconnectedCallback is called", () => {
  const mockFn = spy((_element: HTMLElement) => {});
  const TestElement = liftHtml("test-element", {
    disconnectedCallback() {
      mockFn(this);
    },
  });
  const element = new TestElement();
  element.disconnectedCallback();
  assertSpyCallArgs(mockFn, 0, [element]);
  assertSpyCalls(mockFn, 1);
});

Deno.test("adoptedCallback is called", () => {
  const mockFn = spy((_element: HTMLElement) => {});
  const TestElement = liftHtml("test-element", {
    adoptedCallback() {
      mockFn(this);
    },
  });
  const element = new TestElement();
  element.adoptedCallback();
  assertSpyCallArgs(mockFn, 0, [element]);
  assertSpyCalls(mockFn, 1);
});

Deno.test("attributeChangedCallback is called", () => {
  const mockFn = spy(
    (
      _element: HTMLElement,
      _name: string,
      _oldValue: string | null,
      _newValue: string | null,
    ) => {},
  );
  const TestElement = liftHtml("test-element", {
    attributeChangedCallback(name, oldValue, newValue) {
      mockFn(this, name, oldValue, newValue);
    },
  });
  const element = new TestElement();
  element.attributeChangedCallback("test", "old", "new");
  assertSpyCallArgs(mockFn, 0, [element, "test", "old", "new"]);
  assertSpyCalls(mockFn, 1);
});
