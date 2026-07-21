import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { api } from "../lib/api";

export default function Organizations() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["orgs", q],
    queryFn: () => api.listOrganizations(q),
  });
  const items = data?.items ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl font-semibold">
        {t("organizations.title")}
      </h1>
      <p className="mt-2 text-ink-soft">{t("organizations.subtitle")}</p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("organizations.search")}
        className="mt-6 w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-lg"
        aria-label={t("organizations.search")}
      />

      <div className="mt-6 grid gap-3">
        {isLoading ? (
          <p className="text-ink-soft">{t("common.loading")}</p>
        ) : items.length === 0 ? (
          <p className="text-ink-soft">{t("organizations.empty")}</p>
        ) : (
          items.map((o) => (
            <Link
              key={o.id}
              to={`/verify/${o.slug}`}
              className="card flex items-center justify-between gap-4 p-4 hover:bg-white"
            >
              <div>
                <p className="font-display text-lg font-semibold">{o.name}</p>
                <p className="text-sm text-ink-faint">
                  {t(`organizations.kind.${o.kind}`, o.kind)}
                  {o.region ? ` · ${o.region}` : ""}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-verified-bg px-2.5 py-1 text-xs font-semibold text-verified-ink">
                {t("organizations.verified")}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
