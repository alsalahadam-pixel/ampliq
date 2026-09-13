import type { ServiceFamily } from "@/content/service-families";

/**
 * The image at the top of each service card.
 *
 * AMPLIQ has no photography, and a stock library would say the opposite of
 * what this section claims — an agency that sells cinematic film cannot
 * illustrate it with somebody else's picture of a camera. So each cover is
 * drawn: six marks in the brand's own geometry, one per discipline, built from
 * the same thin rules and single accent the rest of the site uses.
 *
 * Each one is a diagram of the work rather than a picture of it. A visitor
 * should know which card they are looking at before reading the title: the
 * letterbox and focus brackets, the fanned 9:16 frames, the crop marks, the
 * viewport, the rising steps, the converging nodes.
 *
 * All of it is inline SVG on a `viewBox`, so it costs no request, scales to any
 * card width, and animates on the compositor. `vector-effect` keeps every
 * hairline at one physical pixel however far the card is scaled on hover.
 *
 * When photography does arrive, a cover becomes the layer behind it: register
 * the slot in `@/content/media`, render the image in the same box, and keep the
 * drawing as what shows while it loads.
 */

const STROKE = {
  fill: "none",
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke",
} as const;

/** 16:10, the ratio the card reserves. All six are drawn on this box. */
const BOX = "0 0 320 200";

function Film() {
  return (
    <svg viewBox={BOX} aria-hidden="true" className="h-full w-full">
      {/* Letterbox: the frame within the frame. Thin enough to read as a
          crop rather than as two empty bands. */}
      <rect x="0" y="0" width="320" height="22" className="fill-ink" />
      <rect x="0" y="178" width="320" height="22" className="fill-ink" />
      {/* Focus brackets, as a camera draws them. */}
      {[
        [104, 66, 1, 1],
        [216, 66, -1, 1],
        [104, 134, 1, -1],
        [216, 134, -1, -1],
      ].map(([x, y, sx, sy]) => (
        <path
          key={`${x}-${y}`}
          d={`M ${x} ${y + 14 * sy} L ${x} ${y} L ${x + 16 * sx} ${y}`}
          className="stroke-accent"
          {...STROKE}
        />
      ))}
      {/* The iris: concentric rings, opening. */}
      <circle cx="160" cy="100" r="26" className="stroke-paper/45" {...STROKE} />
      <circle cx="160" cy="100" r="15" className="stroke-paper/25" {...STROKE} />
      <circle cx="160" cy="100" r="4" className="fill-accent" />
      {/* Timecode. */}
      <text
        x="20"
        y="15.5"
        className="fill-paper/55 font-mono text-[9px] tracking-[0.18em]"
      >
        00:00:24:12
      </text>
      <circle cx="300" cy="11" r="3" className="fill-accent" />
    </svg>
  );
}

function Social() {
  return (
    <svg viewBox={BOX} aria-hidden="true" className="h-full w-full">
      {/* Three 9:16 frames, fanned — the shape of short-form. */}
      {[
        { x: 96, r: -8, o: "0.25" },
        { x: 224, r: 8, o: "0.25" },
        { x: 160, r: 0, o: "1" },
      ].map((frame) => (
        <g key={frame.x} transform={`rotate(${frame.r} ${frame.x} 100)`}>
          <rect
            x={frame.x - 29}
            y="32"
            width="58"
            height="103"
            rx="6"
            className="stroke-paper"
            opacity={frame.o}
            {...STROKE}
          />
          {frame.o === "1" ? (
            <path
              d={`M ${frame.x - 6} 76 L ${frame.x + 10} 84 L ${frame.x - 6} 92 Z`}
              className="fill-accent"
            />
          ) : null}
        </g>
      ))}
      {/* What the posting is for: a line that climbs. */}
      <path
        d="M 40 172 L 80 164 L 120 168 L 160 152 L 200 156 L 240 138 L 280 126"
        className="stroke-accent"
        {...STROKE}
      />
      <circle cx="280" cy="126" r="3.5" className="fill-accent" />
    </svg>
  );
}

function Design() {
  return (
    <svg viewBox={BOX} aria-hidden="true" className="h-full w-full">
      {/* Crop marks: the page before it is trimmed. */}
      {[
        [70, 44, 1, 1],
        [250, 44, -1, 1],
        [70, 156, 1, -1],
        [250, 156, -1, -1],
      ].map(([x, y, sx, sy]) => (
        <g key={`${x}-${y}`} className="stroke-paper/35">
          <path d={`M ${x - 14 * sx} ${y} L ${x + 10 * sx} ${y}`} {...STROKE} />
          <path d={`M ${x} ${y - 14 * sy} L ${x} ${y + 10 * sy}`} {...STROKE} />
        </g>
      ))}
      {/* Two plates, offset — the overprint. */}
      <rect x="92" y="62" width="86" height="76" className="stroke-paper/30" {...STROKE} />
      <rect x="114" y="76" width="86" height="76" className="stroke-accent" {...STROKE} />
      {/* Type specimen. */}
      <text x="128" y="128" className="fill-paper font-display text-[46px] font-bold">
        Aa
      </text>
      {/* Swatch row. */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={222 + i * 16}
          y="150"
          width="12"
          height="12"
          className={i === 1 ? "fill-accent" : "fill-paper"}
          opacity={i === 1 ? 1 : 0.18 + i * 0.12}
        />
      ))}
    </svg>
  );
}

