import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SubmitBox from "../components/SubmitBox";
import { TELEGRAM_BOT_URL } from "../config";

export default function Landing() {
  const { t } = useTranslation();

  const verdicts = [
    { name: t("landing.verifiedName"), desc: t("landing.verifiedDesc"), cls: "bg-verified-bg text-verified-ink", dot: "bg-verified" },
    { name: t("landing.unconfirmedName"), desc: t("landing.unconfirmedDesc"), cls: "bg-unconfirmed-bg text-unconfirmed-ink", dot: "bg-unconfirmed" },
    { name: t("landing.alteredName"), desc: t("landing.alteredDesc"), cls: "bg-altered-bg text-altered-ink", dot: "bg-altered" },
  ];

  const stats = [1, 2, 3, 4].map((n) => ({
    value: t(`landing.stat${n}Value`),
    label: t(`landing.stat${n}Label`),
  }));

  const scenarios = [1, 2, 3].map((n) => ({
    who: t(`landing.scenario${n}Who`),
    text: t(`landing.scenario${n}Text`),
  }));

  return (
    <div>
      {/* Hero: the tool itself, above the fold. */}
      <section className="mx-auto w-full max-w-readable px-5 pt-10 sm:pt-14">
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          {t("landing.heroTitle")}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">{t("landing.heroSub")}</p>
        <div className="mt-6">
          <SubmitBox autofocus />
        </div>
        <p className="mt-3 text-center text-sm text-ink-faint">{t("landing.trustLine")}</p>
        <p className="mt-2 text-center text-sm">
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline decoration-sand-400 underline-offset-4 hover:decoration-ink"
          >
            {t("landing.orTelegram")} →
          </a>
        </p>
      </section>

      {/* Impact strip — real numbers. */}
      <section className="mx-auto mt-16 w-full max-w-5xl px-5">
        <h2 className="font-display text-2xl font-semibold">{t("landing.impactTitle")}</h2>
        <p className="mt-2 max-w-readable text-ink-soft">{t("landing.impactIntro")}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="card p-5">
              <dt className="font-display text-3xl font-semibold text-ink">{s.value}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{s.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-ink-faint">{t("landing.statsSource")}</p>
      </section>

      {/* Three honest answers. */}
      <section className="mx-auto mt-16 w-full max-w-5xl px-5">
        <h2 className="font-display text-2xl font-semibold">{t("landing.verdictsTitle")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {verdicts.map((v) => (
            <div key={v.name} className={`rounded-2xl p-5 ${v.cls}`}>
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${v.dot}`} aria-hidden />
              <h3 className="mt-3 font-display text-xl font-semibold">{v.name}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works. */}
      <section className="mx-auto mt-16 w-full max-w-5xl px-5">
        <h2 className="font-display text-2xl font-semibold">{t("landing.howTitle")}</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="card p-5">
              <span className="font-display text-3xl text-ink-faint">{n}</span>
              <h3 className="mt-2 font-display text-lg font-semibold">{t(`landing.how${n}Title`)}</h3>
              <p className="mt-1 text-sm text-ink-soft">{t(`landing.how${n}Body`)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The moment it matters — honest scenario cards (not testimonials). */}
      <section className="mx-auto mt-16 w-full max-w-5xl px-5">
        <h2 className="font-display text-2xl font-semibold">{t("landing.momentTitle")}</h2>
        <p className="mt-2 text-ink-soft">{t("landing.momentIntro")}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {scenarios.map((s, i) => (
            <figure key={i} className="card p-5">
              <blockquote className="text-lg leading-relaxed">
                <span className="font-semibold">{s.who}</span> {s.text}
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

      {/* Who it's for. */}
      <section className="mx-auto mt-16 w-full max-w-5xl px-5">
        <h2 className="font-display text-2xl font-semibold">{t("landing.forWhoTitle")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-display text-xl font-semibold">{t("landing.forCitizensTitle")}</h3>
            <p className="mt-2 text-ink-soft">{t("landing.forCitizensDesc")}</p>
            <Link to="/check" className="btn-primary mt-4">{t("landing.ctaCheck")}</Link>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-xl font-semibold">{t("landing.forOrgsTitle")}</h3>
            <p className="mt-2 text-ink-soft">{t("landing.forOrgsDesc")}</p>
            <Link to="/for-organizations" className="btn-ghost mt-4">{t("nav.forOrganizations")}</Link>
          </div>
        </div>
      </section>

      {/* Why. */}
      <section className="mx-auto mt-16 w-full max-w-readable px-5">
        <div className="card p-6">
          <h2 className="font-display text-2xl font-semibold">{t("landing.whyTitle")}</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{t("landing.whyBody")}</p>
        </div>
      </section>

      {/* Closing CTA. */}
      <section className="mx-auto mt-16 w-full max-w-readable px-5">
        <div className="rounded-2xl bg-ink px-6 py-10 text-center text-sand-50">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t("landing.ctaTitle")}</h2>
          <p className="mt-2 text-sand-200">{t("landing.ctaText")}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/check" className="btn bg-sand-50 text-ink hover:bg-sand-200">
              {t("landing.ctaCheck")}
            </Link>
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-sand-400 text-sand-50 hover:bg-white/10"
            >
              Telegram →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
