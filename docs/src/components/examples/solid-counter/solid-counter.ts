import { liftSolid } from "@lift-html/solid";
import { createEffect, createSignal } from "solid-js";

// define a custom element
const MyButton = liftSolid("my-button", {
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
declare module "@lift-html/core" {
  interface KnownElements {
    "my-button": typeof MyButton;
  }
}
