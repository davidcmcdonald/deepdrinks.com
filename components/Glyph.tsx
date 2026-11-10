import type { SVGProps } from "react";

const strokes = {
  out: "M5 19 19 5M6 5h13v13",
  right: "M4 12h15m-6-6 6 6-6 6",
  down: "M12 4v15m-6-6 6 6 6-6",
  chevron: "m6 9 6 6 6-6",
  menu: "M3 7h18M3 12h18M3 17h18",
  close: "m5 5 14 14M19 5 5 19",
  play: "m8 5 11 7-11 7z",
  book: "M12 6v14M3 4.5c3.7-.7 6.7 0 9 2 2.3-2 5.3-2.7 9-2V18c-3.5-.8-6.5-.2-9 1.6C9.5 17.8 6.5 17.2 3 18z",
  mic: "M9 6a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 11v1a7 7 0 0 0 14 0v-1M12 19v3m-3 0h6",
  audio: "M3 10v4m4-8v12m5-16v20m5-16v12m4-8v4",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  check: "m4 12 5 5L20 6",
};
export type GlyphName = keyof typeof strokes;

export default function Glyph({ name, ...props }: SVGProps<SVGSVGElement> & { name: GlyphName }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d={strokes[name]} fill={name === "play" ? "currentColor" : "none"} />
    </svg>
  );
}
