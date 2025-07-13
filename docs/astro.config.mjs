// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://jlarky.github.io",
  base: "/lift-html",
  integrations: [
    starlight({
      title: "Lift HTML Documentation",
      description:
        "Documentation for lift-html - HTML Web Components framework",
      social: [{
        icon: "github",
        label: "GitHub",
        href: "https://github.com/JLarky/lift-html",
      }],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", link: "/" },
            { label: "Installation", link: "/getting-started/installation/" },
            { label: "Quick Start", link: "/getting-started/quick-start/" },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Basic Usage", link: "/guides/basic-usage/" },
            { label: "Components", link: "/guides/components/" },
            { label: "Interoperability", link: "/guides/interoperability/" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
