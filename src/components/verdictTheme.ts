import type { Verdict } from "../lib/types";

// Flag colours ARE the verdict states (brief §8): green = verified,
// amber = unconfirmed, red = altered. National identity expressed through
// function, not decoration. No flag graphic anywhere.
export interface VerdictTheme {
  band: string; // header band background
  bandInk: string; // header band text
  chip: string; // small badge
  ring: string; // subtle border
  icon: string; // a simple glyph, not an emoji flag
}

export const verdictTheme: Record<Verdict, VerdictTheme> = {
  VERIFIED: {
    band: "bg-verified text-white",
    bandInk: "text-white",
    chip: "bg-verified-bg text-verified-ink",
    ring: "border-verified/30",
    icon: "✓",
  },
  UNCONFIRMED: {
    band: "bg-unconfirmed text-white",
    bandInk: "text-white",
    chip: "bg-unconfirmed-bg text-unconfirmed-ink",
    ring: "border-unconfirmed/30",
    icon: "?",
  },
  ALTERED: {
    band: "bg-altered text-white",
    bandInk: "text-white",
    chip: "bg-altered-bg text-altered-ink",
    ring: "border-altered/30",
    icon: "!",
  },
};
