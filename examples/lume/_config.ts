import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";

const site = lume();

site.use(
  esbuild({
    extensions: [".client.ts"],
    options: {
      minify: false,
    },
  }),
);

export default site;
