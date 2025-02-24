import { targetRefs } from "@lift-html/incentive";
import { liftHtml } from "@lift-html/core";

liftHtml("lift-counter", {
  observedAttributes: ["count"] as const,
  init() {
    const refs = targetRefs(this, {
      output: [HTMLDivElement],
    });

    const div = document.createElement("div");
    div.className = "loaded";
    div.textContent = this.getAttribute("count") || "1";
    div.dataset.target = `${this.tagName.toLowerCase()}:output`;
    this.appendChild(div);

    this.acb = (name) => {
      if (name === "count") {
        refs.output.textContent = this.getAttribute("count") || "1";
      }
    };
  },
});
