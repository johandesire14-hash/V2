import React, { useState, useEffect } from "react";
import { Search, Star, ShieldCheck, ArrowRight, Sparkles, Heart } from "lucide-react";
import { MarketplaceItem } from "../types";
import { MarketplaceCardSkeleton } from "./common/Skeleton";
import { CURATED_MARKETPLACE_PRODUCTS } from "../data/marketplaceData";
import { CountryFlag } from "./common/CountryFlag";
import {
  toggleUserFavorite,
  subscribeToUserFavorites,
} from "../services/dbService";

interface MarketplaceSectionProps {
  onSelectProduct: (item: MarketplaceItem) => void;
  onOpenStudio?: () => void;
  onOpenAiBuilder?: (prompt?: string, category?: string) => void;
  lang: "fr" | "en";
  user?: any;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  onSelectProduct,
  onOpenAiBuilder,
  lang,
  user,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const userId = user?.uid || user?.id || "";

  useEffect(() => {
    const unsub = subscribeToUserFavorites(userId, (favs) => {
      const ids = new Set(favs.map((f) => f.productId || f.id));
      setFavoriteIds(ids);
    });
    return () => unsub();
  }, [userId]);

  const handleToggleFavorite = async (e: React.MouseEvent, prod: MarketplaceItem) => {
    e.stopPropagation();
    const res = await toggleUserFavorite(userId, prod);
    setToastMessage(
      res.isFavorited
        ? `« ${prod.title} » ajouté à vos favoris`
        : `« ${prod.title} » retiré de vos favoris`
    );
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredProducts = CURATED_MARKETPLACE_PRODUCTS.filter((prod) => {
    const matchesCat =
      selectedCategory === "all" ||
      prod.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <section id="marketplace" className="w-full bg-[#090a0f] py-16 border-t border-white/[0.04] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#12141a] px-4 py-3 text-xs font-semibold text-white shadow-2xl">
          <Heart className="size-4 fill-rose-500 text-rose-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto max-w-[1140px] px-6 sm:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 mb-2">
              <Sparkles className="size-3" />
              <span>Marketplace & Offres Vérifiées</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explorer les meilleures offres
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Rejoignez des canaux Telegram VIP, achetez des formations et logiciels certifiés par les meilleurs créateurs.
            </p>
          </div>

          <div className="relative flex items-center">
            <Search className="absolute left-3.5 size-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher un produit, créateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-white/10 bg-[#121318] pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#00D26A] focus:ring-1 focus:ring-[#00D26A] outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-6">
          {[
            { id: "all", label: "Toutes les offres" },
            { id: "trading", label: "Trading & Crypto" },
            { id: "sports", label: "Paris Sportifs" },
            { id: "courses", label: "Formations" },
            { id: "software", label: "Logiciels & SaaS" },
            { id: "community", label: "Communautés VIP" },
            { id: "reselling", label: "Achat-Revente" },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (selectedCategory !== cat.id) {
                    setSelectedCategory(cat.id);
                  }
                }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-black shadow-md"
                    : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton View */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <MarketplaceCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-[#12141a] p-8 space-y-3">
            <p className="text-base font-bold text-white">
              Aucune offre trouvée
            </p>
            <p className="text-xs text-zinc-400">
              Essayez de modifier votre recherche ou sélectionnez une autre catégorie.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer inline-block mt-2"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          /* Product Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const isFav = favoriteIds.has(prod.id);

              return (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#12141a]/90 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-[#161822] cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={prod.creatorAvatar}
                            alt={prod.creator}
                            className="size-11 rounded-full object-cover border border-white/10"
                          />
                          {prod.countryCode && (
                            <div className="absolute -bottom-1 -right-1 rounded-[2px] overflow-hidden shadow-xs border border-[#12141a]">
                              <CountryFlag countryCode={prod.countryCode} className="w-4 h-3 object-cover block" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                              {prod.title}
                            </span>
                            {prod.verified && (
                              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                            <span>par {prod.creator}</span>
                            {prod.countryCode && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-300 bg-white/5 px-1.5 py-0.2 rounded border border-white/5">
                                <CountryFlag countryCode={prod.countryCode} className="w-3 h-2 rounded-[1px] object-cover" />
                                {prod.countryCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, prod)}
                        title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        className={`size-8 rounded-full border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                          isFav
                            ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                            : "bg-white/5 border-white/10 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20"
                        }`}
                      >
                        <Heart
                          className={`size-4 transition-all ${
                            isFav ? "fill-rose-500 text-rose-500 scale-110" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300 uppercase tracking-wide">
                        {prod.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span>{prod.rating}</span>
                        <span className="text-zinc-500 font-normal">
                          ({prod.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                      {prod.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prod.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Tarif</span>
                      <span className="text-sm font-extrabold text-white truncate max-w-[130px] block">
                        {prod.priceMonthly}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenAiBuilder && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAiBuilder(prod.title, prod.category);
                          }}
                          className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sparkles className="size-3 text-emerald-400" />
                          <span>Cloner</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="mansa-btn-green px-3.5 py-1.5 text-xs font-bold text-black flex items-center gap-1 cursor-pointer rounded-xl"
                      >
                        <span>Voir l'offre</span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
