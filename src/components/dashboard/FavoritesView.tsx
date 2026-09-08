import React, { useState, useEffect } from "react";
import {
  Heart,
  Search,
  Star,
  ShieldCheck,
  ExternalLink,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Copy,
  Layers,
  Flame,
  Globe,
  Tag,
  Zap,
} from "lucide-react";
import { FavoriteItem, MarketplaceItem } from "../../types";
import { ModalOverlay } from "../common/ModalOverlay";
import {
  getUserFavorites,
  removeUserFavorite,
  subscribeToUserFavorites,
} from "../../services/dbService";

interface FavoritesViewProps {
  lang?: "fr" | "en";
  user?: any;
  onNavigateToMarketplace?: () => void;
  onNavigateToDiscover?: () => void;
  onOpenProductModal?: (item: MarketplaceItem) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  lang = "fr",
  user,
  onNavigateToMarketplace,
  onNavigateToDiscover,
  onOpenProductModal,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "price">("recent");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedProductModal, setSelectedProductModal] = useState<FavoriteItem | null>(null);

  const userId = user?.uid || user?.id || "";

  useEffect(() => {
    const unsub = subscribeToUserFavorites(userId, (favs) => {
      setFavorites(favs);
    });
    return () => unsub();
  }, [userId]);

  const handleRemoveFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    await removeUserFavorite(userId, productId);
  };

  const handleCopyLink = (e: React.MouseEvent, fav: FavoriteItem) => {
    e.stopPropagation();
    const url = fav.storeUrl
      ? `https://${fav.storeUrl.replace(/^https?:\/\//, "")}`
      : `${window.location.origin}/#marketplace`;
    navigator.clipboard.writeText(url);
    setCopiedId(fav.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: "all", label: lang === "fr" ? "Tous les favoris" : "All Favorites" },
    { id: "trading", label: "Trading & Finance" },
    { id: "sports", label: lang === "fr" ? "Paris Sportifs" : "Sports" },
    { id: "courses", label: lang === "fr" ? "Formations" : "Courses" },
    { id: "software", label: lang === "fr" ? "Logiciels & SaaS" : "Software" },
    { id: "community", label: "Telegram & Discord" },
    { id: "reselling", label: lang === "fr" ? "Achat-Revente" : "Reselling" },
  ];

  const filteredFavorites = favorites
    .filter((fav) => {
      const matchesCategory =
        selectedCategory === "all" ||
        fav.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        fav.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fav.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fav.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fav.tags && fav.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "price") {
        const numA = parseFloat(a.priceMonthly.replace(/[^0-9.]/g, "")) || 0;
        const numB = parseFloat(b.priceMonthly.replace(/[^0-9.]/g, "")) || 0;
        return numB - numA;
      }
      // default: most recent
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

  // Calculate unique categories count
  const uniqueCategoriesCount = new Set(favorites.map((f) => f.category)).size;

  return (
    <div className="space-y-6 pb-20 text-white max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#17141f] via-[#121318] to-[#121815] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold text-rose-400">
              <Heart className="size-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>
                {lang === "fr"
                  ? `${favorites.length} ${favorites.length > 1 ? "produits sauvegardés" : "produit sauvegardé"}`
                  : `${favorites.length} saved ${favorites.length > 1 ? "items" : "item"}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {lang === "fr" ? "Mes Favoris & Produits Suivis" : "My Saved Favorites & Wishlist"}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {lang === "fr"
                ? "Retrouvez vos offres coups de cœur de la marketplace, suivez les meilleurs créateurs certifiés et accédez instantanément à vos canaux et contenus préférés."
                : "Find your favorite marketplace offers, follow top creators, and get quick access to your preferred channels and digital assets."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onNavigateToMarketplace && (
              <button
                onClick={onNavigateToMarketplace}
                className="mansa-btn-green px-4 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="size-4" />
                <span>{lang === "fr" ? "Explorer la Marketplace" : "Browse Marketplace"}</span>
              </button>
            )}
            {onNavigateToDiscover && (
              <button
                onClick={onNavigateToDiscover}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="size-4 text-amber-400" />
                <span>{lang === "fr" ? "Découvrir Créateurs" : "Discover Creators"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats summary pill badges */}
        {favorites.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-xl p-3 border border-white/5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Total Favoris</span>
              <span className="text-lg font-bold font-mono text-white">{favorites.length}</span>
            </div>
            <div className="bg-black/30 rounded-xl p-3 border border-white/5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Catégories</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{uniqueCategoriesCount}</span>
            </div>
            <div className="bg-black/30 rounded-xl p-3 border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Disponibilité</span>
              <span className="text-lg font-bold font-mono text-rose-400">100% En Ligne</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Controls: Search, Filters & Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder={
              lang === "fr"
                ? "Rechercher un produit, créateur, mot-clé..."
                : "Search products, creators, keywords..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#12141c] pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-rose-500/50 outline-none transition-all"
          />
        </div>

        {/* Sorting & Filter info */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            {lang === "fr" ? "Trier par :" : "Sort by:"}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-[#12141c] px-3 py-2 text-xs font-semibold text-zinc-200 outline-none cursor-pointer focus:border-rose-500/50"
          >
            <option value="recent">{lang === "fr" ? "Récemment ajoutés" : "Recently Added"}</option>
            <option value="rating">{lang === "fr" ? "Mieux notés (Avis)" : "Highest Rated"}</option>
            <option value="price">{lang === "fr" ? "Prix le plus élevé" : "Highest Price"}</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const countInCat =
            cat.id === "all"
              ? favorites.length
              : favorites.filter((f) => f.category.toLowerCase() === cat.id.toLowerCase()).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? "bg-rose-500 text-white font-bold shadow-sm"
                  : "border border-white/5 bg-[#12141c] text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? "bg-black/25 text-white" : "bg-white/5 text-zinc-500"
                }`}
              >
                {countInCat}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Favorites Grid or Empty State */}
      {filteredFavorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#101116] p-12 text-center space-y-4">
          <div className="size-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Heart className="size-7 text-rose-400" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-white">
              {favorites.length === 0
                ? lang === "fr"
                  ? "Aucun favori enregistré"
                  : "No favorites saved yet"
                : lang === "fr"
                ? "Aucun résultat trouvé pour cette recherche"
                : "No matching favorites found"}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {favorites.length === 0
                ? lang === "fr"
                  ? "Explorez la marketplace ou parcourez les créateurs pour ajouter des offres en favoris en cliquant sur l'icône cœur."
                  : "Browse the marketplace or discover creators to save offers to your favorites list by clicking the heart icon."
                : lang === "fr"
                ? "Essayez de modifier vos filtres ou termes de recherche."
                : "Try adjusting your filters or search terms."}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {favorites.length > 0 ? (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mansa-btn-dark px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
              >
                {lang === "fr" ? "Réinitialiser les filtres" : "Reset filters"}
              </button>
            ) : (
              <>
                {onNavigateToMarketplace && (
                  <button
                    onClick={onNavigateToMarketplace}
                    className="mansa-btn-green px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="size-4" />
                    <span>{lang === "fr" ? "Découvrir la Marketplace" : "Explore Marketplace"}</span>
                  </button>
                )}
                {onNavigateToDiscover && (
                  <button
                    onClick={onNavigateToDiscover}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer"
                  >
                    <span>{lang === "fr" ? "Voir les Créateurs Certifiés" : "View Certified Creators"}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((fav) => (
            <div
              key={fav.id}
              onClick={() => {
                if (onOpenProductModal) {
                  onOpenProductModal({
                    id: fav.productId || fav.id,
                    title: fav.title,
                    creator: fav.creator,
                    creatorAvatar: fav.creatorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
                    category: fav.category as any,
                    rating: fav.rating || 4.9,
                    reviewsCount: fav.reviewsCount || 50,
                    priceMonthly: fav.priceMonthly,
                    description: fav.description,
                    tags: fav.tags || [],
                    bannerColor: fav.bannerColor,
                    verified: fav.verified,
                    memberCount: fav.memberCount,
                    storeUrl: fav.storeUrl,
                  });
                } else {
                  setSelectedProductModal(fav);
                }
              }}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111217] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-rose-500/40 hover:bg-[#15171e] cursor-pointer shadow-md"
            >
              <div>
                {/* Header: Avatar, Name & Quick Unfavorite */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        fav.creatorAvatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                      }
                      alt={fav.creator}
                      className="size-11 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                          {fav.title}
                        </span>
                        {fav.verified && (
                          <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-zinc-400 truncate block">
                        par {fav.creator}
                      </span>
                    </div>
                  </div>

                  {/* Unfavorite button */}
                  <button
                    onClick={(e) => handleRemoveFavorite(e, fav.productId || fav.id)}
                    title={lang === "fr" ? "Retirer des favoris" : "Remove from favorites"}
                    className="size-8 rounded-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  >
                    <Heart className="size-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>

                {/* Rating & Category Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-300 uppercase">
                    {fav.category}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span>{fav.rating || 4.9}</span>
                    <span className="text-zinc-500 font-normal">
                      ({fav.reviewsCount || 20})
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4 font-light">
                  {fav.description}
                </p>

                {/* Tags */}
                {fav.tags && fav.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {fav.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {fav.tags.length > 3 && (
                      <span className="rounded-md border border-white/5 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
                        +{fav.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions & Price */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                    Tarif
                  </span>
                  <span className="font-mono text-sm font-bold text-white truncate max-w-[140px] block">
                    {fav.priceMonthly}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopyLink(e, fav)}
                    title={lang === "fr" ? "Copier le lien de l'offre" : "Copy offer link"}
                    className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedId === fav.id ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenProductModal) {
                        onOpenProductModal({
                          id: fav.productId || fav.id,
                          title: fav.title,
                          creator: fav.creator,
                          creatorAvatar: fav.creatorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
                          category: fav.category as any,
                          rating: fav.rating || 4.9,
                          reviewsCount: fav.reviewsCount || 50,
                          priceMonthly: fav.priceMonthly,
                          description: fav.description,
                          tags: fav.tags || [],
                          bannerColor: fav.bannerColor,
                          verified: fav.verified,
                          memberCount: fav.memberCount,
                          storeUrl: fav.storeUrl,
                        });
                      } else {
                        setSelectedProductModal(fav);
                      }
                    }}
                    className="mansa-btn-green px-3 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === "fr" ? "Détails" : "Details"}</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal if fallback detail is required */}
      <ModalOverlay
        isOpen={!!selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        contentClassName="max-w-[460px] mx-auto"
      >
        {selectedProductModal && (
          <div className="relative w-full rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedProductModal.creatorAvatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  }
                  alt={selectedProductModal.creator}
                  className="size-10 rounded-full border border-white/10 object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white font-heading">
                      {selectedProductModal.title}
                    </h3>
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono text-[#B6B5B0]">
                    Par {selectedProductModal.creator}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProductModal(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              {selectedProductModal.description}
            </p>

            <div className="rounded-xl border border-white/10 bg-black/50 p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block">
                  Tarif / Accès
                </span>
                <span className="text-xl font-bold font-mono text-white">
                  {selectedProductModal.priceMonthly}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-md">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedProductModal.rating || 4.9}</span>
                <span className="text-zinc-400 font-normal">
                  ({selectedProductModal.reviewsCount || 20})
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={(e) => {
                  handleRemoveFavorite(e, selectedProductModal.productId || selectedProductModal.id);
                  setSelectedProductModal(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>{lang === "fr" ? "Retirer" : "Remove"}</span>
              </button>

              <button
                onClick={() => setSelectedProductModal(null)}
                className="mansa-btn-green flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === "fr" ? "Fermer" : "Close"}</span>
              </button>
            </div>
          </div>
        )}
      </ModalOverlay>
    </div>
  );
};
