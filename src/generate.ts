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
