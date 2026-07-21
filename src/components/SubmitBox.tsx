import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { api, warmUp } from "../lib/api";
import { useWarmState } from "../lib/useWarmState";

const MAX_MB = 25;

export default function SubmitBox({ autofocus = false }: { autofocus?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const warmState = useWarmState();
  // Note: the initial warm-up ping fires from Layout (mounted on every page,
  // before the user even reaches this component). The calls below are extra
  // signals of intent, throttled by warmUp() itself.

  function pickFile(f: File | null) {
    warmUp(); // choosing a file is a strong signal of intent
    setError(null);
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(t("check.tooLarge"));
      return;
    }
    setFile(f);
  }

  async function submit() {
    setError(null);
    if (!file && !text.trim()) {
      setError(t("check.empty"));
      return;
    }
    setBusy(true);
    try {
      const result = file
        ? await api.analyzeFile(file, consent)
        : await api.analyzeText(text.trim(), consent);
      // Pass the full result via router state; URL keeps the id shareable.
      navigate(`/result/${result.id}`, { state: { result } });
    } catch (e) {
      setError(t("check.error"));
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-4 sm:p-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          warmUp();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`rounded-xl border-2 border-dashed transition-colors ${
          dragging ? "border-ink bg-sand-100" : "border-sand-300 bg-sand-50"
        }`}
      >
        <label htmlFor="submit-text" className="sr-only">
          {t("check.placeholder")}
        </label>
        <textarea
          id="submit-text"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autofocus}
          value={text}
          onFocus={() => warmUp()}
          onChange={(e) => setText(e.target.value)}
          onPaste={(e) => {
            const f = e.clipboardData.files?.[0];
            if (f) {
              e.preventDefault();
              pickFile(f);
            }
          }}
          rows={4}
          placeholder={t("check.placeholder")}
          className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-lg outline-none placeholder:text-ink-faint"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm font-semibold text-ink-soft underline decoration-sand-400 underline-offset-4 hover:text-ink"
          >
            {t("check.browse")}
          </button>
          <span className="text-xs text-ink-faint">{t("check.dropHint")}</span>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*,audio/*,video/*,application/pdf"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {file && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-sand-100 px-3 py-2 text-sm">
          <span className="truncate font-medium">
            {t("check.fileSelected")}: {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            className="ml-3 shrink-0 font-semibold text-ink-soft hover:text-altered"
          >
            {t("check.remove")}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-altered">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="h-4 w-4 rounded border-sand-400"
          />
          {t("check.consent")}
        </label>
        <button
          onClick={submit}
          disabled={busy}
          className="btn-primary w-full sm:w-auto"
        >
          {busy ? t("check.checking") : t("check.submit")}
        </button>
      </div>

      {busy && warmState !== "ready" && (
        <p className="mt-3 text-center text-sm text-ink-faint">
          {t("common.patience")}
        </p>
      )}
    </div>
  );
}
