#!/usr/bin/env -S deno run -A
import $ from "jsr:@david/dax";

$.cd($.path(new URL("../packages/alien/", import.meta.url)));

const pkg = {
  name: "@lift-html/alien",
  version: "0.0.1",
  exports: {
    ".": "./mod.ts",
    "./package.json": "./package.json",
  },
  description:
    "A package for building web components with alien-signals. It provides a simple API for creating custom elements, making them reactive, and handling their lifecycle.",
  keywords: ["alien", "alien-signals", "web-components", "custom-elements"],
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/JLarky/lift-html/tree/main/packages/alien",
  },
  bugs: {
    url: "https://github.com/JLarky/lift-html/issues",
  },
  dependencies: {
    "@lift-html/core": "*",
    "alien-signals": "*",
  },
  publishConfig: {
    access: "public",
  },
};

await Deno.writeTextFile("package.json", JSON.stringify(pkg, null, 2));
