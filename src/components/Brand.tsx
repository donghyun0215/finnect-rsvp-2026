// FIN:NECT 2026 identity (Krow Studio key visual, 6th draft, 29 Apr 2026).
// Paths traced from the KV PDF. Yellow #FFE300 is fixed; the letters take
// currentColor so the logo works on light and dark grounds.
import type { CSSProperties } from "react";

const SYMBOL = ["M 50.96 29.3 C 50.96 27.19 49.25 25.48 47.14 25.48 C 49.25 25.48 50.96 23.77 50.96 21.66 C 50.96 23.77 52.68 25.48 54.79 25.48 C 52.68 25.48 50.96 27.19 50.96 29.3", "M 76.45 54.79 C 76.45 52.68 74.74 50.96 72.63 50.96 C 74.74 50.96 76.45 49.25 76.45 47.14 C 76.45 49.25 78.16 50.96 80.27 50.96 C 78.16 50.96 76.45 52.68 76.45 54.79", "M 101.93 50.96 L 50.97 50.96 L 50.97 0 L 101.93 0 Z", "M 76.45 76.45 L 25.48 76.45 L 25.48 25.48 L 76.45 25.48 Z", "M 25.48 54.79 C 25.48 52.68 23.77 50.96 21.66 50.96 C 23.77 50.96 25.48 49.25 25.48 47.14 C 25.48 49.25 27.2 50.96 29.3 50.96 C 27.2 50.96 25.48 52.68 25.48 54.79", "M 50.96 80.27 C 50.96 78.16 49.25 76.45 47.14 76.45 C 49.25 76.45 50.96 74.74 50.96 72.63 C 50.96 74.74 52.68 76.45 54.79 76.45 C 52.68 76.45 50.96 78.16 50.96 80.27", "M 50.97 101.93 L 0 101.93 L 0 50.96 L 50.97 50.96 Z"];
const YELLOW = ["M 50.96 29.3 C 50.96 27.19 49.25 25.48 47.14 25.48 C 49.25 25.48 50.96 23.77 50.96 21.66 C 50.96 23.77 52.68 25.48 54.79 25.48 C 52.68 25.48 50.96 27.19 50.96 29.3", "M 76.45 54.79 C 76.45 52.68 74.74 50.96 72.63 50.96 C 74.74 50.96 76.45 49.25 76.45 47.14 C 76.45 49.25 78.16 50.96 80.27 50.96 C 78.16 50.96 76.45 52.68 76.45 54.79", "M 101.93 50.96 L 50.97 50.96 L 50.97 0 L 101.93 0 Z", "M 76.45 76.45 L 25.48 76.45 L 25.48 25.48 L 76.45 25.48 Z", "M 25.48 54.79 C 25.48 52.68 23.77 50.96 21.66 50.96 C 23.77 50.96 25.48 49.25 25.48 47.14 C 25.48 49.25 27.2 50.96 29.3 50.96 C 27.2 50.96 25.48 52.68 25.48 54.79", "M 50.96 80.27 C 50.96 78.16 49.25 76.45 47.14 76.45 C 49.25 76.45 50.96 74.74 50.96 72.63 C 50.96 74.74 52.68 76.45 54.79 76.45 C 52.68 76.45 50.96 78.16 50.96 80.27", "M 50.97 101.93 L 0 101.93 L 0 50.96 L 50.97 50.96 Z", "M 346.43 41.82 L 328.14 41.82 L 328.14 23.54 L 346.43 23.54 Z", "M 346.43 78.39 L 328.14 78.39 L 328.14 60.11 L 346.43 60.11 Z"];
const LETTERS = ["M 182.96 26.8 L 157.32 26.8 L 157.32 42.12 L 181.07 42.12 L 181.07 57.55 L 157.32 57.55 L 157.32 90.56 L 139.04 90.56 L 139.04 11.38 L 182.96 11.38 Z", "M 215.01 90.55 L 196.73 90.55 L 196.73 11.37 L 215.01 11.37 Z", "M 232.7 90.55 L 232.7 11.38 L 248.61 11.38 L 291.58 62.42 L 291.58 11.38 L 309.86 11.38 L 309.86 90.55 L 293.95 90.55 L 250.98 39.27 L 250.98 90.55 Z", "M 364.71 90.55 L 364.71 11.38 L 380.62 11.38 L 423.59 62.42 L 423.59 11.38 L 441.88 11.38 L 441.88 90.55 L 425.97 90.55 L 382.99 39.27 L 382.99 90.55 Z", "M 503.95 26.8 L 477.48 26.8 L 477.48 42.12 L 502.65 42.12 L 502.65 57.55 L 477.48 57.55 L 477.48 75.13 L 503.95 75.13 L 503.95 90.56 L 459.2 90.56 L 459.2 11.38 L 503.95 11.38 Z", "M 576 88.06 C 569 91.63 563.3 92.34 558.55 92.34 C 543.95 92.34 534.1 87.35 527.45 80.82 C 520.33 73.94 515.11 63.49 515.11 50.79 C 515.11 38.32 520.33 27.88 527.45 20.99 C 534.46 14.22 544.66 9.59 557.01 9.59 C 562.23 9.59 568.29 10.66 576 13.98 L 576 35.12 C 571.97 30.84 565.91 26.69 557.49 26.69 C 550.84 26.69 545.5 28.82 541.34 32.86 C 536.95 37.14 533.86 43.55 533.86 51.14 C 533.86 59.33 537.18 65.15 540.75 68.59 C 542.41 70.26 548.11 75.24 557.84 75.24 C 562.59 75.24 569 73.94 576 67.05 Z", "M 618.38 26.8 L 618.38 90.56 L 600.1 90.56 L 600.1 26.8 L 582.88 26.8 L 582.88 11.38 L 635.59 11.38 L 635.59 26.8 Z"];

