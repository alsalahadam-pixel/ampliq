/**
 * AMPLIQ DISC — the single geometric source of truth for the brand mark.
 *
 * The mark is a vector reconstruction of the supplied AMPLIQ artwork: a heavy
 * ring interrupted at the lower right, a detached tail chunk continuing the
 * ring's path outward, and a solid centre disc. That interruption plus tail is
 * what makes it read as a Q rather than a target or a loading spinner.
 *
 * Every rendering of the mark — React component, favicon, app icons, the files
 * in /public/brand — is generated from the constants below, so the geometry can
 * never drift between surfaces. To swap in an official vector file later,
 * replace these constants (or the generated SVGs) in one place.
 *
 * Proportions follow the supplied artwork:
 *   centre disc  ≈ 41% of the mark's diameter
 *   ring band    ≈ 17% of the mark's diameter
 *   interruption  centred on the lower-right diagonal (45°)
 */

export const DISC_VIEWBOX = "0 0 100 100";

const CX = 50;
const CY = 50;

/** Ring band. */
const RING_INNER = 30;
const RING_OUTER = 46;

/** Solid centre disc. */
const DOT_RADIUS = 19;

/**
 * The ring carries material everywhere except this wedge, centred on 45°.
 * The tail sits inside the wedge, inset on both sides, which produces the
 * clean negative-space gaps either side of it.
 */
const GAP_START = 20;
const GAP_END = 70;

/**
 * Detached tail: starts flush with the ring's inner edge and runs past its
 * outer edge, so it reads as a continuation of the band that breaks the
 * circle's silhouette — the weight that makes the mark a Q.
 */
const TAIL_START = 28;
const TAIL_END = 62;
const TAIL_INNER = 30;
const TAIL_OUTER = 54;

function polar(radius: number, degrees: number): [number, number] {
  const radians = (degrees * Math.PI) / 180;
  return [
    round(CX + radius * Math.cos(radians)),
    round(CY + radius * Math.sin(radians)),
  ];
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/**
 * Annular sector (a slice of a ring band) from `start` to `end` degrees,
 * measured clockwise from the positive x-axis in SVG coordinates.
 */
function annularSector(
  innerRadius: number,
  outerRadius: number,
  start: number,
  end: number,
): string {
  const largeArc = Math.abs(end - start) > 180 ? 1 : 0;
  const [ox1, oy1] = polar(outerRadius, start);
  const [ox2, oy2] = polar(outerRadius, end);
  const [ix2, iy2] = polar(innerRadius, end);
  const [ix1, iy1] = polar(innerRadius, start);

  return [
    `M${ox1} ${oy1}`,
    `A${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${ox2} ${oy2}`,
    `L${ix2} ${iy2}`,
    `A${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
    "Z",
  ].join(" ");
}

/** The interrupted ring. */
export const DISC_RING_PATH = annularSector(
  RING_INNER,
  RING_OUTER,
  GAP_END,
  GAP_START + 360,
);

/** The detached tail that turns the ring into a Q. */
export const DISC_TAIL_PATH = annularSector(
  TAIL_INNER,
  TAIL_OUTER,
  TAIL_START,
  TAIL_END,
);

export const DISC_DOT = { cx: CX, cy: CY, r: DOT_RADIUS } as const;

/** Guide radii reused by decorative orbit graphics so they stay on-system. */
export const DISC_GUIDES = {
  center: [CX, CY] as const,
  ringInner: RING_INNER,
  ringOuter: RING_OUTER,
  dot: DOT_RADIUS,
  tailAxisDegrees: 45,
} as const;

/** Standalone SVG file body — used to generate /public/brand assets. */
export function buildDiscSvg(color: string, title = "AMPLIQ"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DISC_VIEWBOX}" width="100" height="100" role="img" aria-label="${title}">
  <path d="${DISC_RING_PATH}" fill="${color}"/>
  <path d="${DISC_TAIL_PATH}" fill="${color}"/>
  <circle cx="${DISC_DOT.cx}" cy="${DISC_DOT.cy}" r="${DISC_DOT.r}" fill="${color}"/>
</svg>
`;
}
