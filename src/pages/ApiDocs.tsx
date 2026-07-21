import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config";

export default function ApiDocs() {
  const { t } = useTranslation();
  return (
    <div className="container-readable py-12">
      <h1 className="font-display text-3xl font-semibold">{t("apiDocs.title")}</h1>
      <p className="mt-4 text-lg text-ink-soft">{t("apiDocs.body")}</p>
      <a
        href={`${API_BASE_URL}/api/v1/docs`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-6"
      >
        {t("apiDocs.open")}
      </a>
    </div>
  );
}
