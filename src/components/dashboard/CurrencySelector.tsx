import React, { useState, useRef, useEffect } from "react";
import {
  CurrencyCode,
  SUPPORTED_CURRENCIES,
  CurrencyConfig,
  setStoredCurrency,
} from "../../utils/currency";
import { DollarSign, ChevronDown, Check, Coins, Globe, ArrowRight } from "lucide-react";

interface CurrencySelectorProps {
  currentCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  lang?: "fr" | "en";
  variant?: "header" | "pill" | "inline";
  showRatePreview?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onSelectCurrency,
  lang = "fr",
  variant = "header",
  showRatePreview = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig = SUPPORTED_CURRENCIES[currentCurrency] || SUPPORTED_CURRENCIES.USD;
  const currenciesList = Object.values(SUPPORTED_CURRENCIES);

  const filteredCurrencies = currenciesList.filter(
    (c) =>
      c.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.nameFr.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchFilter.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button based on variant */}
      {variant === "header" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shrink-0 min-h-[36px] ${
            isOpen
              ? "border-[#00D26A] bg-[#00D26A]/10 text-white"
              : "border-white/10 bg-[#16171b] text-zinc-300 hover:border-white/20 hover:text-white"
          }`}
          title={lang === "fr" ? "Changer la devise d'affichage" : "Change display currency"}
        >
          <span className="text-sm leading-none">{activeConfig.flag}</span>
          <span className="font-mono font-bold text-xs">{activeConfig.code}</span>
          <span className="hidden md:inline text-[10px] text-zinc-400 font-normal">({activeConfig.symbol})</span>
          <ChevronDown className={`size-3 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "pill" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shrink-0 ${
            isOpen
              ? "border-[#00D26A] bg-[#00D26A]/15 text-[#00D26A]"
              : "border-white/10 bg-[#171920] text-zinc-300 hover:bg-[#1f222b] hover:border-white/20"
          }`}
        >
          <Coins className="size-3.5 text-[#00D26A]" />
          <span className="text-sm leading-none">{activeConfig.flag}</span>
          <span className="font-mono font-bold text-white">{activeConfig.code}</span>
          <span className="hidden xs:inline text-zinc-400 font-mono text-[11px]">· {activeConfig.symbol}</span>
          <ChevronDown className={`size-3 text-zinc-400 ml-0.5 sm:ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "inline" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
        >
          <span>{activeConfig.flag}</span>
          <span className="font-mono font-bold text-white">{activeConfig.code}</span>
          <ChevronDown className={`size-3 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-white/10 bg-[#131418]/95 backdrop-blur-xl p-3 shadow-2xl z-50 space-y-2.5 animate-in fade-in zoom-in-95 duration-100">
          {/* Header & Quick search */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Globe className="size-3.5 text-[#00D26A]" />
              <span>{lang === "fr" ? "Sélectionner une Devise" : "Select Currency"}</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Taux en temps réel</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={lang === "fr" ? "Rechercher (USD, EUR, XAF, Franc...)" : "Search currency..."}
              className="w-full rounded-xl border border-white/10 bg-[#181a20] px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00D26A]"
              autoFocus
            />
          </div>

          {/* Currencies list */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredCurrencies.map((curr) => {
              const isSelected = curr.code === currentCurrency;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setStoredCurrency(curr.code);
                    onSelectCurrency(curr.code);
                    setIsOpen(false);
                    setSearchFilter("");
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#00D26A]/15 border border-[#00D26A]/40 text-white"
                      : "hover:bg-white/5 border border-transparent text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{curr.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-white">{curr.code}</span>
                        <span className="text-[10px] font-mono text-zinc-400">({curr.symbol})</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {lang === "fr" ? curr.nameFr : curr.nameEn}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {curr.code !== "USD" && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        1$ = {curr.rateToUSD >= 100 ? curr.rateToUSD.toFixed(0) : curr.rateToUSD.toFixed(2)} {curr.symbol}
                      </span>
                    )}
                    {isSelected && (
                      <div className="flex size-4 items-center justify-center rounded-full bg-[#00D26A] text-black">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredCurrencies.length === 0 && (
              <div className="py-4 text-center text-xs text-zinc-500">
                {lang === "fr" ? "Aucune devise correspondante" : "No currency found"}
              </div>
            )}
          </div>

          {/* Quick Notice Footer */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>Base de calcul : Stripe Connect</span>
            <span className="text-[#00D26A]">Taux garantis</span>
          </div>
        </div>
      )}
    </div>
  );
};
