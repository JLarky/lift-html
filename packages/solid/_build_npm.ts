#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
// Copyright 2018-2022 the oak authors. All rights reserved. MIT license.

/**
 * This is the build script for building npm package.
 *
 * @module
 */

import { build, emptyDir } from "jsr:@deno/dnt";

async function start() {
    await emptyDir("./npm");

    await build({
        entryPoints: [
            "./mod.ts",
        ],
        outDir: "./npm",
        shims: {},
        test: false,
        typeCheck: "both",
        compilerOptions: {
            importHelpers: false,
            sourceMap: true,
            target: "Latest",
            lib: ["ESNext", "DOM", "DOM.Iterable"],
        },
        package: {
            name: "@lift-html/solid",
            version: Deno.args[0],
            "description":
                "lift-html is a tiny library for building HTML Web Components, components that are meant to enhance existing HTML on the page instead of rendering it on the client or hydrating it. It utilizes SolidJS to make attributes reactive, uses signals for state management and uses hooks to better manipulate the DOM.",
            license: "CC0-1.0",
            keywords: ["solid", "solidjs"],
            repository: {
                type: "git",
                url: "https://github.com/JLarky/lift-html/tree/main/packages/solid",
            },
            bugs: {
                url: "https://github.com/JLarky/lift-html/issues",
            },
            "contributors": [
                {
                    "name": "Yaroslav (JLarky) Lapin",
                    "email": "jlarky@gmail.com",
                    "url": "https://jlarky.now.sh/",
                },
            ],
            dependencies: {
                "solid-js": "*",
            },
            devDependencies: {},
        },
    });

    await Deno.copyFile("LICENSE", "npm/LICENSE");
    // await Deno.copyFile("README.md", "npm/README.md");
}

start();
