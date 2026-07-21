import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

import { api } from "../lib/api";

interface ChannelRow {
  channel_type: string;
  value: string;
}

export default function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [kind, setKind] = useState("school");
  const [region, setRegion] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [channels, setChannels] = useState<ChannelRow[]>([
    { channel_type: "phone", value: "" },
  ]);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: () =>
      api.registerOrganization({
        name,
        kind,
        region: region || undefined,
        website: website || undefined,
        description: description || undefined,
        channels: channels.filter((c) => c.value.trim()),
      }),
    onSuccess: (d) => setApiKey(d.api_key),
  });

  if (apiKey) {
    return (
      <div className="container-readable py-12">
        <div className="card p-6">
          <h1 className="font-display text-2xl font-semibold text-verified">
            {t("register.done")}
          </h1>
          <p className="mt-4 text-sm font-semibold text-ink-soft">
            {t("register.apiKeyNote")}
          </p>
          <code className="mt-2 block break-all rounded-lg bg-ink px-4 py-3 text-sand-50">
            {apiKey}
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="container-readable py-12">
      <h1 className="font-display text-3xl font-semibold">
        {t("register.title")}
      </h1>
      <form
        className="card mt-6 space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim().length >= 2) submit.mutate();
        }}
      >
        <Field label={t("register.name")}>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("register.kind")}>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="input"
            >
              {["school", "bank", "microfinance", "church", "association", "media", "other"].map(
                (k) => (
                  <option key={k} value={k}>
                    {t(`organizations.kind.${k}`, k)}
                  </option>
                ),
              )}
            </select>
          </Field>
          <Field label={t("register.region")}>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="input"
            />
          </Field>
        </div>
        <Field label={t("register.website")}>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="input"
            placeholder="https://"
          />
        </Field>
        <Field label={t("register.description")}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="input"
          />
        </Field>

        <div>
          <p className="text-sm font-semibold text-ink-soft">
            {t("register.channelsTitle")}
          </p>
          <p className="mb-2 text-xs text-ink-faint">{t("register.channelsHint")}</p>
          {channels.map((c, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <select
                value={c.channel_type}
                onChange={(e) => {
                  const next = [...channels];
                  next[i] = { ...c, channel_type: e.target.value };
                  setChannels(next);
                }}
                className="input w-36"
              >
                {["phone", "domain", "handle", "page"].map((ct) => (
                  <option key={ct} value={ct}>
                    {t(`organizations.channelType.${ct}`, ct)}
                  </option>
                ))}
              </select>
              <input
                value={c.value}
                onChange={(e) => {
                  const next = [...channels];
                  next[i] = { ...c, value: e.target.value };
                  setChannels(next);
                }}
                className="input flex-1"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setChannels([...channels, { channel_type: "phone", value: "" }])
            }
            className="text-sm font-semibold text-ink-soft underline underline-offset-4"
          >
            + {t("register.addChannel")}
          </button>
        </div>

        <button type="submit" disabled={submit.isPending} className="btn-primary">
          {t("register.submit")}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
