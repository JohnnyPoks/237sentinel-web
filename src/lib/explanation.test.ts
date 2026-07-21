import { describe, it, expect } from "vitest";

import { pickExplanation, isVerdict, VERDICTS } from "./explanation";
import { verdictTheme } from "../components/verdictTheme";
import type { Explanation } from "./types";

const exp: Explanation = {
  headline_en: "We cannot confirm this.",
  headline_fr: "Nous ne pouvons pas le confirmer.",
  body_en: "No proof either way.",
  body_fr: "Aucune preuve.",
  action_en: "Call them on a number you already have.",
  action_fr: "Appelez-les sur un numéro que vous avez déjà.",
  checked_en: "We checked the writing.",
  checked_fr: "Nous avons vérifié le texte.",
};

describe("pickExplanation", () => {
  it("returns English for en", () => {
    expect(pickExplanation(exp, "headline", "en")).toBe("We cannot confirm this.");
  });
  it("returns French for fr and fr-CM", () => {
    expect(pickExplanation(exp, "action", "fr")).toBe(
      "Appelez-les sur un numéro que vous avez déjà.",
    );
    expect(pickExplanation(exp, "action", "fr-CM")).toBe(
      "Appelez-les sur un numéro que vous avez déjà.",
    );
  });
  it("defaults unknown languages to English", () => {
    expect(pickExplanation(exp, "checked", "es")).toBe("We checked the writing.");
  });
});

describe("verdict theming", () => {
  it("has a distinct theme for each of the three verdicts", () => {
    for (const v of VERDICTS) {
      expect(verdictTheme[v]).toBeDefined();
      expect(verdictTheme[v].band).toContain(v.toLowerCase());
    }
  });
  it("recognises valid verdicts and rejects others", () => {
    expect(isVerdict("VERIFIED")).toBe(true);
    expect(isVerdict("MAYBE")).toBe(false);
  });
});
