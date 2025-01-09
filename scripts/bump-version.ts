#!/usr/bin/env -S DENO_TRACE_PERMISSIONS=1 deno run --allow-env --allow-read --allow-run
import { Checkbox } from "jsr:@cliffy/prompt@1.0.0-rc.7";
import $ from "jsr:@david/dax";

const options = ["core", "solid", "incentive", "svelte", "tiny", "cli"];

try {
  const selected = await Checkbox.prompt({
    message: "Select packages to bump:",
    options: options.map((opt) => ({ name: opt, value: opt, checked: false })),
    minOptions: 0,
    maxOptions: options.length,
  });

  const versions = new Map<string, string>();
  for (const name of selected) {
    const filename = `packages/${name}/deno.jsonc`;
    await $`deno run -A jsr:@kellnerd/bump --file ${filename}`;
    await $`git add ${filename}`;
    versions.set(
      name,
      await $`cat ${filename}`.json().then((json) => json.version),
    );
  }
  if (selected.length === 0) {
    console.log("No packages selected");
    Deno.exit(0);
  }
  await $`git commit -m ${`Release: ${
    selected.map(
      (name) => `@lift-html/${name}@${versions.get(name)}`,
    ).join(", ")
  }`}`;
  for (const name of selected) {
    await $`git tag @lift-html/${name}@${versions.get(name) ?? ""}`;
  }
  console.log("Don't forget to push the changes and tags");
} catch (error) {
  if (error instanceof Deno.errors.Interrupted) {
    console.log("\nUser interrupted the process");
  } else {
    console.error("An error occurred:", error);
  }
}