export const BRAND_YELLOW = "#FFE300";

export function FinnectLogo({ className = "", title = "FIN:NECT" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 635.59 101.93" className={className} role="img" aria-label={title}>
      {YELLOW.map((d, i) => <path key={`y${i}`} d={d} fill={BRAND_YELLOW} />)}
      {LETTERS.map((d, i) => <path key={`l${i}`} d={d} fill="currentColor" />)}
    </svg>
  );
}

export function FinnectSymbol({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 101.93 101.93" className={className} style={style} aria-hidden>
      {SYMBOL.map((d, i) => <path key={i} d={d} fill={BRAND_YELLOW} />)}
    </svg>
  );
}

// The KV's icon system: unit squares on a 5×5 grid, joined by small
// concave "colon" nodes wherever two squares meet at a corner.
type Cell = [number, number];
const checker: Cell[] = [];
for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) if ((x + y) % 2 === 0) checker.push([x, y]);
export const PATTERNS = {
  connect: checker,
  challenge: [[2, 0], [4, 0], [3, 1], [2, 2], [4, 2], [1, 3], [0, 4]] as Cell[],
  school: [[0, 0], [4, 0], [1, 1], [3, 1], [2, 2], [1, 3], [3, 3], [0, 4], [4, 4]] as Cell[],
  demoday: [[0, 0], [2, 0], [4, 0], [0, 2], [2, 2], [4, 2], [0, 4], [2, 4], [4, 4]] as Cell[],
};
export type PatternName = keyof typeof PATTERNS;

export const node = (cx: number, cy: number, r = 0.16, k = 0.448 * 0.16) =>
  `M${cx} ${cy + r}C${cx} ${cy + k} ${cx - k} ${cy} ${cx - r} ${cy}C${cx - k} ${cy} ${cx} ${cy - k} ${cx} ${cy - r}` +
  `C${cx} ${cy - k} ${cx + k} ${cy} ${cx + r} ${cy}C${cx + k} ${cy} ${cx} ${cy + k} ${cx} ${cy + r}Z`;

export function NodePattern({ name, className = "", color = "currentColor" }: { name: PatternName; className?: string; color?: string }) {
  const cells = PATTERNS[name];
  const has = new Set(cells.map(([x, y]) => `${x},${y}`));
  const joins: string[] = [];
  for (const [x, y] of cells) {
    if (has.has(`${x + 1},${y + 1}`)) joins.push(node(x + 1, y + 1));
    if (has.has(`${x + 1},${y - 1}`)) joins.push(node(x + 1, y));
  }
  return (
    <svg viewBox="0 0 5 5" className={className} fill={color} aria-hidden>
      {cells.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" className="node-cell" style={{ "--i": i } as CSSProperties} />
      ))}
      {joins.map((d, i) => <path key={`j${i}`} d={d} />)}
    </svg>
  );
}
