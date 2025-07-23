// define a custom element
export class MyButton extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector("button");
    if (!button) throw new Error("<my-button> must contain a <button>");
    button.disabled = false;
    let count = 0;
    button.onclick = () => {
      count++;
      button.textContent = `Clicks: ${count}`;
    };
  }
}

if (typeof customElements !== "undefined") {
  if (customElements.get("my-button")) {
    console.warn(
      "Can't redefine custom element <my-button>. Page reload required.",
    );
  }
  customElements.define("my-button", MyButton);
}
