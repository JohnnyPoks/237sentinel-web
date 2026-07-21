import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_NAME, TELEGRAM_BOT_URL } from "../config";

function LangToggle() {
  const { i18n } = useTranslation();
  const next = i18n.language?.startsWith("fr") ? "en" : "fr";
  return (
    <button
      onClick={() => i18n.changeLanguage(next)}
      className="rounded-lg border border-sand-300 px-3 py-1.5 text-sm font-semibold text-ink-soft hover:bg-sand-100"
      aria-label="Change language"
    >
      {next === "en" ? "English" : "Français"}
    </button>
  );
}

export default function Layout() {
  const { t } = useTranslation();
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? "text-ink" : "text-ink-faint hover:text-ink"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sand-50"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sand-50 font-display text-lg leading-none"
            >
              2
            </span>
            <span className="font-display text-lg font-semibold">{APP_NAME}</span>
          </Link>
          <nav className="hidden items-center gap-5 sm:flex" aria-label="Primary">
            <NavLink to="/check" className={navClass}>
              {t("nav.check")}
            </NavLink>
            <NavLink to="/community" className={navClass}>
              {t("nav.community")}
            </NavLink>
            <NavLink to="/organizations" className={navClass}>
              {t("nav.organizations")}
            </NavLink>
            <NavLink to="/for-organizations" className={navClass}>
              {t("nav.forOrganizations")}
            </NavLink>
          </nav>
          <LangToggle />
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-sand-200 bg-sand-100">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display">
            {APP_NAME} — {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/about" className="hover:text-ink">
              {t("footer.about")}
            </Link>
            <Link to="/privacy" className="hover:text-ink">
              {t("footer.privacy")}
            </Link>
            <Link to="/api-docs" className="hover:text-ink">
              {t("footer.api")}
            </Link>
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              Telegram
            </a>
            <span className="text-ink-faint">{t("footer.report")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
