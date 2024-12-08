#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
import $ from "jsr:@david/dax";

$.cd($.path(new URL(".", import.meta.url)));

const dryRun = Deno.args.includes("--dry-run");

// core

await $`./build_core.ts`;

if (dryRun && false) {
  await $`cd ../packages/core/npm/; npm publish --dry-run`;
} else {
  await $`cd ../packages/core/npm/; npm publish --access=public`;
}
