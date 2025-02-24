import { liftAlien, useAttributes } from "@lift-html/alien";
import { effect } from "npm:alien-signals@^1.0.4";

liftAlien("lift-counter", {
  observedAttributes: ["count"],
  init() {
    const props = useAttributes(this);
    effect(() => {
      const div = document.createElement("div");
      div.className = "loaded";
      div.textContent = props.count();
      if (this.firstChild) {
        this.replaceChild(div, this.firstChild);
      } else {
        this.appendChild(div);
      }
    });
  },
});
