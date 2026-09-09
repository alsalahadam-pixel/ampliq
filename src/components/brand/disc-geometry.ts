/**
 * AMPLIQ DISC — the single geometric source of truth for the brand mark.
 *
 * Traced from the supplied AMPLIQ artwork. The construction is:
 *
 *   1. a heavy ring around a generous counter and a solid centre disc
 *   2. the ring interrupted at the lower right
 *   3. a detached, squared-off bar on the 45° diagonal that runs from inside
 *      the band out past the circle's silhouette
 *
 * That interruption plus the outboard bar is what makes the mark read as a Q
 * rather than as a target or a loading spinner.
 *
 * Every rendering of the mark — the React component, the favicon, the files in
 * /public/brand, the Open Graph card — derives from the constants below, so the
 * geometry cannot drift between surfaces. To drop in an official vector export,
 * replace the generated SVGs, or these constants, in this one place.
 */

export const DISC_VIEWBOX = "0 0 100 100";

const CX = 50;
const CY = 50;

/**
 * Ring, counter and centre disc, as fractions of the outer radius in the
 * supplied artwork: disc ≈ 0.41, counter out to ≈ 0.65, band to 1.0.
 */
const R_OUTER = 46;
const R_INNER = 31;
const R_DOT = 19;

/** The diagonal the interruption and tail are centred on. */
const AXIS_DEGREES = 45;

/** The interruption in the ring, in degrees clockwise from the x-axis. */
const GAP_START = 28;
const GAP_END = 62;

/**
 * The detached tail. It follows the band's curvature — wider at the outer end,
 * narrower at the inner — so it reads as a piece of the ring that has slid
 * outward, rather than as a separate shape floating alongside it.
 */
const TAIL_START = 32;
const TAIL_END = 58;
const TAIL_INNER = 33;
const TAIL_OUTER = 55;

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function polar(radius: number, degrees: number): [number, number] {
  const radians = (degrees * Math.PI) / 180;
  return [
    round(CX + radius * Math.cos(radians)),
    round(CY + radius * Math.sin(radians)),
  ];
}

/**
 * Annular sector from `start` to `end` degrees, measured clockwise from the
 * positive x-axis in SVG coordinates.
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
  R_INNER,
  R_OUTER,
  GAP_END,
  GAP_START + 360,
);

/** The tail, sitting in the ring's gap and breaking the outer silhouette. */
export const DISC_TAIL_PATH = annularSector(
  TAIL_INNER,
  TAIL_OUTER,
  TAIL_START,
  TAIL_END,
);

export const DISC_DOT = { cx: CX, cy: CY, r: R_DOT } as const;

/** Guide radii reused by decorative graphics so they stay on-system. */
export const DISC_GUIDES = {
  center: [CX, CY] as const,
  ringOuter: R_OUTER,
  ringInner: R_INNER,
  dot: R_DOT,
  axisDegrees: AXIS_DEGREES,
} as const;

/** Standalone SVG file body — used to generate the /public/brand assets. */
export function buildDiscSvg(color: string, title = "AMPLIQ"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DISC_VIEWBOX}" role="img" aria-label="${title}">
  <title>${title}</title>
  <path d="${DISC_RING_PATH}" fill="${color}"/>
  <path d="${DISC_TAIL_PATH}" fill="${color}"/>
  <circle cx="${DISC_DOT.cx}" cy="${DISC_DOT.cy}" r="${DISC_DOT.r}" fill="${color}"/>
</svg>
`;
}
