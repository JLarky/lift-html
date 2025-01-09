#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
import { build, emptyDir } from "jsr:@deno/dnt";
import $ from "jsr:@david/dax";

$.cd($.path(new URL("../packages/svelte/", import.meta.url)));

const { version } = await $`cat deno.jsonc`.json();

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
  },
  typeCheck: "both",
  compilerOptions: {
    importHelpers: false,
    sourceMap: true,
    target: "Latest",
    lib: ["ESNext", "DOM", "DOM.Iterable"],
  },
  package: {
    name: "@lift-html/svelte",
    version,
    description:
      "lift-html is a tiny library for building HTML Web Components, components that are meant to enhance existing HTML on the page instead of rendering it on the client or hydrating it. It utilizes Svelte to make attributes reactive, uses runes for state management",
    license: "CC0-1.0",
    keywords: ["svelte"],
    repository: {
      type: "git",
      url: "https://github.com/JLarky/lift-html/tree/main/packages/svelte",
    },
    bugs: {
      url: "https://github.com/JLarky/lift-html/issues",
    },
    dependencies: {
      "@lift-html/core": "*",
      "svelte": ">=5",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    // Deno.copyFileSync("README.md", "npm/README.md");
  },
});

await Deno.writeTextFile(
  "npm/.npmignore",
  [
    //
    "_dnt.test_shims.ts",
    "mod_test.d.ts.map",
    "_dnt.test_shims.d.ts.map",
    "mod_test.ts",
    "src/deps",
    "script/deps",
    "esm/deps",
    "",
  ]
    .join("\n"),
  { append: true },
);
