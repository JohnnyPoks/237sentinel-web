import { useTranslation } from "react-i18next";

import SubmitBox from "../components/SubmitBox";
import { TELEGRAM_BOT_URL } from "../config";

export default function Landing() {
  const { t } = useTranslation();

  const verdicts = [
    {
      name: t("landing.verifiedName"),
      desc: t("landing.verifiedDesc"),
      cls: "bg-verified-bg text-verified-ink",
      dot: "bg-verified",
    },
    {
      name: t("landing.unconfirmedName"),
      desc: t("landing.unconfirmedDesc"),
      cls: "bg-unconfirmed-bg text-unconfirmed-ink",
      dot: "bg-unconfirmed",
    },
    {
      name: t("landing.alteredName"),
      desc: t("landing.alteredDesc"),
      cls: "bg-altered-bg text-altered-ink",
      dot: "bg-altered",
    },
  ];

  return (
    <div>
      {/* Hero: the tool itself, above the fold. No marketing header first. */}
      <section className="mx-auto w-full max-w-readable px-5 pt-10 sm:pt-14">
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          {t("landing.heroTitle")}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">{t("landing.heroSub")}</p>
        <div className="mt-6">
          <SubmitBox autofocus />
        </div>
        <p className="mt-3 text-center text-sm text-ink-faint">
          {t("landing.trustLine")}
        </p>
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

      {/* Three honest answers */}
      <section className="mx-auto mt-16 w-full max-w-5xl px-5">
        <h2 className="font-display text-2xl font-semibold">
          {t("landing.verdictsTitle")}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {verdicts.map((v) => (
            <div key={v.name} className={`rounded-2xl p-5 ${v.cls}`}>
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${v.dot}`}
                aria-hidden
              />
              <h3 className="mt-3 font-display text-xl font-semibold">{v.name}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-16 w-full max-w-5xl px-5">
        <h2 className="font-display text-2xl font-semibold">
          {t("landing.howTitle")}
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="card p-5">
              <span className="font-display text-3xl text-ink-faint">{n}</span>
              <h3 className="mt-2 font-display text-lg font-semibold">
                {t(`landing.how${n}Title`)}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {t(`landing.how${n}Body`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Why */}
      <section className="mx-auto mt-16 w-full max-w-readable px-5">
        <div className="card p-6">
          <h2 className="font-display text-2xl font-semibold">
            {t("landing.whyTitle")}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">
            {t("landing.whyBody")}
          </p>
        </div>
      </section>
    </div>
  );
}
