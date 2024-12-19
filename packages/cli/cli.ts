import * as v from "jsr:@valibot/valibot@^0.42.1";
import { ensureDir } from "jsr:@std/fs@^1.0/ensure-dir";

async function fetchPackage(name: string) {
  const { latest } = await fetchJson(
    v.object({ latest: v.string() }),
    `https://jsr.io/${name}/meta.json`,
  );

  return `// ${name}@${latest}\n\n${await (await fetch(
    `https://jsr.io/${name}/${latest}/mod.ts`,
  ))
    .text()}`;
}

async function fetchJson<TSchema extends v.GenericSchema>(
  schema: TSchema,
  url: string,
) {
  return v.parse(schema, await (await fetch(url)).json());
}

const dirName = Deno.args[0];

const corePackage = await fetchPackage("@lift-html/core");
const solidPackage = (await fetchPackage("@lift-html/solid")).replaceAll(
  /from .*core.*;/g,
  `from '../core/mod.ts';`,
).replaceAll(
  /from .*solid-js.*;/g,
  `from 'solid-js';`,
);

if (dirName) {
  await ensureDir(`${dirName}/core`);
  await ensureDir(`${dirName}/solid`);
  const filenameCore = `${dirName}/core/mod.ts`;
  Deno.writeTextFileSync(filenameCore, corePackage);
  console.log(`%cFile written to ${filenameCore}`, "color: green;");
  const filenameSolid = `${dirName}/solid/mod.ts`;
  Deno.writeTextFileSync(filenameSolid, solidPackage);
  console.log(`%cFile written to ${filenameSolid}`, "color: green;");
  console.log("Don't forget to format the files.");
} else {
  console.log(corePackage);
}
