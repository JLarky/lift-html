import { liftSolid } from "../../packages/solid/mod.ts";
import { createSignal, createEffect } from "npm:solid-js";

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
declare module "@lift-html/solid" {
  interface KnownElements {
    "my-button": typeof MyButton;
  }
}
