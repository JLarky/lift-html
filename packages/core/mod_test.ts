import { expectTypeOf } from "npm:expect-type";
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { liftHtml } from "./mod.ts";

Deno.test("observedAttributes is set", () => {
  const TestElement = liftHtml("test-element", {
    observedAttributes: ["test"] as const,
  });
  const element = new TestElement();
  expectTypeOf(element.options.observedAttributes).toEqualTypeOf(
    ["test"] as const,
  );
  expectTypeOf(TestElement.options.observedAttributes).toEqualTypeOf(
    ["test"] as const,
  );
  assertEquals(element.options.observedAttributes, ["test"]);
  assertEquals(TestElement.options.observedAttributes, ["test"]);
  assertEquals(TestElement.observedAttributes, ["test"]);
});

Deno.test("formAssociated is set", () => {
  const TestElement = liftHtml("test-element", {
    formAssociated: true,
  });
  assertEquals(TestElement.options.formAssociated, true);
  assertEquals(TestElement.formAssociated, true);
});

Deno.test("init is called", () => {
  const mockFn = spy((_element: HTMLElement) => {});
  const TestElement = liftHtml("test-element", {
    init() {
      mockFn(this);
    },
  });
  const element = new TestElement();

  // check that init is not called during construction
  assertSpyCalls(mockFn, 0);

  // check that init is not called if component is not connected
  element.connectedCallback();
  assertSpyCalls(mockFn, 0);

  // check that init is called when component is connected
  Object.defineProperty(element, "isConnected", { value: true });
  element.connectedCallback();
  assertSpyCalls(mockFn, 1);
  assertSpyCallArgs(mockFn, 0, [element]);
});

Deno.test("init is called for adoptedCallback", () => {
  const mockFn = spy((_element: HTMLElement) => {});
  const TestElement = liftHtml("test-element", {
    init() {
      mockFn(this);
    },
  });
  const element = new TestElement();

  // check that init is not called during construction
  assertSpyCalls(mockFn, 0);

  // check that init is not called if component is not connected
  element.adoptedCallback();
  assertSpyCalls(mockFn, 0);

  // check that init is called when component is connected
  Object.defineProperty(element, "isConnected", { value: true });
  element.adoptedCallback();
  assertSpyCalls(mockFn, 1);
  assertSpyCallArgs(mockFn, 0, [element]);
});

Deno.test("dispose is called", () => {
  const mockFn = spy((_element: HTMLElement) => {});
  const TestElement = liftHtml("test-element", {
    init(dispose) {
      dispose(() => {
        mockFn(this);
      });
    },
  });
  const element = new TestElement();

  // check that cleanup is not called during construction
  assertSpyCalls(mockFn, 0);

  // check that cleanup is not called when component is not connected
  element.connectedCallback();
  element.disconnectedCallback();
  assertSpyCalls(mockFn, 0);

  // check that cleanup is not called when component is connected but not disconnected yet
  Object.defineProperty(element, "isConnected", { value: true });
  element.connectedCallback();
  assertSpyCalls(mockFn, 0);

  // check that cleanup is called when component is connected and disconnected
  element.disconnectedCallback();
  assertSpyCalls(mockFn, 1);
  assertSpyCallArgs(mockFn, 0, [element]);
});

Deno.test("attributeChangedCallback is called", () => {
  const mockFn = spy(
    (
      _element: HTMLElement,
      _name: string,
      _newValue: string | null,
    ) => {},
  );
  const TestElement = liftHtml("test-element", {
    init() {
      this.acb = (name, newValue) => {
        mockFn(this, name, newValue);
      };
    },
  });
  const element = new TestElement();

  // check that attributeChangedCallback does nothign until element is connected
  element.attributeChangedCallback("test", "old", "new");
  assertSpyCalls(mockFn, 0);

  // check that attributeChangedCallback is called when element is connected
  Object.defineProperty(element, "isConnected", { value: true });
  element.connectedCallback();
  element.attributeChangedCallback("test", "old", "new");
  assertSpyCalls(mockFn, 1);
  assertSpyCallArgs(mockFn, 0, [element, "test", "new"]);

  // check tat attributeChangedCallback is not longer called when element is disconnected
  element.disconnectedCallback();
  element.attributeChangedCallback("test", "old", "new");
  assertSpyCalls(mockFn, 1);
});

Deno.test("lifecycle callbacks execute in correct order", () => {
  const events: string[] = [];
  const mockInit = spy(() => {
    events.push("init");
  });
  const mockCleanup = spy(() => {
    events.push("cleanup");
  });
  const mockAttrChange = spy(() => {
    events.push("attr_change");
  });

  const TestElement = liftHtml("test-element", {
    observedAttributes: ["test"] as const,
    init(dispose) {
      mockInit();
      this.acb = () => mockAttrChange();
      dispose(() => mockCleanup());
    },
  });

  const element = new TestElement();

  // Initial state - nothing should be called
  assertSpyCalls(mockInit, 0);
  assertSpyCalls(mockCleanup, 0);
  assertSpyCalls(mockAttrChange, 0);
  assertEquals(events, []);

  // Connect element
  Object.defineProperty(element, "isConnected", { value: true });
  element.connectedCallback();
  assertSpyCalls(mockInit, 1);
  assertSpyCalls(mockCleanup, 0);
  assertSpyCalls(mockAttrChange, 0);
  assertEquals(events, ["init"]);

  // Change attribute
  element.attributeChangedCallback("test", null, "value");
  assertSpyCalls(mockInit, 1);
  assertSpyCalls(mockCleanup, 0);
  assertSpyCalls(mockAttrChange, 1);
  assertEquals(events, ["init", "attr_change"]);

  // Disconnect element
  element.disconnectedCallback();
  assertSpyCalls(mockInit, 1);
  assertSpyCalls(mockCleanup, 1);
  assertSpyCalls(mockAttrChange, 1);
  assertEquals(events, ["init", "attr_change", "cleanup"]);

  // Attribute changes after disconnect should not trigger callback
  element.attributeChangedCallback("test", "value", "new-value");
  assertSpyCalls(mockInit, 1);
  assertSpyCalls(mockCleanup, 1);
  assertSpyCalls(mockAttrChange, 1);
  assertEquals(events, ["init", "attr_change", "cleanup"]);
});
