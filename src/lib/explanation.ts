import type { Explanation, Verdict } from "./types";

/** Pick the language-specific field from an Explanation (en/fr). */
export function pickExplanation(
  exp: Explanation,
  base: "headline" | "summary" | "body" | "action" | "checked",
  lang: string,
): string {
  const suffix = lang.startsWith("fr") ? "fr" : "en";
  const key = `${base}_${suffix}` as keyof Explanation;
  return (exp[key] as string) ?? "";
}

/** The verdict determines the whole visual + copy treatment. */
export const VERDICTS: Verdict[] = ["VERIFIED", "UNCONFIRMED", "ALTERED"];

export function isVerdict(v: string): v is Verdict {
  return VERDICTS.includes(v as Verdict);
}
