import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container-readable py-20 text-center">
      <p className="font-display text-6xl font-semibold text-ink-faint">404</p>
      <Link to="/" className="btn-primary mt-6">
        {t("common.back")}
      </Link>
    </div>
  );
}
