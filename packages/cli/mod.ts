import { ensureDir } from "jsr:@std/fs@^1.0/ensure-dir";

export async function writeFiles(
  dirName: string,
  corePackage: string,
  solidPackage: string,
) {
  const solidPackagePatched = solidPackage.replaceAll(
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
    Deno.writeTextFileSync(filenameSolid, solidPackagePatched);
    console.log(`%cFile written to ${filenameSolid}`, "color: green;");
    console.log("Don't forget to format the files.");
  } else {
    console.log(corePackage);
  }
}
