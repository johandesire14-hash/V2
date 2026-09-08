import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  business: string;
  avatar: string;
  rating: number;
  revenue: string;
  timeframe: string;
  growth: string;
  comment: string;
  category: "digital" | "course" | "ebook" | "membership";
}

interface SocialProofSectionProps {
  lang?: "fr" | "en";
  onOpenAiBuilder?: () => void;
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = ({
  lang = "fr",
  onOpenAiBuilder,
}) => {
  const [testimonials] = useState<Testimonial[]>([]);

  return (
    <section
      id="testimonials"
      className="w-full bg-[#0c0d12] py-16 px-6 sm:px-10 border-t border-white/[0.04]"
    >
      <div className="mx-auto max-w-[960px] space-y-6">
        {/* Header Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === "fr" ? "Retours d'expérience créateurs" : "Creator Stories"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {lang === "fr"
              ? "Avis et retours vérifiés de la communauté Mansa."
              : "Verified reviews and insights from the Mansa community."}
          </p>
        </div>

        {/* Real Empty State */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#12141c] p-8 text-center flex flex-col items-center justify-center">
          <div className="size-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 mb-3">
            <MessageSquarePlus className="size-6 text-[#00D26A]" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">
            {lang === "fr" ? "Aucun avis publié pour l'instant" : "No testimonials submitted yet"}
          </h3>
          <p className="text-xs text-zinc-400 max-w-md">
            {lang === "fr"
              ? "Les avis vérifiés laissés par vos clients et partenaires apparaîtront automatiquement dans cette section."
              : "Verified reviews from your customers and partners will be displayed here."}
          </p>
        </div>
      </div>
    </section>
  );
};

