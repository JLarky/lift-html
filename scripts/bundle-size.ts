import { build, BuildOptions } from "npm:esbuild@0.20.0";
import { gzipSize } from "npm:gzip-size@7.0.0";
import { compress } from "npm:wasm-brotli@2.0.2";
import { format } from "jsr:@std/fmt/bytes";
import { walk } from "jsr:@std/fs/walk";

const packages = [
  "packages/solid",
  "packages/core",
  "packages/tiny",
  "packages/incentive",
  "packages/alien",
];

async function getFileSize(filePath: string) {
  try {
    const content = await Deno.readTextFile(filePath);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(content);
    const rawSize = bytes.length;
    const gzippedSize = await gzipSize(content);
    const brotliCompressedSize = (await compress(bytes)).length;

    return {
      raw: format(rawSize),
      gzip: format(gzippedSize),
      brotli: format(brotliCompressedSize),
      code: content,
    };
  } catch (_error: unknown) {
    return { raw: "error", gzip: "error", brotli: "error", code: "" };
  }
}

async function getBundleSize(entryPoint: string, options: BuildOptions = {}) {
  try {
    const result = await build({
      entryPoints: [entryPoint],
      bundle: true,
      write: false,
      minify: true,
      format: "esm",
      external: [
        "solid-js",
        "solid-js/web",
        "solid-js/store",
        "@lift-html/core",
        "@lift-html/solid",
        "@lift-html/alien",
        "@lift-html/incentive",
        "@lift-html/tiny",
      ],
      ...options,
      logLevel: "silent",
    });

    const code = result.outputFiles?.[0]?.contents;
    if (!code) {
      throw new Error("No output generated");
    }

    const rawSize = code.length;
    const gzippedSize = await gzipSize(new TextDecoder().decode(code));
    const brotliCompressedSize = (await compress(code)).length;

    return {
      raw: format(rawSize),
      gzip: format(gzippedSize),
      brotli: format(brotliCompressedSize),
      code: new TextDecoder().decode(code),
      isBundled: true,
    };
  } catch {
    // If bundling fails, fall back to direct file size without logging error
    return {
      ...(await getFileSize(entryPoint)),
      isBundled: false,
    };
  }
}

async function findEntryPoints(packagePath: string): Promise<string[]> {
  const entryPoints: string[] = [];

  for await (
    const entry of walk(packagePath, {
      includeDirs: false,
      match: [/mod\.ts$/],
      skip: [/npm/, /node_modules/, /deps/],
    })
  ) {
    entryPoints.push(entry.path);
  }

  return entryPoints;
}

async function main() {
  console.log("\nAnalyzing sizes...\n");
  console.log(
    "Package".padEnd(20),
    "Entry Point".padEnd(30),
    "Raw".padEnd(15),
    "Gzip".padEnd(15),
    "Brotli".padEnd(15),
    "Mode",
  );
  console.log("-".repeat(110));

  for (const pkg of packages) {
    const entryPoints = await findEntryPoints(pkg);

    for (const entryPoint of entryPoints) {
      const sizes = await getBundleSize(entryPoint);
      const pkgName = pkg.split("/").pop() || "";
      const fileName = entryPoint.split("/").pop() || "";
      const mode = sizes.isBundled ? "bundled" : "raw";

      console.log(
        pkgName.padEnd(20),
        fileName.padEnd(30),
        sizes.raw.padEnd(15),
        sizes.gzip.padEnd(15),
        sizes.brotli.padEnd(15),
        mode,
      );
    }
  }

  console.log("\nNote: Sizes are minified in bundled mode");
  console.log("Note: All @lift-html/* dependencies are excluded from bundles");
  console.log(
    "Note: External dependencies (solid-js) are excluded from bundles",
  );
  console.log(
    "Note: Raw mode shows direct file size when bundling not possible",
  );
  console.log("Note: Brotli typically provides better compression than Gzip");
}

if (import.meta.main) {
  await main();
  Deno.exit(0);
}
