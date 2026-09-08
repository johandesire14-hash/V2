import React from "react";
import { ArrowRight, Twitter, Github, Disc as Discord, ShieldCheck } from "lucide-react";
import { AfhubLogo } from "./AfhubLogo";

interface FooterProps {
  onOpenStudio?: () => void;
  onOpenAiBuilder?: () => void;
  lang: "fr" | "en";
}

export const Footer: React.FC<FooterProps> = ({ onOpenStudio, onOpenAiBuilder, lang }) => {
  const handleOpen = onOpenStudio || onOpenAiBuilder || (() => {});

  return (
    <footer className="w-full bg-[#000000] border-t border-white/[0.08] text-zinc-400">
      
      {/* Bet On Yourself Banner */}
      <div className="border-b border-white/[0.08] bg-gradient-to-b from-[#07080a] to-[#000000] py-20 px-6 sm:px-10">
        <div className="mx-auto max-w-[900px] text-center space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D26A] block">
            {lang === "fr" ? "L'opportunité du numérique en Afrique" : "Bet On Yourself"}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            {lang === "fr" ? "Misez sur vous-même." : "Bet on yourself."}
          </h2>
          <p className="text-base text-zinc-400 max-w-xl mx-auto font-light">
            {lang === "fr"
              ? "Rejoignez des milliers de créateurs, formateurs et entrepreneurs africains qui monétisent leurs savoirs et leurs communautés sur afhub."
              : "Join thousands of creators and communities growing and monetizing their digital businesses on afhub."}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleOpen()}
              className="mansa-btn-green px-10 py-4 text-base cursor-pointer font-bold"
            >
              <span>{lang === "fr" ? "Commencer maintenant" : "Get started"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation Links */}
      <div className="mx-auto max-w-[1240px] px-6 sm:px-10 py-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        
        <div className="col-span-2 space-y-4">
          <AfhubLogo size="md" />
          <p className="text-zinc-500 max-w-xs font-light">
            L'infrastructure de monétisation tout-en-un pour les créateurs de contenu, formateurs et communautés en Afrique et dans le monde.
          </p>
          <div className="text-[11px] text-zinc-600 font-mono">
            © 2026 afhub Inc. Tous droits réservés.
          </div>
        </div>

        <div className="space-y-3">
          <span className="font-bold uppercase tracking-wider text-white text-[11px]">Produits</span>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a></li>
            <li><a href="#home" className="hover:text-white transition-colors">Système d'abonnement</a></li>
            <li><a href="#home" className="hover:text-white transition-colors">Bots Discord & Telegram</a></li>
            <li><a href="#home" className="hover:text-white transition-colors">Livraison de fichiers</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <span className="font-bold uppercase tracking-wider text-white text-[11px]">Ressources</span>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="https://docs.mansa.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">Centre d'aide & FAQ</a></li>
            <li><a href="#home" className="hover:text-white transition-colors">Calculateur de revenus</a></li>
            <li><a href="#home" className="hover:text-white transition-colors">Sécurité 3D Secure</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <span className="font-bold uppercase tracking-wider text-white text-[11px]">Entreprise</span>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="#home" className="hover:text-white transition-colors">À propos</a></li>
            <li><a href="#home" className="hover:text-white transition-colors">Conditions Générales</a></li>
            <li><a href="#home" className="hover:text-white transition-colors">Politique de Confidentialité</a></li>
            <li><a href="#home" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};
