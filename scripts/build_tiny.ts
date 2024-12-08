#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
import { build, emptyDir } from "jsr:@deno/dnt";
import $ from "jsr:@david/dax";

$.cd($.path(new URL("../packages/tiny/", import.meta.url)));

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
    name: "@lift-html/tiny",
    version,
    description:
      "@lift-html/tiny is experimental version of lift-html with tiny bundle size (147 bytes gzipped), you should probably use @lift-html/core or @lift-html/solid instead.",
    license: "CC0-1.0",
    repository: {
      type: "git",
      url: "https://github.com/JLarky/lift-html/tree/main/packages/tiny",
    },
    bugs: {
      url: "https://github.com/JLarky/lift-html/issues",
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
