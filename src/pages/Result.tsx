import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { api } from "../lib/api";
import type { AnalysisResult } from "../lib/types";
import { pickExplanation as pick } from "../lib/explanation";
import { verdictTheme } from "../components/verdictTheme";

export default function Result() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const stateResult = (location.state as { result?: AnalysisResult } | null)?.result;
  const [result, setResult] = useState<AnalysisResult | null>(stateResult ?? null);
  const [loading, setLoading] = useState(!stateResult);
  const [showTech, setShowTech] = useState(false);

  useEffect(() => {
    if (!result && id) {
      setLoading(true);
      api
        .getAnalysis(id)
        .then(setResult)
        .catch(() => setResult(null))
        .finally(() => setLoading(false));
    }
  }, [id, result]);

  if (loading) {
    return (
      <div className="container-readable py-16 text-center text-ink-soft">
        {t("common.loading")}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container-readable py-16 text-center">
        <p className="text-lg">{t("result.notFound")}</p>
        <Link to="/check" className="btn-primary mt-6">
          {t("nav.check")}
        </Link>
      </div>
    );
  }

  const theme = verdictTheme[result.verdict];
  const lang = i18n.language;
  const exp = result.explanation;
  const headline = pick(exp, "headline", lang) || t(`verdict.${result.verdict}`);
  const summary = pick(exp, "summary", lang) || result.summary;
  const body = pick(exp, "body", lang);
  const action = pick(exp, "action", lang);
  const checked = pick(exp, "checked", lang);
  const confLabel = t(
    `result.confidence${result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)}`,
  );

  return (
    <article className="pb-12">
      {/* The signature element: a bold full-width verdict band. */}
      <header className={`${theme.band} px-5 py-10 sm:py-14`}>
        <div className="mx-auto max-w-readable">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-2xl font-bold"
            >
              {theme.icon}
            </span>
            <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
              {t("result.title")}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            {headline}
          </h1>
          {result.registry.matched && result.registry.organization_name && (
            <p className="mt-2 text-lg opacity-95">
              {result.registry.organization_name}
            </p>
          )}
        </div>
      </header>

      <div className="container-readable -mt-6">
        <div className={`card border ${theme.ring} p-5 sm:p-6`}>
          {/* What this is (semantic summary) */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              {t("result.summaryLabel")}
            </h2>
            <p className="mt-1 text-lg leading-relaxed">{summary}</p>
          </section>

          {/* Body: why */}
          {body && <p className="mt-5 text-lg leading-relaxed">{body}</p>}

          {/* What we checked, in human words */}
          <p className="mt-5 text-sm text-ink-soft">{checked}</p>

          {/* Confidence band — never a bare percentage */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-sand-100 px-3 py-1 text-sm">
            <span className="text-ink-faint">{t("result.confidence")}:</span>
            <span className="font-semibold">{confLabel}</span>
          </div>
        </div>

        {/* What to do — the one clear next action */}
        <div className={`mt-4 rounded-2xl ${theme.chip} p-5`}>
          <h2 className="text-xs font-bold uppercase tracking-wide opacity-80">
            {t("result.whatToDo")}
          </h2>
          <p className="mt-1 text-lg font-semibold leading-relaxed">{action}</p>
        </div>

        {/* Civic line */}
        <p className="mt-5 text-center text-sm text-ink-soft">
          {t("result.civic")}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/check" className="btn-primary">
            {t("result.checkAnother")}
          </Link>
          <Link
            to="/community"
            state={{ linkedAnalysisId: result.id }}
            className="btn-ghost"
          >
            {t("result.report")}
          </Link>
        </div>

        {/* Technical detail — collapsed by default, never first */}
        <div className="mt-8">
          <button
            onClick={() => setShowTech((v) => !v)}
            aria-expanded={showTech}
            className="text-sm font-semibold text-ink-soft underline decoration-sand-400 underline-offset-4 hover:text-ink"
          >
            {showTech ? "▾ " : "▸ "}
            {t("result.technical")}
          </button>
          {showTech && (
            <div className="mt-3 card p-4">
              <p className="mb-3 text-xs text-ink-faint">
                {t("result.technicalHint")}
              </p>
              <ul className="divide-y divide-sand-200">
                {result.signals.map((s, idx) => (
                  <li
                    key={`${s.name}-${idx}`}
                    className="flex items-start justify-between gap-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{s.label}</p>
                      {s.detail && (
                        <p className="text-xs text-ink-faint">{s.detail}</p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${
                        s.direction === "risk"
                          ? "bg-altered-bg text-altered-ink"
                          : s.direction === "trust"
                            ? "bg-verified-bg text-verified-ink"
                            : "bg-sand-100 text-ink-soft"
                      }`}
                    >
                      {s.direction}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
