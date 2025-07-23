import { liftHtml } from "@lift-html/core";

// define a custom element
const MyButton = liftHtml("my-button", {
  init() {
    const button = this.querySelector("button");
    if (!button) throw new Error("<my-button> must contain a <button>");
    button.disabled = false;
    let count = 0;
    button.onclick = () => {
      count++;
      button.textContent = `Clicks: ${count}`;
    };
  },
});

// define types for the custom element
declare module "@lift-html/core" {
  interface KnownElements {
    "my-button": typeof MyButton;
  }
}
