import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ForOrganizations() {
  const { t } = useTranslation();
  const freeItems = t("forOrg.freeItems", { returnObjects: true }) as string[];
  const paidItems = t("forOrg.paidItems", { returnObjects: true }) as string[];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
        {t("forOrg.title")}
      </h1>
      <p className="mt-4 text-lg text-ink-soft">{t("forOrg.subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-2xl font-semibold">
            {t("forOrg.freeTitle")}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">{t("forOrg.freeDesc")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {freeItems.map((it) => (
              <li key={it} className="flex gap-2">
                <span className="text-verified">✓</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
        <div className="card border-2 border-ink p-6">
          <h2 className="font-display text-2xl font-semibold">
            {t("forOrg.paidTitle")}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">{t("forOrg.paidDesc")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {paidItems.map((it) => (
              <li key={it} className="flex gap-2">
                <span className="text-verified">✓</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/register" className="btn-primary">
          {t("forOrg.cta")}
        </Link>
        <a href="mailto:hello@example.cm" className="btn-ghost">
          {t("forOrg.contact")}
        </a>
      </div>
    </div>
  );
}
