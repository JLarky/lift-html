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

// core

await $`./build_core.ts`;

await npmPublish("core", dryRun);

// tiny

await $`./build_tiny.ts`;

await npmPublish("tiny", dryRun);

// solid

await $`./build_solid.ts`;

await npmPublish("solid", dryRun);

// svelte

await $`./build_svelte.ts`;

await npmPublish("svelte", dryRun);

// incentive

await $`./build_incentive.ts`;

await npmPublish("incentive", dryRun);
