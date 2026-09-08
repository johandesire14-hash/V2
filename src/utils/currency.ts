export type CurrencyCode =
  | "XOF"
  | "XAF"
  | "NGN"
  | "GHS"
  | "KES"
  | "CDF"
  | "MAD"
  | "ZAR"
  | "GNF"
  | "EUR"
  | "USD"
  | "GBP"
  | "CAD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  nameFr: string;
  nameEn: string;
  flag: string;
  rateToUSD: number; // 1 USD = rateToUSD
  prefix?: string;
  suffix?: string;
  decimals: number;
}

export interface DetectedLocationInfo {
  countryCode: string;
  countryName: string;
  currency: CurrencyCode;
  timezone: string;
  locale: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  XOF: {
    code: "XOF",
    symbol: "FCFA",
    nameFr: "Franc CFA UEMOA (XOF) - Côte d'Ivoire, Sénégal, Bénin...",
    nameEn: "West African CFA Franc (XOF)",
    flag: "🇨🇮",
    rateToUSD: 605.0,
    suffix: " FCFA",
    decimals: 0,
  },
  XAF: {
    code: "XAF",
    symbol: "FCFA",
    nameFr: "Franc CFA CEMAC (XAF) - Cameroun, Gabon, Congo...",
    nameEn: "Central African CFA Franc (XAF)",
    flag: "🇨🇲",
    rateToUSD: 605.0,
    suffix: " FCFA",
    decimals: 0,
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    nameFr: "Naira nigérian (NGN)",
    nameEn: "Nigerian Naira (NGN)",
    flag: "🇳🇬",
    rateToUSD: 1550.0,
    prefix: "₦",
    decimals: 0,
  },
  GHS: {
    code: "GHS",
    symbol: "GH₵",
    nameFr: "Cedi ghanéen (GHS)",
    nameEn: "Ghanaian Cedi (GHS)",
    flag: "🇬🇭",
    rateToUSD: 15.6,
    prefix: "GH₵",
    decimals: 2,
  },
  KES: {
    code: "KES",
    symbol: "KSh",
    nameFr: "Shilling kényan (KES)",
    nameEn: "Kenyan Shilling (KES)",
    flag: "🇰🇪",
    rateToUSD: 129.0,
    prefix: "KSh ",
    decimals: 0,
  },
  CDF: {
    code: "CDF",
    symbol: "FC",
    nameFr: "Franc congolais (CDF) - RDC",
    nameEn: "Congolese Franc (CDF)",
    flag: "🇨🇩",
    rateToUSD: 2850.0,
    suffix: " FC",
    decimals: 0,
  },
  MAD: {
    code: "MAD",
    symbol: "DH",
    nameFr: "Dirham marocain (MAD)",
    nameEn: "Moroccan Dirham (MAD)",
    flag: "🇲🇦",
    rateToUSD: 9.9,
    suffix: " DH",
    decimals: 2,
  },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    nameFr: "Rand sud-africain (ZAR)",
    nameEn: "South African Rand (ZAR)",
    flag: "🇿🇦",
    rateToUSD: 18.2,
    prefix: "R ",
    decimals: 2,
  },
  GNF: {
    code: "GNF",
    symbol: "GNF",
    nameFr: "Franc guinéen (GNF)",
    nameEn: "Guinean Franc (GNF)",
    flag: "🇬🇳",
    rateToUSD: 8600.0,
    suffix: " GNF",
    decimals: 0,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    nameFr: "Euro (EUR) - Union Européenne / Diaspora",
    nameEn: "Euro (EUR)",
    flag: "🇪🇺",
    rateToUSD: 0.92,
    suffix: " €",
    decimals: 2,
  },
  USD: {
    code: "USD",
    symbol: "$",
    nameFr: "Dollar américain (USD) - International",
    nameEn: "US Dollar (USD)",
    flag: "🇺🇸",
    rateToUSD: 1.0,
    prefix: "$",
    decimals: 2,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    nameFr: "Livre sterling (GBP)",
    nameEn: "British Pound (GBP)",
    flag: "🇬🇧",
    rateToUSD: 0.79,
    prefix: "£",
    decimals: 2,
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    nameFr: "Dollar canadien (CAD)",
    nameEn: "Canadian Dollar (CAD)",
    flag: "🇨🇦",
    rateToUSD: 1.36,
    prefix: "CA$",
    decimals: 2,
  },
};

