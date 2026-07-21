import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../lib/api";
import type { CommunityReport } from "../lib/types";

const CATEGORIES = [
  "payment",
  "investment",
  "recruitment",
  "prize",
  "phishing",
  "announcement",
  "other",
];

function ReportCard({ r }: { r: CommunityReport }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [count, setCount] = useState(r.confirmations);
  const confirm = useMutation({
    mutationFn: () => api.confirmReport(r.id),
    onSuccess: (d) => {
      setCount(d.confirmations);
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
  return (
    <li className="card p-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
          {r.category}
        </span>
        {r.region && <span className="text-xs text-ink-faint">{r.region}</span>}
      </div>
      <p className="mt-2 leading-relaxed">{r.body}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-ink-faint">
          {t("community.confirmations", { count })}
        </span>
        <button
          onClick={() => confirm.mutate()}
          disabled={confirm.isPending}
          className="rounded-lg border border-sand-300 px-3 py-1.5 text-sm font-semibold hover:bg-sand-100"
        >
          {t("community.meToo")}
        </button>
      </div>
    </li>
  );
}

export default function Community() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("payment");
  const [body, setBody] = useState("");
  const [region, setRegion] = useState("");
  const [posted, setPosted] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => api.listReports(),
  });

  const create = useMutation({
    mutationFn: () =>
      api.createReport({ category, body, region: region || undefined }),
    onSuccess: () => {
      setPosted(true);
      setBody("");
    },
  });

  const reports = data?.items ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl font-semibold">
        {t("community.title")}
      </h1>
      <p className="mt-2 text-ink-soft">{t("community.subtitle")}</p>

      {/* Post form */}
      <form
        className="card mt-6 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (body.trim().length >= 5) create.mutate();
        }}
      >
        <h2 className="font-display text-lg font-semibold">
          {t("community.post")}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-ink-soft">
              {t("community.category")}
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-ink-soft">
              {t("community.region")}
            </span>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2"
              placeholder="Centre, Littoral…"
            />
          </label>
        </div>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-semibold text-ink-soft">
            {t("community.body")}
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder={t("community.bodyPlaceholder")}
            className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2"
          />
        </label>
        <p className="mt-2 text-xs text-ink-faint">
          {t("community.moderationNote")}
        </p>
        {posted && (
          <p className="mt-2 text-sm font-semibold text-verified">
            {t("community.posted")}
          </p>
        )}
        <button
          type="submit"
          disabled={create.isPending || body.trim().length < 5}
          className="btn-primary mt-3"
        >
          {t("community.submit")}
        </button>
      </form>

      {/* Feed */}
      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink-soft">{t("common.loading")}</p>
        ) : reports.length === 0 ? (
          <p className="text-ink-soft">{t("community.empty")}</p>
        ) : (
          <ul className="grid gap-3">
            {reports.map((r) => (
              <ReportCard key={r.id} r={r} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
