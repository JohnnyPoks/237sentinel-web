import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { api } from "../lib/api";

export default function VerifyProfile() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: org, isLoading, isError } = useQuery({
    queryKey: ["org", slug],
    queryFn: () => api.getOrganization(slug!),
    enabled: !!slug,
  });

  if (isLoading)
    return (
      <div className="container-readable py-16 text-ink-soft">
        {t("common.loading")}
      </div>
    );
  if (isError || !org)
    return (
      <div className="container-readable py-16">
        <p>{t("organizations.empty")}</p>
        <Link to="/organizations" className="btn-ghost mt-4">
          {t("common.back")}
        </Link>
      </div>
    );

  return (
    <div className="container-readable py-10">
      <div className="card overflow-hidden">
        <div className="bg-verified px-6 py-8 text-white">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
            {t("organizations.verified")}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold">{org.name}</h1>
          <p className="mt-1 opacity-90">
            {t(`organizations.kind.${org.kind}`, org.kind)}
            {org.region ? ` · ${org.region}` : ""}
          </p>
        </div>
        <div className="p-6">
          {org.description && (
            <p className="text-lg leading-relaxed text-ink-soft">
              {org.description}
            </p>
          )}
          <h2 className="mt-6 text-xs font-bold uppercase tracking-wide text-ink-faint">
            {t("organizations.channels")}
          </h2>
          {org.channels.length === 0 ? (
            <p className="mt-2 text-ink-soft">{t("organizations.noChannels")}</p>
          ) : (
            <ul className="mt-2 divide-y divide-sand-200">
              {org.channels.map((c, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{c.value}</p>
                    {c.label && (
                      <p className="text-xs text-ink-faint">{c.label}</p>
                    )}
                  </div>
                  <span className="rounded bg-sand-100 px-2 py-0.5 text-xs font-semibold text-ink-soft">
                    {t(`organizations.channelType.${c.channel_type}`, c.channel_type)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-6"
            >
              {org.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
