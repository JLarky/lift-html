#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
import $ from "jsr:@david/dax";

$.cd($.path(new URL(".", import.meta.url)));

const dryRun = Deno.args.includes("--dry-run");

async function npmPublish(name: string, dryRun: boolean) {
  if (dryRun) {
    await $`cd ../packages/${name}/npm/; npm publish --dry-run`;
  } else if (await isVersionDifferent(name)) {
    await $`cd ../packages/${name}/npm/; npm publish --access=public`;
  } else {
    console.log(`npm version is the same for @lift-html/${name}`);
  }
}

async function isVersionDifferent(name: string) {
  const { version } = await $`cat ../packages/${name}/deno.jsonc`.json() as {
    version: string;
  };
  const npmVersion = await $`npm info @lift-html/${name} version --json`
    .json().catch(() => "not_found") as string;
  return version !== npmVersion;
}

// List of all packages to build and publish
const packages = [
  ["core", "build_core.ts"],
  ["tiny", "build_tiny.ts"],
  ["solid", "build_solid.ts"],
  ["alien", "build_alien.ts"],
  ["incentive", "build_incentive.ts"],
] as const;

// Process all packages
for (const [name, buildScript] of packages) {
  console.log(`\nProcessing @lift-html/${name}...`);
  await $`./${buildScript}`;
  await npmPublish(name, dryRun);
}
