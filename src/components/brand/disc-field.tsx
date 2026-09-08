import {
  DISC_DOT,
  DISC_RING_PATH,
  DISC_TAIL_PATH,
} from "@/components/brand/disc-geometry";
import { cn } from "@/lib/utils";

/**
 * The DISC rendered as a large compositional element: the mark itself, held
 * inside hairline orbits built on the same radii family. Decorative only —
 * hidden from assistive tech, and the rotation stops under
 * `prefers-reduced-motion`.
 */
export function DiscField({
  className,
  tone = "dark",
  markClassName,
  accentClassName,
}: {
  className?: string;
  tone?: "dark" | "light";
  markClassName?: string;
  accentClassName?: string;
}) {
  const hairline = tone === "dark" ? "rgba(255,255,255,0.18)" : "rgba(15,15,14,0.12)";
  const hairlineStrong =
    tone === "dark" ? "rgba(255,255,255,0.3)" : "rgba(15,15,14,0.22)";

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx={50} cy={50} r={49.4} fill="none" stroke={hairline} strokeWidth={0.3} />
      <circle cx={50} cy={50} r={38} fill="none" stroke={hairline} strokeWidth={0.3} />
      <circle cx={50} cy={50} r={24} fill="none" stroke={hairline} strokeWidth={0.3} />

      {/* Accent arc, rotating on the mark's own centre. */}
      <g className={cn("disc-orbit", accentClassName)} style={{ transformOrigin: "50px 50px" }}>
        <path
          d="M3.6 33.1 A49.4 49.4 0 0 1 33.1 3.6"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.5}
          strokeLinecap="round"
        />
        <circle cx={3.6} cy={33.1} r={1} fill="currentColor" />
      </g>

      <g className="disc-orbit-reverse" style={{ transformOrigin: "50px 50px" }}>
        <path
          d="M12.7 74.7 A38 38 0 0 1 12.7 25.3"
          fill="none"
          stroke={hairlineStrong}
          strokeWidth={0.35}
          strokeLinecap="round"
        />
      </g>

      {/* The mark, scaled inside the orbits. */}
      <g
        transform="translate(50 50) scale(0.46) translate(-50 -50)"
        fill="currentColor"
        className={markClassName}
      >
        <path d={DISC_RING_PATH} />
        <path d={DISC_TAIL_PATH} />
        <circle cx={DISC_DOT.cx} cy={DISC_DOT.cy} r={DISC_DOT.r} />
      </g>
    </svg>
  );
}

/**
 * A single hairline arc used as a section-level connector — the visual thread
 * that ties the three system pillars together.
 */
export function DiscArc({
  className,
  strokeWidth = 1,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={cn("block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 118 C 300 12, 900 12, 1200 118"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
