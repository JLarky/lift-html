import { liftHtml } from "../../packages/lift-html/mod.ts";

const LiftCounter = liftHtml("lift-counter", {
  observedAttributes: ["count"] as const,
  init() {
    const render = () => {
      const count = this.getAttribute("count") || "-";
      const div = document.createElement("div");
      div.className = "loaded";
      div.textContent = count;
      this.innerHTML = div.outerHTML;
    };
    this.acb = render;
    render();
  },
});

console.log("static", LiftCounter.observedAttributes);
