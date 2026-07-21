import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  const limits = t("about.limits", { returnObjects: true }) as string[];
  return (
    <div className="container-readable py-12">
      <h1 className="font-display text-3xl font-semibold">{t("about.title")}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t("about.body")}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold">
        {t("about.principlesTitle")}
      </h2>
      <div className="mt-4 space-y-3">
        {["p1", "p2", "p3"].map((p) => (
          <p key={p} className="card p-4 leading-relaxed">
            {t(`about.${p}`)}
          </p>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold">
        {t("about.limitsTitle")}
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-soft">
        {limits.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
