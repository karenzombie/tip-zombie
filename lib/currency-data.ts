export interface CurrencyInfo {
  code: string;
  symbol: string;
  position: "prefix" | "suffix";
  decimals: number;
}

export const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  "united states": { code: "USD", symbol: "$", position: "prefix", decimals: 2 },
  "canada": { code: "CAD", symbol: "CA$", position: "prefix", decimals: 2 },
  "mexico": { code: "MXN", symbol: "$", position: "prefix", decimals: 2 },

  "france": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "germany": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "italy": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "spain": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "netherlands": { code: "EUR", symbol: "€", position: "prefix", decimals: 2 },
  "belgium": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "portugal": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "greece": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "ireland": { code: "EUR", symbol: "€", position: "prefix", decimals: 2 },
  "austria": { code: "EUR", symbol: "€", position: "prefix", decimals: 2 },
  "finland": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "croatia": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "montenegro": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "kosovo": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "andorra": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "monaco": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "san marino": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "vatican city": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "luxembourg": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "malta": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "cyprus": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "estonia": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "latvia": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "lithuania": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "slovakia": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },
  "slovenia": { code: "EUR", symbol: "€", position: "suffix", decimals: 2 },

  "united kingdom": { code: "GBP", symbol: "£", position: "prefix", decimals: 2 },
  "switzerland": { code: "CHF", symbol: "CHF", position: "prefix", decimals: 2 },
  "norway": { code: "NOK", symbol: "kr", position: "suffix", decimals: 2 },
  "sweden": { code: "SEK", symbol: "kr", position: "suffix", decimals: 2 },
  "denmark": { code: "DKK", symbol: "kr", position: "suffix", decimals: 2 },
  "iceland": { code: "ISK", symbol: "kr", position: "suffix", decimals: 0 },
  "poland": { code: "PLN", symbol: "zł", position: "suffix", decimals: 2 },
  "czech republic": { code: "CZK", symbol: "Kč", position: "suffix", decimals: 2 },
  "hungary": { code: "HUF", symbol: "Ft", position: "suffix", decimals: 0 },
  "romania": { code: "RON", symbol: "lei", position: "suffix", decimals: 2 },
  "bulgaria": { code: "BGN", symbol: "лв", position: "suffix", decimals: 2 },
  "russia": { code: "RUB", symbol: "₽", position: "suffix", decimals: 2 },
  "ukraine": { code: "UAH", symbol: "₴", position: "suffix", decimals: 2 },
  "turkey": { code: "TRY", symbol: "₺", position: "prefix", decimals: 2 },

  "japan": { code: "JPY", symbol: "¥", position: "prefix", decimals: 0 },
  "china": { code: "CNY", symbol: "¥", position: "prefix", decimals: 2 },
  "south korea": { code: "KRW", symbol: "₩", position: "prefix", decimals: 0 },
  "hong kong": { code: "HKD", symbol: "HK$", position: "prefix", decimals: 2 },
  "macau": { code: "MOP", symbol: "MOP$", position: "prefix", decimals: 2 },
  "taiwan": { code: "TWD", symbol: "NT$", position: "prefix", decimals: 0 },
  "singapore": { code: "SGD", symbol: "S$", position: "prefix", decimals: 2 },
  "thailand": { code: "THB", symbol: "฿", position: "prefix", decimals: 2 },
  "vietnam": { code: "VND", symbol: "₫", position: "suffix", decimals: 0 },
  "indonesia": { code: "IDR", symbol: "Rp", position: "prefix", decimals: 0 },
  "malaysia": { code: "MYR", symbol: "RM", position: "prefix", decimals: 2 },
  "philippines": { code: "PHP", symbol: "₱", position: "prefix", decimals: 2 },
  "india": { code: "INR", symbol: "₹", position: "prefix", decimals: 2 },
  "pakistan": { code: "PKR", symbol: "₨", position: "prefix", decimals: 2 },
  "bangladesh": { code: "BDT", symbol: "৳", position: "prefix", decimals: 2 },
  "sri lanka": { code: "LKR", symbol: "Rs", position: "prefix", decimals: 2 },
  "nepal": { code: "NPR", symbol: "Rs", position: "prefix", decimals: 2 },
  "myanmar": { code: "MMK", symbol: "K", position: "prefix", decimals: 0 },
  "cambodia": { code: "KHR", symbol: "៛", position: "prefix", decimals: 0 },
  "laos": { code: "LAK", symbol: "₭", position: "prefix", decimals: 0 },

  "united arab emirates": { code: "AED", symbol: "AED", position: "prefix", decimals: 2 },
  "saudi arabia": { code: "SAR", symbol: "SAR", position: "prefix", decimals: 2 },
  "qatar": { code: "QAR", symbol: "QAR", position: "prefix", decimals: 2 },
  "kuwait": { code: "KWD", symbol: "KWD", position: "prefix", decimals: 3 },
  "bahrain": { code: "BHD", symbol: "BHD", position: "prefix", decimals: 3 },
  "oman": { code: "OMR", symbol: "OMR", position: "prefix", decimals: 3 },
  "israel": { code: "ILS", symbol: "₪", position: "prefix", decimals: 2 },
  "jordan": { code: "JOD", symbol: "JOD", position: "prefix", decimals: 3 },
  "egypt": { code: "EGP", symbol: "£", position: "prefix", decimals: 2 },
  "morocco": { code: "MAD", symbol: "MAD", position: "prefix", decimals: 2 },

  "australia": { code: "AUD", symbol: "A$", position: "prefix", decimals: 2 },
  "new zealand": { code: "NZD", symbol: "NZ$", position: "prefix", decimals: 2 },

  "brazil": { code: "BRL", symbol: "R$", position: "prefix", decimals: 2 },
  "argentina": { code: "ARS", symbol: "$", position: "prefix", decimals: 2 },
  "chile": { code: "CLP", symbol: "$", position: "prefix", decimals: 0 },
  "colombia": { code: "COP", symbol: "$", position: "prefix", decimals: 0 },
  "peru": { code: "PEN", symbol: "S/", position: "prefix", decimals: 2 },
  "uruguay": { code: "UYU", symbol: "$", position: "prefix", decimals: 2 },
  "ecuador": { code: "USD", symbol: "$", position: "prefix", decimals: 2 },
  "costa rica": { code: "CRC", symbol: "₡", position: "prefix", decimals: 0 },

  "bahamas": { code: "BSD", symbol: "B$", position: "prefix", decimals: 2 },
  "barbados": { code: "BBD", symbol: "Bds$", position: "prefix", decimals: 2 },
  "jamaica": { code: "JMD", symbol: "J$", position: "prefix", decimals: 2 },
  "trinidad and tobago": { code: "TTD", symbol: "TT$", position: "prefix", decimals: 2 },
  "dominican republic": { code: "DOP", symbol: "RD$", position: "prefix", decimals: 2 },
  "aruba": { code: "AWG", symbol: "ƒ", position: "prefix", decimals: 2 },
  "cayman islands": { code: "KYD", symbol: "CI$", position: "prefix", decimals: 2 },

  "south africa": { code: "ZAR", symbol: "R", position: "prefix", decimals: 2 },
  "kenya": { code: "KES", symbol: "KSh", position: "prefix", decimals: 2 },
  "tanzania": { code: "TZS", symbol: "TSh", position: "prefix", decimals: 0 },
  "nigeria": { code: "NGN", symbol: "₦", position: "prefix", decimals: 2 },
  "ghana": { code: "GHS", symbol: "GH₵", position: "prefix", decimals: 2 },
  "botswana": { code: "BWP", symbol: "P", position: "prefix", decimals: 2 },
  "namibia": { code: "NAD", symbol: "N$", position: "prefix", decimals: 2 },
  "zimbabwe": { code: "USD", symbol: "$", position: "prefix", decimals: 2 },

  "puerto rico": { code: "USD", symbol: "$", position: "prefix", decimals: 2 },
  "guam": { code: "USD", symbol: "$", position: "prefix", decimals: 2 },
  "us virgin islands": { code: "USD", symbol: "$", position: "prefix", decimals: 2 },
  "french polynesia": { code: "XPF", symbol: "₣", position: "suffix", decimals: 0 },
  "new caledonia": { code: "XPF", symbol: "₣", position: "suffix", decimals: 0 },

  "maldives": { code: "MVR", symbol: "Rf", position: "prefix", decimals: 2 },
  "fiji": { code: "FJD", symbol: "FJ$", position: "prefix", decimals: 2 },
  "cuba": { code: "CUP", symbol: "$", position: "prefix", decimals: 2 },
  "panama": { code: "USD", symbol: "$", position: "prefix", decimals: 2 },
  "el salvador": { code: "USD", symbol: "$", position: "prefix", decimals: 2 },
  "guatemala": { code: "GTQ", symbol: "Q", position: "prefix", decimals: 2 },
  "honduras": { code: "HNL", symbol: "L", position: "prefix", decimals: 2 },
  "nicaragua": { code: "NIO", symbol: "C$", position: "prefix", decimals: 2 },
  "belize": { code: "BZD", symbol: "BZ$", position: "prefix", decimals: 2 },
  "ethiopia": { code: "ETB", symbol: "Br", position: "prefix", decimals: 2 },
  "uganda": { code: "UGX", symbol: "USh", position: "prefix", decimals: 0 },
  "rwanda": { code: "RWF", symbol: "RF", position: "prefix", decimals: 0 },
  "mozambique": { code: "MZN", symbol: "MT", position: "prefix", decimals: 2 },
  "senegal": { code: "XOF", symbol: "CFA", position: "suffix", decimals: 0 },
  "ivory coast": { code: "XOF", symbol: "CFA", position: "suffix", decimals: 0 },
  "cote d'ivoire": { code: "XOF", symbol: "CFA", position: "suffix", decimals: 0 },
  "brunei": { code: "BND", symbol: "B$", position: "prefix", decimals: 2 },
  "mongolia": { code: "MNT", symbol: "₮", position: "suffix", decimals: 0 },
  "lebanon": { code: "LBP", symbol: "L£", position: "prefix", decimals: 0 },
  "tunisia": { code: "TND", symbol: "DT", position: "prefix", decimals: 3 },
  "iran": { code: "IRR", symbol: "﷼", position: "suffix", decimals: 0 },
  "bolivia": { code: "BOB", symbol: "Bs.", position: "prefix", decimals: 2 },
  "paraguay": { code: "PYG", symbol: "₲", position: "prefix", decimals: 0 },
  "venezuela": { code: "VES", symbol: "Bs.", position: "prefix", decimals: 2 },
  "madagascar": { code: "MGA", symbol: "Ar", position: "prefix", decimals: 0 },
  "zambia": { code: "ZMW", symbol: "ZK", position: "prefix", decimals: 2 },
  "bhutan": { code: "BTN", symbol: "Nu.", position: "prefix", decimals: 2 },
  "albania": { code: "ALL", symbol: "L", position: "prefix", decimals: 0 },
  "bosnia": { code: "BAM", symbol: "KM", position: "prefix", decimals: 2 },
  "bosnia and herzegovina": { code: "BAM", symbol: "KM", position: "prefix", decimals: 2 },
  "serbia": { code: "RSD", symbol: "din", position: "suffix", decimals: 0 },
  "grenada": { code: "XCD", symbol: "$", position: "prefix", decimals: 2 },
  "antigua and barbuda": { code: "XCD", symbol: "$", position: "prefix", decimals: 2 },
  "st. kitts and nevis": { code: "XCD", symbol: "$", position: "prefix", decimals: 2 },
  "saint kitts and nevis": { code: "XCD", symbol: "$", position: "prefix", decimals: 2 },
  "st. lucia": { code: "XCD", symbol: "$", position: "prefix", decimals: 2 },
  "saint lucia": { code: "XCD", symbol: "$", position: "prefix", decimals: 2 },
  "st. vincent and the grenadines": { code: "XCD", symbol: "$", position: "prefix", decimals: 2 },
  "saint vincent and the grenadines": { code: "XCD", symbol: "$", position: "prefix", decimals: 2 },
  "papua new guinea": { code: "PGK", symbol: "K", position: "prefix", decimals: 2 },
};

