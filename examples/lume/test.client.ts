import { liftHtml } from "../../packages/lift-html/mod.ts";

liftHtml("lift-counter", {
  init() {
    console.log("init", this);
  },
});
