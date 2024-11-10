import { assertEquals } from "jsr:@std/assert";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";

import { tinyLift } from "./mod.ts";

function mockCustomElement() {
    const mockFn = spy();
    globalThis.HTMLElement = class {
        isConnected = false;
    } as typeof HTMLElement;
    globalThis.customElements = {
        define: mockFn,
        get(_name: string) {
            return undefined as typeof HTMLElement | undefined;
        },
        getName(): string {
            throw new Error("Not implemented");
        },
        upgrade() {
            throw new Error("Not implemented");
        },
        whenDefined(_name): Promise<CustomElementConstructor> {
            throw new Error("Not implemented");
        },
    };
    return mockFn;
}

Deno.test("define is called", () => {
    const mockFn = mockCustomElement();
    const TestElement = tinyLift("test-element", {
        connectedCallback() {},
    });
    assertSpyCallArgs(mockFn, 0, ["test-element", TestElement]);
    assertSpyCalls(mockFn, 1);
});

Deno.test("connectedCallback is called", () => {
    const mockFn = spy((_element: HTMLElement) => {});
    const TestElement = tinyLift("test-element", {
        connectedCallback() {
            mockFn(this);
        },
    });
    const element = new TestElement();
    assertEquals(element.isConnected, false);
    (element as typeof element & { connectedCallback(): void })
        .connectedCallback();
    assertSpyCallArgs(mockFn, 0, [element]);
    assertSpyCalls(mockFn, 1);
});
