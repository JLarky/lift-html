import { tinyLift } from "../../packages/tiny/mod.ts";

tinyLift("lift-counter", {
  connectedCallback() {
    const render = () => {
      const count = this.getAttribute("count") || "-";
      const div = document.createElement("div");
      div.className = "loaded";
      div.textContent = count;
      this.innerHTML = div.outerHTML;
    };
    render();
  },
});
