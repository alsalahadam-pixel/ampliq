/**
 * Generates the static brand files in /public/brand and the app icon from the
 * DISC geometry module, so the shipped assets and the in-app <Logo /> component
 * can never drift apart.
 *
 *   npm run brand
 *
 * The lockup files compose the generated DISC with the AMPLIQ wordmark set in
 * the brand display face. Replace any file here with an official vector export
 * of the same viewBox and nothing else in the site needs to change.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DISC_DOT,
  DISC_RING_PATH,
  DISC_TAIL_PATH,
  DISC_VIEWBOX,
} from "../src/components/brand/disc-geometry.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const INK = "#1D1D1B";
const WHITE = "#FFFFFF";
const BLACK = "#000000";

function discSvg(color: string, label = "AMPLIQ"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DISC_VIEWBOX}" width="100" height="100" role="img" aria-label="${label}">
  <title>${label}</title>
  <path d="${DISC_RING_PATH}" fill="${color}"/>
  <path d="${DISC_TAIL_PATH}" fill="${color}"/>
  <circle cx="${DISC_DOT.cx}" cy="${DISC_DOT.cy}" r="${DISC_DOT.r}" fill="${color}"/>
</svg>
`;
}

function lockupSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100" width="500" height="100" role="img" aria-label="AMPLIQ">
  <title>AMPLIQ</title>
  <g fill="${color}">
    <path d="${DISC_RING_PATH}"/>
    <path d="${DISC_TAIL_PATH}"/>
    <circle cx="${DISC_DOT.cx}" cy="${DISC_DOT.cy}" r="${DISC_DOT.r}"/>
    <text x="130" y="85" font-family="Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="98" font-weight="800" letter-spacing="-2">AMPLIQ</text>
  </g>
</svg>
`;
}

const files: Record<string, string> = {
  "public/brand/ampliq-disc.svg": discSvg(INK),
  "public/brand/ampliq-disc-white.svg": discSvg(WHITE),
  "public/brand/ampliq-disc-black.svg": discSvg(BLACK),
  "public/brand/ampliq-logo.svg": lockupSvg(INK),
  "public/brand/ampliq-logo-white.svg": lockupSvg(WHITE),
  "public/brand/ampliq-logo-black.svg": lockupSvg(BLACK),
  // Favicon: the mark reads at 16px because the centre disc and the ring gap
  // stay well above hairline size.
  "src/app/icon.svg": discSvg(INK, "AMPLIQ"),
};

for (const [relativePath, contents] of Object.entries(files)) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
  console.log(`✓ ${relativePath}`);
}
