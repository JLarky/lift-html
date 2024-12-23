import { createEffect } from "npm:solid-js@^1.9.3";
import { liftSolid, useAttributes } from "../../packages/solid/mod.ts";

liftSolid("lift-counter", {
  observedAttributes: ["count"],
  init() {
    const props = useAttributes(this);
    createEffect(() => {
      const count = props.count || "-";
      const span = document.createElement("span");
      span.className = "loaded";
      span.textContent = count;
      this.innerHTML = span.outerHTML;
    });
  },
});
