import * as v from "jsr:@valibot/valibot@^0.42.1";
import { writeFiles } from "./mod.ts";

async function fetchPackage(name: string) {
  const { latest } = await fetchJson(
    v.object({ latest: v.string() }),
    `https://jsr.io/${name}/meta.json`,
  );

  const mod = Deno.readTextFileSync(
    `${import.meta.dirname}/../${name.split("/").at(-1)}/mod.ts`,
  );
  return `// ${name}@${latest}\n\n${mod}`;
}

async function fetchJson<TSchema extends v.GenericSchema>(
  schema: TSchema,
  url: string,
) {
  return v.parse(schema, await (await fetch(url)).json());
}

const dirName = Deno.args[0];

const corePackage = await fetchPackage("@lift-html/core");
const solidPackage = await fetchPackage("@lift-html/solid");

await writeFiles(dirName, corePackage, solidPackage);
