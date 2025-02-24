#!/usr/bin/env -S deno run --allow-read=. --allow-write=../packages,./packages

import $ from "jsr:@david/dax";
import { Eta } from "jsr:@eta-dev/eta";

$.cd(import.meta.dirname!);

const eta = new Eta({ views: import.meta.dirname });

for (const name of ["core", "tiny"]) {
  const res = eta.render("./" + name, { name: "Ben" });

  Deno.writeTextFileSync(`../packages/${name}/mod.ts`, res);
  console.log(`File %c${name}/mod.ts`, "color: green", "written");
}

// watch for changes in templates
// ha ha, long story short is that deno --watch will watch when TS files change, but to trigger reload for changes in assets you want deno to know about them, but because we can't actually import those files (they are plaintext) we just create a function to import them but never run it
(() => import("./core.eta"));
(() => import("./tiny.eta"));
(() => import("./inc/types.eta"));
