import React from "react";
import { Globe, Layers } from "lucide-react";
import { AfhubLogo } from "./AfhubLogo";
import { CurrencyCode } from "../utils/currency";
import { CurrencySelector } from "./dashboard/CurrencySelector";

interface HeaderProps {
  onOpenStudio?: () => void;
  onOpenMarketplace: () => void;
  onOpenDocs: () => void;
  onOpenLogin: () => void;
  onOpenDemo?: () => void;
  lang: "fr" | "en";
  setLang: (lang: "fr" | "en") => void;
  currency?: CurrencyCode;
  onCurrencyChange?: (currency: CurrencyCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStudio,
  onOpenMarketplace,
  onOpenDocs,
  onOpenLogin,
  onOpenDemo,
  lang,
  setLang,
  currency = "USD",
  onCurrencyChange,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#000000]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-6 sm:px-10">
        
        {/* afhub Logo */}
        <div className="flex items-center gap-8">
          <a
            href="#home"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            aria-label="afhub Accueil"
          >
            <AfhubLogo size="md" />
          </a>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-zinc-300">
            <button
              onClick={onOpenMarketplace}
              className="hover:text-white transition-colors cursor-pointer hidden md:inline-block"
            >
              {lang === "fr" ? "Explorer" : "Explore"}
            </button>
            <a
              href="#faq"
              className="hover:text-white transition-colors hidden sm:inline-block"
            >
              {lang === "fr" ? "FAQ" : "FAQ"}
            </a>
            <button
              onClick={onOpenLogin}
              className="hover:text-white transition-colors cursor-pointer font-semibold"
            >
              {lang === "fr" ? "Se connecter" : "Sign in"}
            </button>
          </nav>

          {/* Quick Demo Exploration Button */}
          {onOpenDemo && (
            <button
              onClick={onOpenDemo}
              className="mansa-btn-green px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm hidden sm:flex"
              title="Tester immédiatement l'application en mode Démo"
            >
              <span>{lang === "fr" ? "Mode Démo" : "Demo Mode"}</span>
            </button>
          )}

          {/* Global Currency Selector */}
          {onCurrencyChange && (
            <div className="hidden sm:block">
              <CurrencySelector
                currentCurrency={currency}
                onSelectCurrency={onCurrencyChange}
                lang={lang}
                variant="header"
              />
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="size-3.5 text-zinc-400" />
            <span>{lang.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
