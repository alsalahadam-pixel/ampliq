import { pathToFileURL } from "node:url";

const SRC = pathToFileURL(import.meta.dirname + "/../src/").href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    return nextResolve(`${SRC}${specifier.slice(2)}.ts`, context);
  }
  return nextResolve(specifier, context);
}
