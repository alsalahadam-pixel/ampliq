/**
 * Lets the node scripts in this folder import the app's own modules with the
 * `@/` alias, exactly as the app does, instead of keeping a parallel copy of
 * anything they need to check.
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./alias-resolve.mjs", pathToFileURL(import.meta.dirname + "/"));
