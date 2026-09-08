import React from "react";
import { ArrowRight, Send, Disc as DiscordIcon, BookOpen, ShieldCheck, Zap } from "lucide-react";

interface HeroSectionProps {
  onOpenStudio: (category?: string) => void;
  lang: "fr" | "en";
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenStudio, lang }) => {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#090a0f] px-6 sm:px-10 pt-16 pb-20">
      <div className="relative z-10 mx-auto flex w-full max-w-[960px] flex-col items-center text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12] max-w-3xl">
          {lang === "fr"
            ? "Monétisez vos accès privés & contenus en toute simplicité"
            : "Monetize private communities & digital products with ease"}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
          {lang === "fr"
            ? "Créez votre page de vente, automatisez l'accès à vos canaux Telegram ou Discord et encaissez par Mobile Money et Carte Bancaire."
            : "Create your storefront, automate Telegram and Discord invitations, and collect instant payments effortlessly."}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <button
            onClick={() => onOpenStudio()}
            className="mansa-btn-green w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base cursor-pointer transition-all duration-200 hover:opacity-90 font-bold flex items-center justify-center gap-2"
          >
            <span>{lang === "fr" ? "Lancer mon produit" : "Launch my product"}</span>
            <ArrowRight className="size-4" />
          </button>

          <a
            href="#categories"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white text-sm font-medium transition-all text-center"
          >
            {lang === "fr" ? "Découvrir les modèles" : "Browse templates"}
          </a>
        </div>

        {/* Clean, calm stats row */}
        <div className="mt-16 w-full max-w-2xl grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.06]">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">100%</div>
            <div className="text-xs text-zinc-400 mt-1">Automatisation des accès</div>
          </div>

          <div className="text-center border-x border-white/[0.06]">
            <div className="text-xl sm:text-2xl font-bold text-[#00D26A] font-mono">Mobile Money</div>
            <div className="text-xs text-zinc-400 mt-1">Wave, Orange, MTN & CB</div>
          </div>

          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">Immédiat</div>
            <div className="text-xs text-zinc-400 mt-1">Revenus versés en direct</div>
          </div>
        </div>

      </div>
    </section>
  );
};

