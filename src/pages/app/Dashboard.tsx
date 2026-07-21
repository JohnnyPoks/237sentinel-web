import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../lib/api";

const KEY_STORE = "sentinel_org_key";

function useOrgKey() {
  const [key, setKey] = useState<string>(
    () => localStorage.getItem(KEY_STORE) ?? "",
  );
  return {
    key,
    save: (k: string) => {
      localStorage.setItem(KEY_STORE, k);
      setKey(k);
    },
    clear: () => {
      localStorage.removeItem(KEY_STORE);
      setKey("");
    },
  };
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { key, save, clear } = useOrgKey();
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState<"alerts" | "channels" | "keys">("alerts");

  const dash = useQuery({
    queryKey: ["orgDash", key],
    queryFn: () => api.orgDashboard(key),
    enabled: !!key,
    retry: false,
  });
  const alerts = useQuery({
    queryKey: ["orgAlerts", key],
    queryFn: () => api.orgAlerts(key),
    enabled: !!key && tab === "alerts",
  });
  const channels = useQuery({
    queryKey: ["orgChannels", key],
    queryFn: () => api.orgChannels(key),
    enabled: !!key && tab === "channels",
  });
  const keys = useQuery({
    queryKey: ["orgKeys", key],
    queryFn: () => api.orgApiKeys(key),
    enabled: !!key && tab === "keys",
  });

  if (!key || dash.isError) {
    return (
      <div className="container-readable py-16">
        <div className="card p-6">
          <h1 className="font-display text-2xl font-semibold">
            {t("auth.signIn")}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">{t("auth.signInHint")}</p>
          {dash.isError && (
            <p className="mt-2 text-sm font-semibold text-altered">
              {t("auth.invalid")}
            </p>
          )}
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("auth.apiKeyPlaceholder")}
            className="input mt-4"
          />
          <button
            onClick={() => draft && save(draft.trim())}
            className="btn-primary mt-4"
          >
            {t("auth.signIn")}
          </button>
        </div>
      </div>
    );
  }

  const d = (dash.data ?? {}) as Record<string, number>;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">
          {t("dashboard.title")}
        </h1>
        <button onClick={clear} className="btn-ghost">
          {t("auth.signOut")}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label={t("dashboard.alertsNew")} value={d.alerts_new} accent />
        <Stat label={t("dashboard.alertsTotal")} value={d.alerts_total} />
        <Stat label={t("dashboard.queries")} value={d.verification_queries} />
      </div>

      <div className="mt-8 flex gap-2 border-b border-sand-200">
        {(["alerts", "channels", "keys"] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
              tab === tb
                ? "border-ink text-ink"
                : "border-transparent text-ink-faint hover:text-ink"
            }`}
          >
            {t(`dashboard.${tb === "keys" ? "apiKeys" : tb}`)}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "alerts" && (
          <List
            loading={alerts.isLoading}
            items={alerts.data?.items ?? []}
            empty={t("dashboard.noAlerts")}
            render={(a) => (
              <div>
                <p className="font-medium">{String(a.reason)}</p>
                <p className="text-xs text-ink-faint">
                  {String(a.severity)} · {String(a.status)}
                </p>
              </div>
            )}
          />
        )}
        {tab === "channels" && (
          <List
            loading={channels.isLoading}
            items={channels.data?.items ?? []}
            empty="—"
            render={(c) => (
              <div className="flex justify-between">
                <span className="font-medium">{String(c.value)}</span>
                <span className="text-xs text-ink-faint">
                  {String(c.channel_type)}
                </span>
              </div>
            )}
          />
        )}
        {tab === "keys" && (
          <List
            loading={keys.isLoading}
            items={keys.data?.items ?? []}
            empty="—"
            render={(k) => (
              <div className="flex justify-between">
                <span className="font-mono text-sm">{String(k.prefix)}…</span>
                <span className="text-xs text-ink-faint">
                  {k.is_active ? "active" : "revoked"}
                </span>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value?: number;
  accent?: boolean;
}) {
  return (
    <div className={`card p-5 ${accent ? "border-unconfirmed/40" : ""}`}>
      <p className="text-sm text-ink-faint">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value ?? 0}</p>
    </div>
  );
}

function List({
  loading,
  items,
  empty,
  render,
}: {
  loading: boolean;
  items: Record<string, unknown>[];
  empty: string;
  render: (item: Record<string, unknown>) => ReactNode;
}) {
  const { t } = useTranslation();
  if (loading) return <p className="text-ink-soft">{t("common.loading")}</p>;
  if (items.length === 0) return <p className="text-ink-soft">{empty}</p>;
  return (
    <ul className="grid gap-2">
      {items.map((it, i) => (
        <li key={i} className="card p-4">
          {render(it)}
        </li>
      ))}
    </ul>
  );
}
