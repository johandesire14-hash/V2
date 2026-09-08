import React, { useState, useEffect } from "react";
import {
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Building2,
  DollarSign,
  ShieldCheck,
  Zap,
  X,
  FileText,
  Copy,
  Smartphone,
  Plus,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ModalOverlay } from "../common/ModalOverlay";
import {
  subscribeToCreatorTransactions,
  createRealTransaction,
  seedRealisticDemoData,
  FirestoreTransaction,
} from "../../services/dbService";
import { CurrencyCode, formatCurrency } from "../../utils/currency";
import { isCreatorPayoutConfigured, setCreatorPayoutConfigured } from "../../utils/payoutConfig";
import { MobileMoneyTesterModal } from "../payment/MobileMoneyTesterModal";

interface PaymentTransaction {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  amountGrossFormatted: string;
  feeAmountFormatted: string;
  amountNetFormatted: string;
  currency: string;
  paymentMethod: "wave" | "orange_money" | "mtn_momo" | "moov_money" | "visa_mastercard" | "bank_uemoa";
  paymentMethodLabel: string;
  countryFlag: string;
  countryName: string;
  status: "succeeded" | "pending" | "refunded" | "disputed";
  date: string;
  time: string;
}

interface PaymentsViewProps {
  lang?: "fr" | "en";
  currency?: CurrencyCode;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ lang = "fr", currency = "XAF" as CurrencyCode }) => {
  const activeCurrency: CurrencyCode = (currency as CurrencyCode) || "XAF";
  const { user, profile } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [isTesterModalOpen, setIsTesterModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [payoutAmount, setPayoutAmount] = useState("450000");
  const [payoutMethod, setPayoutMethod] = useState("wave_ci");
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Payout Configuration state (Rule: un produit ne peut pas être visible si le créateur n'a pas configuré son mode de paiement)
  const [isPayoutConfiguredState, setIsPayoutConfiguredState] = useState<boolean>(() =>
    isCreatorPayoutConfigured(profile)
  );
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
  const [cfgMethod, setCfgMethod] = useState<string>(profile?.payoutMethod || "wave");
  const [cfgMomoNumber, setCfgMomoNumber] = useState<string>(profile?.momoNumber || "+225 07 88 99 00 11");
  const [cfgAccountHolder, setCfgAccountHolder] = useState<string>(
    profile?.momoName || profile?.bankAccountHolder || user?.displayName || "Johan Désiré"
  );
  const [cfgBankRib, setCfgBankRib] = useState<string>(
    profile?.bankIbanRib || "CI093 01234 56789012345 67"
  );
  const [cfgFeedback, setCfgFeedback] = useState<string | null>(null);

  useEffect(() => {
    setIsPayoutConfiguredState(isCreatorPayoutConfigured(profile));
  }, [profile]);

  const handleSavePayoutConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatorPayoutConfigured(true);
    setIsPayoutConfiguredState(true);
    setCfgFeedback(
      lang === "fr"
        ? "✅ Mode d'encaissement enregistré avec succès ! Vos produits sont désormais visibles."
        : "✅ Payout configuration saved successfully! Your products are now visible."
    );
    setTimeout(() => {
      setCfgFeedback(null);
      setIsConfigDrawerOpen(false);
    }, 2500);
  };

  const handleTogglePayoutTesting = () => {
    const nextState = !isPayoutConfiguredState;
    setCreatorPayoutConfigured(nextState);
    setIsPayoutConfiguredState(nextState);
    setCfgFeedback(
      nextState
        ? "✅ Mode encaissement ACTIVÉ : Vos produits sont visibles sur le Marketplace."
        : "⚠️ Mode encaissement DÉSACTIVÉ : Vos produits sont masqués (invisibles au public)."
    );
    setTimeout(() => setCfgFeedback(null), 3000);
  };

  // New Sale Form state
  const [saleProductName, setSaleProductName] = useState("Pass VIP Communauté Mansa");
  const [saleCustomerName, setSaleCustomerName] = useState("");
  const [saleCustomerEmail, setSaleCustomerEmail] = useState("");
  const [saleAmount, setSaleAmount] = useState("25000");
  const [saleCurrency, setSaleCurrency] = useState("XOF");
  const [salePaymentMethod, setSalePaymentMethod] = useState("Wave CI");
  const [saleLocation, setSaleLocation] = useState("Abidjan, Côte d'Ivoire");

  useEffect(() => {
    const creatorKey = profile?.uid || user?.email || "creator-default";
    const unsub = subscribeToCreatorTransactions(creatorKey, (dbTxs) => {
      const mapped: PaymentTransaction[] = dbTxs.map((t) => ({
        id: t.id,
        customerName: t.buyerName || t.customerName || "Client Mansa",
        customerEmail: t.buyerEmail || t.customerEmail || "client@gmail.com",
        productName: t.productName,
        amountGrossFormatted: t.amount,
        feeAmountFormatted: `${Math.round((t.amountNumber || 0) * 0.03)} ${t.currency}`,
        amountNetFormatted: `${Math.round((t.amountNumber || 0) * 0.97)} ${t.currency}`,
        currency: t.currency,
        paymentMethod: (t.paymentMethod?.toLowerCase().includes("wave") ? "wave" :
                       t.paymentMethod?.toLowerCase().includes("orange") ? "orange_money" :
                       t.paymentMethod?.toLowerCase().includes("mtn") ? "mtn_momo" :
                       t.paymentMethod?.toLowerCase().includes("moov") ? "moov_money" : "visa_mastercard") as any,
        paymentMethodLabel: t.paymentMethod || "Mobile Money",
        countryFlag: t.buyerLocation?.includes("Sénégal") ? "🇸🇳" :
                     t.buyerLocation?.includes("Nigéria") ? "🇳🇬" :
                     t.buyerLocation?.includes("Cameroun") ? "🇨🇲" :
                     t.buyerLocation?.includes("Ghana") ? "🇬🇭" : "🇨🇮",
        countryName: t.buyerLocation || "Afrique de l'Ouest",
        status: t.status as any,
        date: new Date().toLocaleDateString("fr-FR"),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
      setTransactions(mapped);
    });

    return () => unsub();
  }, [profile?.uid, user?.email]);

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const creatorKey = profile?.uid || user?.email || "creator-default";
    const amtNum = parseFloat(saleAmount) || 25000;
    await createRealTransaction(creatorKey, {
      productName: saleProductName,
      productId: "prod-" + Date.now(),
      amount: `${amtNum.toLocaleString("fr-FR")} ${saleCurrency}`,
      amountNumber: amtNum,
      currency: saleCurrency,
      buyerName: saleCustomerName || "Client Mansa",
      buyerEmail: saleCustomerEmail || "client@gmail.com",
      buyerLocation: saleLocation,
      paymentMethod: salePaymentMethod,
    });
    setIsNewSaleModalOpen(false);
    setSaleCustomerName("");
    setSaleCustomerEmail("");
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filterStatus === "all" || tx.status === filterStatus;
    const matchesSearch =
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setIsPayoutModalOpen(false);
    }, 2000);
  };

  // Calculate real metric totals directly from real Firestore transactions (0 if empty)
  const totalGrossVolume = transactions.reduce((acc, tx) => {
    const amt = tx.amountGross || 0;
    return acc + amt;
  }, 0);
  const totalFees = transactions.reduce((acc, tx) => {
    const fee = tx.feeAmount || 0;
    return acc + fee;
  }, 0);
  const availableBalance = Math.max(0, totalGrossVolume - totalFees);
  const successfulCount = transactions.filter((t) => t.status === "completed" || !t.status).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === "fr" ? "Paiement" : "Payments"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {lang === "fr"
              ? "Gérez vos encaissements Wave, Orange Money, MTN MoMo, cartes bancaires et demandez des virements bancaires instantanés."
              : "Manage African mobile money volume, card checkout transactions and instant bank payouts."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["ID,Client,Email,Produit,Pays,Brut,Frais,Net,Statut,Date"]
                  .concat(
                    transactions.map(
                      (t) =>
                        `${t.id},${t.customerName},${t.customerEmail},${t.productName},${t.countryName},${t.amountGrossFormatted},${t.feeAmountFormatted},${t.amountNetFormatted},${t.status},${t.date}`
                    )
                  )
                  .join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "mansa_transactions.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-[#151515] text-xs font-semibold text-[#B6B5B0] hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>{lang === "fr" ? "Exporter CSV" : "Export CSV"}</span>
          </button>

          <button
            onClick={() => setIsTesterModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-bold transition-all cursor-pointer border border-amber-500/30"
            title="Tester la validation des numéros Mobile Money selon les spécifications"
          >
            <Smartphone className="size-3.5 text-amber-400" />
            <span>Tester Mobile Money</span>
          </button>

          <button
            onClick={() => setIsNewSaleModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
          >
            <Plus className="size-3.5 text-[#3DDC84]" />
            <span>{lang === "fr" ? "+ Vente manuelle" : "+ Manual Sale"}</span>
          </button>

          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3DDC84] hover:bg-[#2FB86A] text-black text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <ArrowUpRight className="size-4" />
            <span>{lang === "fr" ? "Demander un Virement" : "Request Payout"}</span>
          </button>
        </div>
      </div>

      {/* PAYOUT CONFIGURATION CARD (Rule: un produit ne peut pas être visible si le créateur n'a pas configuré le mode de paiement) */}
      <div className={`rounded-2xl border transition-all p-5 ${
        isPayoutConfiguredState
          ? "border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-[#0c1810] to-[#0c0d0e]"
          : "border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-[#181308] to-[#0c0d0e]"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isPayoutConfiguredState
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              {isPayoutConfiguredState ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white">
                  {isPayoutConfiguredState
                    ? "Compte d'encaissement vérifié & actif"
                    : "Compte d'encaissement non configuré"}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  isPayoutConfiguredState
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {isPayoutConfiguredState ? "Produits Visibles" : "Produits Masqués"}
                </span>
              </div>

              <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                {isPayoutConfiguredState
                  ? `Vos fonds sont automatiquement reversés via ${cfgMethod.toUpperCase()} (${cfgMomoNumber || cfgBankRib}). Vos produits sont visibles et peuvent recevoir des paiements.`
                  : "Un produit ne peut pas être visible si le créateur n'a pas configuré le mode de paiement afin d'encaisser les paiements. Configurez votre compte Wave, Orange Money ou RIB bancaire pour débloquer la visibilité."}
              </p>

              {cfgFeedback && (
                <div className="mt-2 text-xs font-semibold text-emerald-400 animate-fade-in">
                  {cfgFeedback}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsConfigDrawerOpen(!isConfigDrawerOpen)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
            >
              {isConfigDrawerOpen ? "Fermer la configuration" : "Modifier mes coordonnées"}
            </button>

            <button
              onClick={handleTogglePayoutTesting}
              title="Tester le basculement entre état configuré et non-configuré"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isPayoutConfiguredState
                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              }`}
            >
              {isPayoutConfiguredState ? "Simuler compte non configuré" : "Activer mon encaissement"}
            </button>
          </div>
        </div>

        {/* Expandable Configuration Form */}
        {isConfigDrawerOpen && (
          <form onSubmit={handleSavePayoutConfig} className="mt-5 pt-5 border-t border-white/10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Moyen d'encaissement</label>
                <select
                  value={cfgMethod}
                  onChange={(e) => setCfgMethod(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#14161b] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="wave">Wave (Côte d'Ivoire / Sénégal)</option>
                  <option value="orange_momo">Orange Money</option>
                  <option value="mtn_momo">MTN Mobile Money</option>
                  <option value="bank_uemoa">Virement Bancaire UEMOA</option>
                  <option value="bank_cemac">Virement Bancaire CEMAC</option>
                  <option value="crypto">Crypto USDT (TRC-20)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">
                  {cfgMethod.includes("bank") ? "IBAN / RIB Bancaire" : "Numéro de téléphone"}
                </label>
                <input
                  type="text"
                  value={cfgMethod.includes("bank") ? cfgBankRib : cfgMomoNumber}
                  onChange={(e) =>
                    cfgMethod.includes("bank") ? setCfgBankRib(e.target.value) : setCfgMomoNumber(e.target.value)
                  }
                  placeholder={cfgMethod.includes("bank") ? "CI093 01234..." : "+225 07..."}
                  className="w-full h-9 px-3 rounded-xl bg-[#14161b] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Nom du titulaire</label>
                <input
                  type="text"
                  value={cfgAccountHolder}
                  onChange={(e) => setCfgAccountHolder(e.target.value)}
                  placeholder="Ex: Johan Désiré"
                  className="w-full h-9 px-3 rounded-xl bg-[#14161b] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfigDrawerOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Check className="size-4" />
                <span>Enregistrer et rendre mes produits visibles</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3 Metric Cards calculated directly from real transactions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Available Payout Balance */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d0e] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold">Solde Disponible Immédiat</span>
            <span className={`size-2 rounded-full ${availableBalance > 0 ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {formatCurrency(availableBalance, activeCurrency)}
          </div>
        </div>

        {/* Total Gross Volume */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d0e] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold">Volume Brut Encaissé</span>
            <ArrowDownLeft className="size-4 text-[#00D26A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#00D26A] tracking-tight">
            {formatCurrency(totalGrossVolume, activeCurrency)}
          </div>
        </div>

        {/* Processing Fees */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d0e] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold">Frais Plateforme Mansa (3%)</span>
            <ShieldCheck className="size-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-300 tracking-tight">
            {formatCurrency(totalFees, activeCurrency)}
          </div>
        </div>

      </div>

      {/* Transactions Section */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d0e] p-5 space-y-4">
        
        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[
              { id: "all", label: "Toutes les transactions" },
              { id: "succeeded", label: "Réussies (Mobile Money & Cartes)" },
              { id: "refunded", label: "Remboursées" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  filterStatus === tab.id
                    ? "bg-[#00D26A] text-black font-bold"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search field */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par client, email, #TX..."
              className="w-full rounded-xl border border-white/10 bg-[#16181f] pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00D26A]"
            />
          </div>

        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-medium text-zinc-400">
                <th className="py-3 px-3">Transaction</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Produit</th>
                <th className="py-3 px-3">Moyen de Paiement</th>
                <th className="py-3 px-3">Montant Brut</th>
                <th className="py-3 px-3">Frais afhub</th>
                <th className="py-3 px-3">Net perçu</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Reçu</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
                      <div className="size-12 rounded-2xl bg-[#151515] border border-white/10 flex items-center justify-center text-[#3DDC84]">
                        <CreditCard className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white font-heading">
                          {lang === "fr" ? "Aucune transaction enregistrée" : "No transactions found"}
                        </h3>
                        <p className="text-xs text-[#B6B5B0] leading-relaxed">
                          {lang === "fr"
                            ? "Vos ventes Wave, Orange Money, MTN MoMo et Cartes apparaîtront ici automatiquement dès qu'un client effectuera un achat."
                            : "Your Mobile Money and Card transactions will appear here in real time."}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <button
                          onClick={() => setIsNewSaleModalOpen(true)}
                          className="mansa-btn-green px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="size-3.5" />
                          <span>{lang === "fr" ? "+ Enregistrer une vente" : "+ Log a Sale"}</span>
                        </button>
                        <button
                          onClick={async () => {
                            const creatorKey = profile?.uid || user?.email || "creator-default";
                            await seedRealisticDemoData(creatorKey, user?.email || "createur@mansa.af", profile?.displayName || "Créateur Mansa");
                          }}
                          className="px-4 py-2 text-xs font-bold rounded-xl border border-[#00D26A]/40 bg-[#00D26A]/10 hover:bg-[#00D26A]/20 text-[#00D26A] flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Zap className="size-3.5" />
                          <span>{lang === "fr" ? "Simuler 24 transactions" : "Simulate 24 Transactions"}</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    {/* Transaction ID + Date */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-white">{tx.id}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {tx.date} à {tx.time}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{tx.countryFlag}</span>
                        <span className="font-semibold text-white">{tx.customerName}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400">{tx.customerEmail}</div>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-3 text-zinc-300 whitespace-nowrap">
                      {tx.productName}
                    </td>

                    {/* Method */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-300">
                        <Smartphone className="size-3 text-emerald-400" />
                        {tx.paymentMethodLabel}
                      </span>
                    </td>

                    {/* Gross */}
                    <td className="py-3.5 px-3 font-mono text-zinc-300 whitespace-nowrap">
                      {tx.amountGrossFormatted}
                    </td>

                    {/* Fee */}
                    <td className="py-3.5 px-3 font-mono text-zinc-500 whitespace-nowrap">
                      -{tx.feeAmountFormatted}
                    </td>

                    {/* Net */}
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {tx.amountNetFormatted}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {tx.status === "succeeded" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          <CheckCircle2 className="size-3" />
                          <span>Validé</span>
                        </span>
                      )}
                      {tx.status === "refunded" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                          <AlertCircle className="size-3" />
                          <span>Remboursé</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        title="Voir le reçu"
                      >
                        <FileText className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* AFRICAN PAYOUT REQUEST MODAL */}
      <ModalOverlay
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        contentClassName="max-w-md mx-auto"
      >
        <div className="w-full rounded-2xl border border-white/10 bg-[#121316] p-6 shadow-2xl space-y-4">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="size-5 text-[#00D26A]" />
              <h3 className="text-base font-bold text-white">Demande de Virement de vos Fonds</h3>
            </div>
            <button
              onClick={() => setIsPayoutModalOpen(false)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {payoutSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="flex size-14 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="size-8" />
              </div>
              <h4 className="text-base font-bold text-white">Virement afhub Transmis avec Succès !</h4>
              <p className="text-xs text-zinc-400 font-mono">
                {parseInt(payoutAmount || "0").toLocaleString("fr-FR")} FCFA ont été envoyés vers votre compte de retrait.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Montant du virement (FCFA)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    max={2984500}
                    min={5000}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#16181f] pl-4 pr-14 py-2.5 font-mono text-sm text-white focus:border-[#00D26A] outline-none"
                    required
                  />
                  <span className="absolute right-3.5 top-3 font-mono text-xs text-zinc-400">FCFA</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Solde disponible total : <strong className="text-emerald-400">2 984 500 FCFA</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Destination du versement
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#16181f] p-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="wave_ci">🇨🇮 Wave Côte d'Ivoire · +225 07 88 92 10 44 (Instantané)</option>
                  <option value="orange_sn">🇸🇳 Wave / Orange Money Sénégal · +221 77 450 12 89</option>
                  <option value="ecobank_ci">🌍 Virement Bancaire Ecobank UEMOA · CI059 •••• 8901</option>
                  <option value="coris_bank">🌍 Virement Bancaire Coris Bank International</option>
                  <option value="uba_bank">🌍 Virement Bancaire UBA (United Bank for Africa)</option>
                  <option value="mtn_cm">🇨🇲 MTN Mobile Money Cameroun · +237 690 00 00 00</option>
                </select>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-xs text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Frais de retrait Mobile Money :</span>
                  <span className="text-emerald-400 font-mono">0 FCFA (Pris en charge par afhub)</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-white/5">
                  <span>Montant net versé :</span>
                  <span className="font-mono text-emerald-400">
                    {parseInt(payoutAmount || "0").toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00D26A] hover:bg-[#10E47A] text-black text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Confirmer le virement
                </button>
              </div>
            </form>
          )}

        </div>
      </ModalOverlay>

      {/* TRANSACTION RECEIPT MODAL */}
      <ModalOverlay
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        contentClassName="max-w-lg mx-auto"
      >
        {selectedTx && (
          <div className="w-full rounded-2xl border border-white/10 bg-[#121316] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#00D26A] uppercase font-bold">
                  Reçu de Paiement afhub
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">Détail de la Transaction</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Référence #TX</span>
                <span className="font-mono font-bold text-white">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Client Acheteur</span>
                <span className="font-semibold text-white">
                  {selectedTx.customerName} ({selectedTx.countryFlag} {selectedTx.countryName})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Email client</span>
                <span className="font-mono text-zinc-300">{selectedTx.customerEmail}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Produit acheté</span>
                <span className="font-semibold text-white">{selectedTx.productName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Mode d'encaissement</span>
                <span className="font-semibold text-emerald-400">{selectedTx.paymentMethodLabel}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Montant total</span>
                <span className="font-mono font-bold text-white">{selectedTx.amountGrossFormatted}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">Net perçu par le créateur</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {selectedTx.amountNetFormatted}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Fermer le reçu
              </button>
            </div>
          </div>
        )}
      </ModalOverlay>

      {/* NEW MANUAL SALE MODAL (Saves directly to Firestore) */}
      <ModalOverlay
        isOpen={isNewSaleModalOpen}
        onClose={() => setIsNewSaleModalOpen(false)}
        contentClassName="max-w-md mx-auto"
      >
        <div className="w-full rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="size-5 text-[#3DDC84]" />
              <h3 className="text-base font-bold text-white font-heading">Enregistrer une Vente Manuelle</h3>
            </div>
            <button
              onClick={() => setIsNewSaleModalOpen(false)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleCreateSale} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-[#B6B5B0] mb-1">Nom du produit</label>
              <input
                type="text"
                value={saleProductName}
                onChange={(e) => setSaleProductName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-[#3DDC84]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-[#B6B5B0] mb-1">Nom du client</label>
                <input
                  type="text"
                  value={saleCustomerName}
                  onChange={(e) => setSaleCustomerName(e.target.value)}
                  placeholder="Ex: Koffi Emmanuel"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-[#3DDC84]"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-[#B6B5B0] mb-1">Email du client</label>
                <input
                  type="email"
                  value={saleCustomerEmail}
                  onChange={(e) => setSaleCustomerEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-[#3DDC84]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-[#B6B5B0] mb-1">Montant</label>
                <input
                  type="number"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-[#3DDC84]"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-[#B6B5B0] mb-1">Devise</label>
                <select
                  value={saleCurrency}
                  onChange={(e) => setSaleCurrency(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-[#3DDC84]"
                >
                  <option value="XOF">XOF (FCFA UEMOA)</option>
                  <option value="XAF">XAF (FCFA CEMAC)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="NGN">NGN (₦)</option>
                  <option value="GHS">GHS (GH₵)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#B6B5B0] mb-1">Moyen de paiement</label>
              <select
                value={salePaymentMethod}
                onChange={(e) => setSalePaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-[#3DDC84]"
              >
                <option value="Wave CI">Wave Côte d'Ivoire</option>
                <option value="Wave SN">Wave Sénégal</option>
                <option value="Orange Money CI">Orange Money Côte d'Ivoire</option>
                <option value="MTN MoMo">MTN MoMo</option>
                <option value="Moov Money">Moov Money</option>
                <option value="Carte Bancaire">Carte Bancaire / Stripe</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#B6B5B0] mb-1">Localisation de l'acheteur</label>
              <input
                type="text"
                value={saleLocation}
                onChange={(e) => setSaleLocation(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-[#3DDC84]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewSaleModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#3DDC84] hover:bg-[#2FB86A] text-black font-bold"
              >
                Enregistrer la transaction
              </button>
            </div>
          </form>
        </div>
      </ModalOverlay>

    </div>
  );
};