/**
 * Detects the user's location & recommended currency based on browser timezone and locale,
 * with first-class preference for African nations.
 */
export const detectUserLocationAndCurrency = (): DetectedLocationInfo => {
  let timezone = "UTC";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    timezone = "UTC";
  }

  const navLang = typeof navigator !== "undefined" ? navigator.language || "fr-FR" : "fr-FR";
  const lowerTz = timezone.toLowerCase();
  const lowerLang = navLang.toLowerCase();

  // Côte d'Ivoire & UEMOA
  if (lowerTz.includes("abidjan") || lowerLang.includes("ci")) {
    return {
      countryCode: "CI",
      countryName: "Côte d'Ivoire",
      currency: "XOF",
      timezone,
      locale: navLang,
      flag: "🇨🇮",
    };
  }

  // Sénégal
  if (lowerTz.includes("dakar") || lowerLang.includes("sn")) {
    return {
      countryCode: "SN",
      countryName: "Sénégal",
      currency: "XOF",
      timezone,
      locale: navLang,
      flag: "🇸🇳",
    };
  }

  // Cameroun & CEMAC
  if (lowerTz.includes("douala") || lowerTz.includes("yaounde") || lowerLang.includes("cm")) {
    return {
      countryCode: "CM",
      countryName: "Cameroun",
      currency: "XAF",
      timezone,
      locale: navLang,
      flag: "🇨🇲",
    };
  }

  // Nigeria
  if (lowerTz.includes("lagos") || lowerLang.includes("ng")) {
    return {
      countryCode: "NG",
      countryName: "Nigéria",
      currency: "NGN",
      timezone,
      locale: navLang,
      flag: "🇳🇬",
    };
  }

  // Ghana
  if (lowerTz.includes("accra") || lowerLang.includes("gh")) {
    return {
      countryCode: "GH",
      countryName: "Ghana",
      currency: "GHS",
      timezone,
      locale: navLang,
      flag: "🇬🇭",
    };
  }

  // Kenya
  if (lowerTz.includes("nairobi") || lowerLang.includes("ke")) {
    return {
      countryCode: "KE",
      countryName: "Kenya",
      currency: "KES",
      timezone,
      locale: navLang,
      flag: "🇰🇪",
    };
  }

  // RDC
  if (lowerTz.includes("kinshasa") || lowerTz.includes("lubumbashi") || lowerLang.includes("cd")) {
    return {
      countryCode: "CD",
      countryName: "RD Congo",
      currency: "CDF",
      timezone,
      locale: navLang,
      flag: "🇨🇩",
    };
  }

  // Maroc
  if (lowerTz.includes("casablanca") || lowerLang.includes("ma")) {
    return {
      countryCode: "MA",
      countryName: "Maroc",
      currency: "MAD",
      timezone,
      locale: navLang,
      flag: "🇲🇦",
    };
  }

  // Bénin / Togo / Mali / Burkina / Niger / Gabon
  if (
    lowerTz.includes("cotonou") ||
    lowerTz.includes("lome") ||
    lowerTz.includes("bamako") ||
    lowerTz.includes("ouagadougou") ||
    lowerTz.includes("niamey")
  ) {
    return {
      countryCode: "XOF",
      countryName: "Zone UEMOA",
      currency: "XOF",
      timezone,
      locale: navLang,
      flag: "🌍",
    };
  }

  if (lowerTz.includes("libreville") || lowerTz.includes("brazzaville") || lowerTz.includes("ndjamena")) {
    return {
      countryCode: "XAF",
      countryName: "Zone CEMAC",
      currency: "XAF",
      timezone,
      locale: navLang,
      flag: "🌍",
    };
  }

  // Eurozone detection (France, Belgique, etc.)
  if (
    lowerTz.includes("paris") ||
    lowerTz.includes("brussels") ||
    lowerTz.includes("berlin") ||
    lowerTz.includes("madrid") ||
    lowerTz.includes("rome") ||
    lowerTz.includes("amsterdam")
  ) {
    return {
      countryCode: "FR",
      countryName: "France & Diaspora",
      currency: "EUR",
      timezone,
      locale: navLang,
      flag: "🇪🇺",
    };
  }

  // Default to African FCFA (XOF)
  return {
    countryCode: "CI",
    countryName: "Afrique de l'Ouest / Centrale",
    currency: "XOF",
    timezone,
    locale: navLang,
    flag: "🇨🇮",
  };
};

