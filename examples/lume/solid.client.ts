import { liftSolid } from "../../packages/solid/mod.ts";

liftSolid("lift-counter", {
  init() {
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
