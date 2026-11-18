import { createEffect } from "npm:solid-js@^2.0.0";
import { liftSolid, useAttributes } from "../../packages/solid/mod.ts";

liftSolid("lift-counter", {
  observedAttributes: ["count"],
  init() {
    const props = useAttributes(this);
    createEffect(() => props.count || "-", (count) => {
      const span = document.createElement("span");
      span.className = "loaded";
      span.textContent = count;
      this.innerHTML = span.outerHTML;
    });
  },
});
