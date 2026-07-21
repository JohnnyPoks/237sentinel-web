import { useState } from "react";
import { useTranslation } from "react-i18next";

import { API_BASE_URL } from "../config";

async function adminGet(path: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/admin${path}`, {
    headers: { "X-Admin-Token": token },
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}
async function adminPost(path: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/admin${path}`, {
    method: "POST",
    headers: { "X-Admin-Token": token },
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

interface PendingOrg {
  id: string;
  name: string;
  kind: string;
  region?: string;
}
interface PendingReport {
  id: string;
  category: string;
  body: string;
}

export default function Admin() {
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [orgs, setOrgs] = useState<PendingOrg[]>([]);
  const [reports, setReports] = useState<PendingReport[]>([]);

  async function load(tok: string) {
    try {
      const [s, o, r] = await Promise.all([
        adminGet("/stats", tok),
        adminGet("/organizations/pending", tok),
        adminGet("/reports", tok),
      ]);
      setStats(s);
      setOrgs(o.items ?? []);
      setReports(r.items ?? []);
      setAuthed(true);
      setError(false);
    } catch {
      setError(true);
    }
  }

  if (!authed) {
    return (
      <div className="container-readable py-16">
        <div className="card p-6">
          <h1 className="font-display text-2xl font-semibold">
            {t("admin.title")}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">{t("admin.tokenPrompt")}</p>
          {error && (
            <p className="mt-2 text-sm font-semibold text-altered">
              {t("auth.invalid")}
            </p>
          )}
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="input mt-4"
          />
          <button onClick={() => load(token)} className="btn-primary mt-4">
            {t("auth.signIn")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10">
      <h1 className="font-display text-3xl font-semibold">{t("admin.title")}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="card p-4">
            <p className="text-xs text-ink-faint">{k}</p>
            <p className="font-display text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">
        {t("admin.pendingOrgs")}
      </h2>
      <ul className="mt-3 grid gap-2">
        {orgs.length === 0 ? (
          <p className="text-ink-soft">—</p>
        ) : (
          orgs.map((o) => (
            <li
              key={o.id}
              className="card flex items-center justify-between p-4"
            >
              <span>
                <span className="font-medium">{o.name}</span>{" "}
                <span className="text-xs text-ink-faint">{o.kind}</span>
              </span>
              <button
                onClick={async () => {
                  await adminPost(`/organizations/${o.id}/approve`, token);
                  setOrgs((prev) => prev.filter((x) => x.id !== o.id));
                }}
                className="rounded-lg bg-verified px-3 py-1.5 text-sm font-semibold text-white"
              >
                {t("admin.approve")}
              </button>
            </li>
          ))
        )}
      </ul>

      <h2 className="mt-10 font-display text-xl font-semibold">
        {t("admin.pendingReports")}
      </h2>
      <ul className="mt-3 grid gap-2">
        {reports.length === 0 ? (
          <p className="text-ink-soft">—</p>
        ) : (
          reports.map((r) => (
            <li key={r.id} className="card p-4">
              <p className="text-xs text-ink-faint">{r.category}</p>
              <p className="mt-1">{r.body}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={async () => {
                    await adminPost(
                      `/reports/${r.id}/moderate?action=approve`,
                      token,
                    );
                    setReports((prev) => prev.filter((x) => x.id !== r.id));
                  }}
                  className="rounded-lg bg-verified px-3 py-1.5 text-sm font-semibold text-white"
                >
                  {t("admin.approve")}
                </button>
                <button
                  onClick={async () => {
                    await adminPost(
                      `/reports/${r.id}/moderate?action=reject`,
                      token,
                    );
                    setReports((prev) => prev.filter((x) => x.id !== r.id));
                  }}
                  className="rounded-lg bg-altered px-3 py-1.5 text-sm font-semibold text-white"
                >
                  {t("admin.reject")}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
