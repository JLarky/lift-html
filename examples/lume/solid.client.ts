import { createEffect } from "npm:solid-js@^1.9.3";
import { liftSolid, useAttributes } from "../../packages/solid/mod.ts";

liftSolid("lift-counter", {
  observedAttributes: ["count"],
  init() {
    const props = useAttributes(this);
    createEffect(() => {
      const count = props.count || "-";
      const div = document.createElement("div");
      div.className = "loaded";
      div.textContent = count;
      this.innerHTML = div.outerHTML;
    });
  },
});

// // why init2 works but init breaks?
// liftSolid("lift-counter", {
//   init() {
//     this.innerHTML = `Hello`;
//   },
// });