/**
 * Converts an amount from USD to the target currency
 */
export const convertFromUSD = (amountUSD: number, targetCurrency: CurrencyCode): number => {
  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.XOF;
  return amountUSD * config.rateToUSD;
};

/**
 * Converts an amount between any two supported currencies
 */
export const convertBetweenCurrencies = (
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number => {
  if (fromCurrency === toCurrency) return amount;
  const fromConfig = SUPPORTED_CURRENCIES[fromCurrency] || SUPPORTED_CURRENCIES.USD;
  const toConfig = SUPPORTED_CURRENCIES[toCurrency] || SUPPORTED_CURRENCIES.XOF;
  const inUSD = amount / fromConfig.rateToUSD;
  return inUSD * toConfig.rateToUSD;
};

/**
 * Persisted currency helper - reads from localStorage or falls back to detected location
 */
export const getStoredCurrency = (): CurrencyCode => {
  if (typeof window === "undefined") return "XOF";
  try {
    const saved = localStorage.getItem("mansa_preferred_currency") as CurrencyCode;
    if (saved && SUPPORTED_CURRENCIES[saved]) {
      return saved;
    }
  } catch {
    // ignore
  }
  return detectUserLocationAndCurrency().currency;
};

/**
 * Persists the selected currency to localStorage and triggers window storage event
 */
export const setStoredCurrency = (currency: CurrencyCode): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("mansa_preferred_currency", currency);
    window.dispatchEvent(new CustomEvent("mansa_currency_changed", { detail: { currency } }));
  } catch {
    // ignore
  }
};

/**
 * Formats an amount between any two currencies into a clean string representation for forms/inputs
 */
export const formatConvertedNumericPrice = (
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): string => {
  if (fromCurrency === toCurrency) {
    const config = SUPPORTED_CURRENCIES[toCurrency] || SUPPORTED_CURRENCIES.USD;
    return config.decimals === 0 ? Math.round(amount).toString() : amount.toString();
  }
  const converted = convertBetweenCurrencies(amount, fromCurrency, toCurrency);
  const targetConfig = SUPPORTED_CURRENCIES[toCurrency] || SUPPORTED_CURRENCIES.USD;
  if (targetConfig.decimals === 0) {
    return Math.round(converted).toString();
  }
  return (Math.round(converted * 100) / 100).toFixed(targetConfig.decimals);
};

/**
 * Formats a USD amount into the target currency formatted string
 */
export const formatCurrency = (
  amountUSD: number,
  targetCurrency: CurrencyCode = "XOF",
  options?: {
    compact?: boolean;
    includeSuffix?: boolean;
    locale?: string;
  }
): string => {
  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.XOF;
  const converted = convertFromUSD(amountUSD, targetCurrency);
  const locale = options?.locale || (targetCurrency === "EUR" ? "fr-FR" : "fr-FR");

  let numFormatted = "";
  if (options?.compact && converted >= 1000) {
    if (converted >= 1_000_000) {
      numFormatted = (converted / 1_000_000).toFixed(1).replace(".", ",") + "M";
    } else {
      numFormatted = (converted / 1_000).toFixed(0).replace(".", ",") + "k";
    }
  } else {
    numFormatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(converted);
  }

  if (config.prefix) {
    return `${config.prefix}${numFormatted}`;
  }
  if (config.suffix && options?.includeSuffix !== false) {
    return `${numFormatted}${config.suffix}`;
  }
  return `${numFormatted} ${config.symbol}`;
};
