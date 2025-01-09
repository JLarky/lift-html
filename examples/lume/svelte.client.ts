import { createAttributes, liftSvelte } from "../../packages/svelte/mod.ts";
import "npm:svelte@^5.16.1/internal/disclose-version";
import * as $ from "npm:svelte@^5.16.1/internal/client";

liftSvelte("lift-counter", {
  observedAttributes: ["count"],
  init() {
    const props = createAttributes(this);
    $.user_effect(() => {
      const count = props.count || "-";
      const div = document.createElement("div");
      div.className = "loaded";
      div.textContent = count;
      this.innerHTML = div.outerHTML;
    });
  },
});
