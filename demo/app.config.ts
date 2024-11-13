import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    // to make the app server-side only
    experimental: {
        islands: true,
    },
    // I need this to circumvent the issue with deno workspaces
    vite: {
        resolve: {
            alias: { "@lift-html/solid": "../../../packages/solid/mod.ts" },
        },
    },
});
