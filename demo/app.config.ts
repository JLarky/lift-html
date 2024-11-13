import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    // to make the app server-side only
    experimental: {
        islands: true,
    },
});
