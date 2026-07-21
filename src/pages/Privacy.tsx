import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <div className="container-readable py-12">
      <h1 className="font-display text-3xl font-semibold">{t("privacy.title")}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        {t("privacy.body")}
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold">
        {t("privacy.mediaTitle")}
      </h2>
      <p className="mt-2 leading-relaxed text-ink-soft">{t("privacy.mediaBody")}</p>
      <p className="mt-8 rounded-xl bg-sand-100 p-4 text-sm text-ink-soft">
        {t("privacy.lawBody")}
      </p>
    </div>
  );
}
