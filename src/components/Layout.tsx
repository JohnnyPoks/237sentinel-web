import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_NAME, TELEGRAM_BOT_URL } from "../config";
import ShieldMark from "./ShieldMark";

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

const NAV = [
  { to: "/check", key: "nav.check" },
  { to: "/community", key: "nav.community" },
  { to: "/organizations", key: "nav.organizations" },
  { to: "/for-organizations", key: "nav.forOrganizations" },
  { to: "/about", key: "nav.about" },
];

export default function Layout() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sand-50"
            >
              <ShieldMark className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">{APP_NAME}</span>
          </Link>

          <nav className="hidden items-center gap-5 sm:flex" aria-label="Primary">
            {NAV.slice(0, 4).map((n) => (
              <NavLink key={n.to} to={n.to} className={navClass}>
                {t(n.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LangToggle />
            {/* Mobile menu button — the primary target is a phone. */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={t("nav.menu")}
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-lg border border-sand-300 text-ink sm:hidden"
            >
              <span aria-hidden className="text-lg leading-none">
                {open ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <nav
            className="border-t border-sand-200 bg-sand-50 sm:hidden"
            aria-label="Mobile"
          >
            <ul className="mx-auto flex w-full max-w-5xl flex-col px-5 py-2">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-3 text-base font-semibold ${
                        isActive || location.pathname === n.to
                          ? "bg-sand-100 text-ink"
                          : "text-ink-soft hover:bg-sand-100"
                      }`
                    }
                  >
                    {t(n.key)}
                  </NavLink>
                </li>
              ))}
              <li>
                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-ink-soft hover:bg-sand-100"
                >
                  Telegram →
                </a>
              </li>
            </ul>
          </nav>
        )}
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