function Web() {
  return (
    <svg viewBox={BOX} aria-hidden="true" className="h-full w-full">
      {/* A viewport, not a browser screenshot. */}
      <rect x="52" y="34" width="216" height="132" rx="8" className="stroke-paper/45" {...STROKE} />
      <path d="M 52 58 L 268 58" className="stroke-paper/25" {...STROKE} />
      {[66, 76, 86].map((cx) => (
        <circle key={cx} cx={cx} cy="46" r="2.5" className="fill-paper/30" />
      ))}
      {/* The layout inside it: hero, two columns, a button. */}
      <rect x="70" y="72" width="104" height="9" className="fill-paper/80" />
      <rect x="70" y="87" width="72" height="9" className="fill-paper/45" />
      <rect x="70" y="110" width="46" height="13" rx="6.5" className="fill-accent" />
      <rect x="190" y="72" width="62" height="51" rx="4" className="stroke-paper/30" {...STROKE} />
      <path d="M 70 140 L 250 140" className="stroke-paper/18" {...STROKE} />
      <path d="M 70 152 L 196 152" className="stroke-paper/18" {...STROKE} />
      {/* The cursor, on the one thing that matters. */}
      <path
        d="M 108 118 L 108 134 L 112.5 129.5 L 116 137 L 119 135.5 L 115.5 128.5 L 121 128 Z"
        className="fill-paper stroke-ink"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Performance() {
  return (
    <svg viewBox={BOX} aria-hidden="true" className="h-full w-full">
      {/* A search field that found you. */}
      <rect x="52" y="30" width="216" height="26" rx="13" className="stroke-paper/35" {...STROKE} />
      <circle cx="72" cy="43" r="5" className="stroke-paper/55" {...STROKE} />
      <path d="M 76 47 L 80 51" className="stroke-paper/55" {...STROKE} />
      <rect x="90" y="39" width="74" height="8" rx="4" className="fill-paper/30" />
      {/* Rank: the row that moved to the top. */}
      <rect x="52" y="66" width="216" height="16" rx="3" className="fill-accent/18" />
      <rect x="60" y="71" width="56" height="6" rx="3" className="fill-accent" />
      <text x="250" y="78" className="fill-accent font-mono text-[9px] tracking-[0.16em]">
        01
      </text>
      {/* Steps, climbing. Not a chart — a staircase. */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={58 + i * 42}
          y={160 - (i + 1) * 16}
          width="26"
          height={(i + 1) * 16}
          className={i === 4 ? "fill-accent" : "fill-paper"}
          opacity={i === 4 ? 1 : 0.14 + i * 0.07}
        />
      ))}
      <path d="M 52 160 L 268 160" className="stroke-paper/25" {...STROKE} />
    </svg>
  );
}

function Strategy() {
  return (
    <svg viewBox={BOX} aria-hidden="true" className="h-full w-full">
      {/* Six inputs converging on one decision. */}
      {[
        [70, 52],
        [70, 100],
        [70, 148],
        [126, 74],
        [126, 126],
        [104, 100],
      ].map(([x, y]) => (
        <line
          key={`${x}-${y}`}
          x1={x}
          y1={y}
          x2="196"
          y2="100"
          className="stroke-paper/22"
          {...STROKE}
        />
      ))}
      {[
        [70, 52],
        [70, 100],
        [70, 148],
        [126, 74],
        [126, 126],
        [104, 100],
      ].map(([x, y]) => (
        <circle key={`n-${x}-${y}`} cx={x} cy={y} r="3.5" className="fill-paper/45" />
      ))}
      {/* The decision. */}
      <circle cx="196" cy="100" r="21" className="stroke-accent" {...STROKE} />
      <circle cx="196" cy="100" r="6" className="fill-accent" />
      {/* And the one line out of it. */}
      <path d="M 217 100 L 272 100" className="stroke-accent" {...STROKE} />
      <path d="M 264 93 L 272 100 L 264 107" className="stroke-accent" {...STROKE} />
    </svg>
  );
}

const COVERS: Record<ServiceFamily["id"], () => React.ReactElement> = {
  film: Film,
  social: Social,
  design: Design,
  web: Web,
  performance: Performance,
  strategy: Strategy,
};

export function ServiceCover({ id }: { id: ServiceFamily["id"] }) {
  const Drawing = COVERS[id];
  return <Drawing />;
}
