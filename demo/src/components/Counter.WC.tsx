// @refresh reload
"use client";
import { liftHtml } from "@lift-html/solid";
import { createSignal, createEffect } from "solid-js";

// define a custom element
const MyButton = liftHtml("my-button", {
  init() {
    const button = this.querySelector("button");
    if (!button) throw new Error("<my-button> must contain a <button>");
    button.disabled = false;
    const [count, setCount] = createSignal(0);
    button.onclick = () => setCount(count() + 1);
    createEffect(() => {
      button.textContent = `Clicks: ${count()}`;
    });
  },
});

// define types for the custom element
declare module "@lift-html/solid" {
  interface KnownElements {
    "my-button": typeof MyButton;
  }
}

/**
 * This component is only used as a marker to tell bundler to include this file in the build.
 * We rely on the side-effect nature of this file so we can define the component in it.
 *
 * If you want no-build component, you can also just write a script and put it into the `public` folder.
 */
export function CounterWC() {
  return null;
}
