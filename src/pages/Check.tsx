import { useTranslation } from "react-i18next";

import SubmitBox from "../components/SubmitBox";

export default function Check() {
  const { t } = useTranslation();
  return (
    <div className="container-readable py-10">
      <h1 className="font-display text-3xl font-semibold">{t("check.title")}</h1>
      <p className="mt-2 text-ink-soft">{t("check.subtitle")}</p>
      <div className="mt-6">
        <SubmitBox autofocus />
      </div>
    </div>
  );
}