export const DEFAULT_CURRENCY: CurrencyInfo = {
  code: "USD",
  symbol: "$",
  position: "prefix",
  decimals: 2,
};

const COUNTRY_ALIASES: Record<string, string> = {
  "uk": "united kingdom",
  "england": "united kingdom",
  "scotland": "united kingdom",
  "wales": "united kingdom",
  "northern ireland": "united kingdom",
  "usa": "united states",
  "us": "united states",
  "america": "united states",
  "uae": "united arab emirates",
  "czech": "czech republic",
  "czechia": "czech republic",
  "korea": "south korea",
  "republic of korea": "south korea",
  "china mainland": "china",
  "peoples republic of china": "china",
};

export function getCurrencyForCountry(countryName: string): CurrencyInfo {
  const normalized = countryName.toLowerCase().trim();

  if (CURRENCY_MAP[normalized]) {
    return CURRENCY_MAP[normalized];
  }

  if (COUNTRY_ALIASES[normalized] && CURRENCY_MAP[COUNTRY_ALIASES[normalized]]) {
    return CURRENCY_MAP[COUNTRY_ALIASES[normalized]];
  }

  return DEFAULT_CURRENCY;
}

export function formatCurrencyAmount(amount: number, currency: CurrencyInfo): string {
  const roundedAmount = currency.decimals === 0
    ? Math.round(amount)
    : parseFloat(amount.toFixed(currency.decimals));

  const formattedNumber = roundedAmount.toLocaleString("en-US", {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });

  if (currency.position === "prefix") {
    const space = currency.symbol.length > 1 ? " " : "";
    return `${currency.symbol}${space}${formattedNumber}`;
  } else {
    return `${formattedNumber} ${currency.symbol}`;
  }
}
