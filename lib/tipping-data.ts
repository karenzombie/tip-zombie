export interface TipRange {
  min: number;
  max: number;
}

export interface ServiceTipData {
  [serviceKey: string]: TipRange;
}

export interface TipException {
  range: TipRange;
  note: string;
  showCalculation: boolean;
}

export interface FlatSuggestion {
  label: string;
  tipAmount: number;
  note: string;
}

export interface FlatServiceData {
  [serviceKey: string]: FlatSuggestion[];
}

export interface OptionalPercentages {
  skip: number;
  good: number;
  exceptional: number;
}

export interface RegionData {
  currency: string;
  currencySymbol: string;
  noTipping?: boolean;
  noTipMessage?: string;
  noneMessage?: string;
  isOptional?: boolean;
  optionalPercentages?: OptionalPercentages;
  regionNote?: string;
  services: ServiceTipData;
  flatServices?: FlatServiceData;
  cityOverrides?: {
    [city: string]: ServiceTipData;
  };
  cityFlatOverrides?: {
    [city: string]: FlatServiceData;
  };
  cityNotes?: { [city: string]: string };
  exceptions?: {
    [serviceKey: string]: TipException;
  };
}

export interface TippingDatabase {
  [country: string]: RegionData;
}

function r(min: number, max: number): TipRange {
  return { min, max };
}

function makeAllServices(base: TipRange, overrides?: Partial<ServiceTipData>): ServiceTipData {
  const services: ServiceTipData = {
    restaurant_sitdown: base,
    restaurant_takeout: base,
    hotels_general: base,
    hotels_bellhop: base,
    hotels_housekeeping: base,
    hotels_concierge: base,
    hotels_valet: base,
    hotels_roomservice: base,
    beauty_manicure: base,
    beauty_hair: base,
    beauty_makeup: base,
    beauty_massage: base,
    beauty_spa: base,
    beauty_tattoo: base,
    delivery: base,
    bars: base,
    transportation_taxi: base,
    transportation_shuttle: base,
    transportation_porter: base,
    transportation_limo: base,
    tours: base,
    movers: base,
    cruise_steward: base,
    cruise_dining: base,
    cruise_bartender: base,
    cruise_excursion: base,
    cruise_spa: base,
    cruise_butler: base,
  };
  if (overrides) {
    return { ...services, ...overrides } as ServiceTipData;
  }
  return services;
}

function hotelsAt(range: TipRange, roomServiceRange?: TipRange): Partial<ServiceTipData> {
  return {
    hotels_general: range,
    hotels_bellhop: range,
    hotels_housekeeping: range,
    hotels_concierge: range,
    hotels_valet: range,
    hotels_roomservice: roomServiceRange || range,
  };
}

function cruiseAt(range: TipRange): Partial<ServiceTipData> {
  return {
    cruise_steward: range,
    cruise_dining: range,
    cruise_bartender: range,
    cruise_excursion: range,
    cruise_spa: range,
    cruise_butler: range,
  };
}

function transportAt(range: TipRange): Partial<ServiceTipData> {
  return {
    transportation_taxi: range,
    transportation_shuttle: range,
    transportation_porter: range,
    transportation_limo: range,
  };
}

const defaultServices: ServiceTipData = {
  restaurant_sitdown: r(15, 20),
  restaurant_takeout: r(10, 15),
  hotels_general: r(10, 15),
  hotels_bellhop: r(10, 15),
  hotels_housekeeping: r(10, 15),
  hotels_concierge: r(10, 15),
  hotels_valet: r(10, 15),
  hotels_roomservice: r(15, 20),
  beauty_manicure: r(15, 20),
  beauty_hair: r(15, 20),
  beauty_makeup: r(15, 20),
  beauty_massage: r(15, 20),
  beauty_spa: r(15, 20),
  beauty_tattoo: r(15, 20),
  delivery: r(15, 20),
  bars: r(15, 20),
  transportation_taxi: r(10, 20),
  transportation_shuttle: r(15, 20),
  transportation_porter: r(10, 15),
  transportation_limo: r(15, 20),
  tours: r(15, 20),
  movers: r(15, 20),
  cruise_steward: r(15, 20),
  cruise_dining: r(15, 20),
  cruise_bartender: r(15, 20),
  cruise_excursion: r(15, 20),
  cruise_spa: r(18, 20),
  cruise_butler: r(15, 20),
};

const usMajorCityServices: ServiceTipData = {
  restaurant_sitdown: r(20, 25),
  restaurant_takeout: r(10, 15),
  hotels_general: r(10, 15),
  hotels_bellhop: r(10, 15),
  hotels_housekeeping: r(10, 15),
  hotels_concierge: r(10, 15),
  hotels_valet: r(10, 15),
  hotels_roomservice: r(15, 20),
  beauty_manicure: r(20, 25),
  beauty_hair: r(20, 25),
  beauty_makeup: r(20, 25),
  beauty_massage: r(20, 25),
  beauty_spa: r(20, 25),
  beauty_tattoo: r(20, 25),
  delivery: r(20, 25),
  bars: r(20, 25),
  transportation_taxi: r(10, 20),
  transportation_shuttle: r(15, 20),
  transportation_porter: r(10, 15),
  transportation_limo: r(15, 20),
  tours: r(15, 20),
  movers: r(15, 20),
  cruise_steward: r(15, 20),
  cruise_dining: r(15, 20),
  cruise_bartender: r(15, 20),
  cruise_excursion: r(15, 20),
  cruise_spa: r(18, 20),
  cruise_butler: r(15, 20),
};

const usRegionNote = "US restaurant tipping: 18-20% is now the standard for good service. 15% may be considered low.";

const usMajorCityNote = "Major metropolitan area: Tipping expectations are typically higher (20-25%) due to cost of living.";

const allUsCityOverrides: { [city: string]: ServiceTipData } = {
  "new york": usMajorCityServices,
  "new york city": usMajorCityServices,
  "nyc": usMajorCityServices,
  "manhattan": usMajorCityServices,
  "brooklyn": usMajorCityServices,
  "queens": usMajorCityServices,
  "bronx": usMajorCityServices,
  "staten island": usMajorCityServices,
  "san francisco": usMajorCityServices,
  "sf": usMajorCityServices,
  "bay area": usMajorCityServices,
  "los angeles": usMajorCityServices,
  "la": usMajorCityServices,
  "chicago": usMajorCityServices,
  "boston": usMajorCityServices,
  "seattle": usMajorCityServices,
  "washington dc": usMajorCityServices,
  "washington d.c.": usMajorCityServices,
  "dc": usMajorCityServices,
  "district of columbia": usMajorCityServices,
  "miami": usMajorCityServices,
  "san diego": usMajorCityServices,
  "honolulu": usMajorCityServices,
  "las vegas": usMajorCityServices,
  "vegas": usMajorCityServices,
};

const usCityNotes: { [city: string]: string } = {};
for (const city of Object.keys(allUsCityOverrides)) {
  usCityNotes[city] = usMajorCityNote;
}

const usEntry: RegionData = {
  currency: "USD",
  currencySymbol: "$",
  regionNote: usRegionNote,
  services: { ...defaultServices },
  cityOverrides: { ...allUsCityOverrides },
  cityNotes: { ...usCityNotes },
};

const ukRestServices = makeAllServices(r(10, 12), {
  restaurant_takeout: r(0, 5),
  ...hotelsAt(r(10, 12), r(10, 12)),
  delivery: r(5, 10),
  bars: r(0, 5),
});

const londonServices = makeAllServices(r(12, 15), {
  restaurant_takeout: r(0, 5),
  ...hotelsAt(r(10, 15), r(12, 15)),
  delivery: r(10, 15),
  bars: r(5, 10),
});

const ukEntry: RegionData = {
  currency: "GBP",
  currencySymbol: "\u00A3",
  regionNote: "Tipping less common in rural areas; 10% is appropriate.",
  services: ukRestServices,
  cityOverrides: {
    "london": londonServices,
  },
  cityNotes: {
    "london": "12.5% service charge commonly included - check bill before tipping.",
  },
};


const easternEuropeServices = makeAllServices(r(10, 15), {
  ...hotelsAt(r(5, 10)),
});

const caribbeanNote = "Many restaurants add 10-15% service charge; check bill to avoid double tipping.";

const caribbeanResortServices = makeAllServices(r(15, 18), {
  ...hotelsAt(r(10, 15)),
});

const caribbeanResortNote = "Many resorts add 10-15% service charge; check bill before tipping.";

const uaeOtherServices = makeAllServices(r(10, 15));

const uaeDubaiServices = makeAllServices(r(10, 15), {
  restaurant_sitdown: r(15, 20),
  restaurant_takeout: r(15, 20),
  ...cruiseAt(r(15, 20)),
});

const uaeNote = "10% service charge often included; additional tip appreciated.";
const uaeDubaiNote = "10% service charge often included; additional 15-20% tip expected.";

const parisServices = makeAllServices(r(5, 10), {
  restaurant_takeout: r(0, 5),
});

const mexicoTouristServices = makeAllServices(r(15, 20));
const mexicoInlandNote = "Local standard: 10-15%; tourist restaurants may expect more.";
const mexicoTouristNote = "Tourist areas follow US-style tipping; 15-20% expected.";

const thailandTouristServices = makeAllServices(r(10, 15), {
  beauty_massage: r(10, 15),
  beauty_spa: r(10, 15),
});
const thailandTouristNote = "Tourist areas: 10-15% appreciated; check for service charge.";


const japanHotelNote = "Japan Tipping Note: Tipping is not customary in Japanese hotels. However, at luxury ryokans (traditional inns), a token of appreciation called 'kokorozuke' may be given to your personal attendant (nakai-san) in a clean envelope. Amount: \u00A51,000-5,000 per person for the stay. This is entirely optional.";

export const tippingDatabase: TippingDatabase = {
  "united states": usEntry,
  "usa": usEntry,
  "us": usEntry,
  "canada": {
    currency: "CAD",
    currencySymbol: "$",
    services: makeAllServices(r(15, 20), {
      restaurant_takeout: r(10, 15),
      ...hotelsAt(r(10, 15), r(15, 20)),
      ...transportAt(r(10, 20)),
    }),
  },
  "mexico": {
    currency: "MXN",
    currencySymbol: "$",
    regionNote: mexicoInlandNote,
    services: makeAllServices(r(10, 15)),
    cityOverrides: {
      "cancun": mexicoTouristServices,
      "playa del carmen": mexicoTouristServices,
      "cabo san lucas": mexicoTouristServices,
      "cabo": mexicoTouristServices,
      "puerto vallarta": mexicoTouristServices,
      "tulum": mexicoTouristServices,
      "cozumel": mexicoTouristServices,
    },
    cityNotes: {
      "cancun": mexicoTouristNote,
      "playa del carmen": mexicoTouristNote,
      "cabo san lucas": mexicoTouristNote,
      "cabo": mexicoTouristNote,
      "puerto vallarta": mexicoTouristNote,
      "tulum": mexicoTouristNote,
      "cozumel": mexicoTouristNote,
    },
  },
  "united kingdom": ukEntry,
  "uk": ukEntry,
  "england": ukEntry,
  "scotland": ukEntry,
  "wales": ukEntry,
  "northern ireland": ukEntry,
  "france": {
    currency: "EUR",
    currencySymbol: "\u20AC",
    regionNote: "Service included; rounding up appreciated but not expected.",
    services: makeAllServices(r(0, 5), {
      restaurant_takeout: r(0, 0),
      tours: r(5, 10),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "Round up" },
        { label: "Exceptional", tipAmount: 2, note: "Warm gesture" },
      ],
      bars: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "Not expected" },
        { label: "Exceptional", tipAmount: 1, note: "Round up for excellent service" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "Per bag" },
        { label: "Exceptional", tipAmount: 2, note: "Per bag for porter/concierge" },
      ],
      hotels_housekeeping: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "Per night" },
        { label: "Exceptional", tipAmount: 2, note: "Per night" },
      ],
      hotels_concierge: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "For helpful service" },
        { label: "Exceptional", tipAmount: 3, note: "Per bag for porter/concierge" },
      ],
      hotels_roomservice: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "Round up" },
        { label: "Exceptional", tipAmount: 2, note: "Warm gesture" },
      ],
      hotels_general: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "Round up" },
        { label: "Exceptional", tipAmount: 2, note: "Warm gesture" },
      ],
      hotels_valet: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "Round up" },
        { label: "Exceptional", tipAmount: 2, note: "Warm gesture" },
      ],
    },
    cityOverrides: {
      "paris": parisServices,
    },
    cityNotes: {
      "paris": "15% service charge (service compris) included by law; extra tipping optional.",
    },
  },
  "germany": {
    currency: "EUR",
    currencySymbol: "\u20AC",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "Round up the bill" },
        { label: "Exceptional", tipAmount: 0, note: "Round up bill, or add 5\u201310%" },
      ],
    },
  },
  "italy": {
    currency: "EUR",
    currencySymbol: "\u20AC",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
      bars: r(0, 5),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "Coperto often pre-charged" },
        { label: "Exceptional", tipAmount: 3, note: "Coperto often pre-charged" },
      ],
    },
  },
  "spain": {
    currency: "EUR",
    currencySymbol: "\u20AC",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
      bars: r(0, 5),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "Coins left on table typical" },
        { label: "Exceptional", tipAmount: 0, note: "Coins left on table typical" },
      ],
    },
  },
  "australia": {
    currency: "AUD",
    currencySymbol: "$",
    isOptional: true,
    optionalPercentages: { skip: 0, good: 10, exceptional: 15 },
    regionNote: "Tipping is not expected in Australia — service workers receive fair wages. 10-15% for exceptional service is entirely optional.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      tours: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 5, note: "$5 per person" },
        { label: "Exceptional", tipAmount: 10, note: "$10 per person" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1, note: "Per bag" },
        { label: "Exceptional", tipAmount: 2, note: "Per bag" },
      ],
      delivery: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1, note: "Small gesture" },
        { label: "Exceptional", tipAmount: 2, note: "Generous gesture" },
      ],
    },
  },
  "new zealand": {
    currency: "NZD",
    currencySymbol: "$",
    isOptional: true,
    optionalPercentages: { skip: 0, good: 10, exceptional: 15 },
    regionNote: "Tipping is not required in New Zealand. 10-15% is a welcome gesture for exceptional service.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      tours: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 5, note: "$5 per person" },
        { label: "Exceptional", tipAmount: 10, note: "$10 per person" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1, note: "Per bag" },
        { label: "Exceptional", tipAmount: 2, note: "Per bag" },
      ],
    },
  },
  "south africa": {
    currency: "ZAR",
    currencySymbol: "R",
    regionNote: "For safari guides and drivers, 10-15% tip is customary.",
    services: makeAllServices(r(10, 15), {
      restaurant_takeout: r(5, 10),
    }),
  },
  "argentina": {
    currency: "ARS",
    currencySymbol: "$",
    regionNote: "Service charge common. Inflation makes flat amounts impractical; use % guidance.",
    services: makeAllServices(r(10, 15), {
      restaurant_sitdown: r(10, 10),
      restaurant_takeout: r(5, 10),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "10% appreciated" },
        { label: "Exceptional", tipAmount: 0, note: "15% for exceptional service" },
      ],
    },
  },
  "chile": {
    currency: "CLP",
    currencySymbol: "$",
    regionNote: "10% propina expected at sit-down restaurants.",
    services: makeAllServices(r(10, 15), {
      restaurant_sitdown: r(10, 10),
      restaurant_takeout: r(5, 10),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "10% propina expected" },
        { label: "Exceptional", tipAmount: 0, note: "10–15% for exceptional" },
      ],
    },
  },
  "colombia": {
    currency: "COP",
    currencySymbol: "$",
    regionNote: "10% voluntary service charge common.",
    services: makeAllServices(r(15, 20)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "10% voluntary charge common" },
        { label: "Exceptional", tipAmount: 0, note: "10% standard" },
      ],
    },
  },
  "peru": {
    currency: "PEN",
    currencySymbol: "S/",
    regionNote: "10% propina appreciated, not always required.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 5, note: "S/5 appreciated" },
        { label: "Exceptional", tipAmount: 10, note: "S/10 generous gesture" },
      ],
    },
  },
  "costa rica": {
    currency: "CRC",
    currencySymbol: "\u20A1",
    regionNote: "10% service charge often included. Confirm before tipping.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "5% if not included" },
        { label: "Exceptional", tipAmount: 0, note: "10% for exceptional" },
      ],
    },
  },
  "turkey": {
    currency: "TRY",
    currencySymbol: "\u20BA",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
    }),
  },
  "india": {
    currency: "INR",
    currencySymbol: "\u20B9",
    regionNote: "10% tip appreciated. Service charge sometimes added.",
    services: makeAllServices(r(10, 15), {
      restaurant_takeout: r(5, 10),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 75, note: "\u20B950–100 appreciated" },
        { label: "Exceptional", tipAmount: 150, note: "\u20B9100–200 generous" },
      ],
    },
  },
  "maldives": {
    currency: "MVR",
    currencySymbol: "Rf",
    regionNote: "Service charge included. Small cash tip appreciated.",
    services: makeAllServices(r(10, 15), {
      restaurant_takeout: r(5, 10),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "$1–2 appreciated" },
        { label: "Exceptional", tipAmount: 3, note: "$2–5 generous" },
      ],
    },
  },
  "bhutan": {
    currency: "BTN",
    currencySymbol: "Nu.",
    services: makeAllServices(r(10, 15), {
      restaurant_takeout: r(5, 10),
    }),
  },
  "pakistan": {
    currency: "PKR",
    currencySymbol: "Rs",
    regionNote: "10% tip appreciated.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 75, note: "Rs50–100 appreciated" },
        { label: "Exceptional", tipAmount: 150, note: "Rs100–200 generous" },
      ],
    },
  },
  "bangladesh": {
    currency: "BDT",
    currencySymbol: "\u09F3",
    regionNote: "Tipping not obligatory but appreciated.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 50, note: "\u09F350 appreciated" },
        { label: "Exceptional", tipAmount: 100, note: "\u09F3100 generous" },
      ],
    },
  },
  "sri lanka": {
    currency: "LKR",
    currencySymbol: "Rs",
    regionNote: "10% service charge often added. Extra tip appreciated.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 100, note: "Rs100 appreciated" },
        { label: "Exceptional", tipAmount: 200, note: "Rs200 generous" },
      ],
    },
  },
  "nepal": {
    currency: "NPR",
    currencySymbol: "Rs",
    regionNote: "10% tip appreciated especially in tourist areas.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 100, note: "Rs100 appreciated" },
        { label: "Exceptional", tipAmount: 200, note: "Rs200 generous" },
      ],
    },
  },
  "thailand": {
    currency: "THB",
    currencySymbol: "\u0E3F",
    regionNote: "Not obligatory but appreciated. Service charge sometimes added.",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
      beauty_massage: r(10, 20),
      beauty_spa: r(10, 20),
      tours: r(10, 15),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 30, note: "\u0E3F20–50 appreciated" },
        { label: "Exceptional", tipAmount: 75, note: "\u0E3F50–100 generous" },
      ],
    },
    cityOverrides: {
      "phuket": thailandTouristServices,
      "koh samui": thailandTouristServices,
      "pattaya": thailandTouristServices,
      "krabi": thailandTouristServices,
      "hua hin": thailandTouristServices,
    },
    cityNotes: {
      "phuket": thailandTouristNote,
      "koh samui": thailandTouristNote,
      "pattaya": thailandTouristNote,
      "krabi": thailandTouristNote,
      "hua hin": thailandTouristNote,
    },
  },
  "vietnam": {
    currency: "VND",
    currencySymbol: "\u20AB",
    regionNote: "Tipping not required. Appreciated in tourist areas.",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
      tours: r(10, 15),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 20000, note: "\u20AB20,000 appreciated" },
        { label: "Exceptional", tipAmount: 50000, note: "\u20AB50,000 generous" },
      ],
    },
  },
  "indonesia": {
    currency: "IDR",
    currencySymbol: "Rp",
    regionNote: "5–10% tip common. Service charge may be added.",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 10000, note: "Rp10,000 appreciated" },
        { label: "Exceptional", tipAmount: 25000, note: "Rp20,000–30,000 generous" },
      ],
    },
  },
  "cambodia": {
    currency: "KHR",
    currencySymbol: "\u17DB",
    regionNote: "USD widely accepted; tipping growing with tourism.",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1, note: "$1 USD appreciated" },
        { label: "Exceptional", tipAmount: 2, note: "$2 USD generous" },
      ],
    },
  },
  "malaysia": {
    currency: "MYR",
    currencySymbol: "RM",
    regionNote: "Service charge + GST typically included. Extra tip not expected.",
    services: makeAllServices(r(5, 10), {
      restaurant_takeout: r(0, 5),
    }),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 3, note: "RM2–5 appreciated" },
        { label: "Exceptional", tipAmount: 5, note: "RM5–10 generous" },
      ],
    },
  },
  "philippines": {
    currency: "PHP",
    currencySymbol: "\u20B1",
    regionNote: "5–10% tip common. Service charge sometimes added.",
    services: makeAllServices(r(5, 10)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 50, note: "\u20B150 appreciated" },
        { label: "Exceptional", tipAmount: 100, note: "\u20B1100 generous" },
      ],
    },
  },
  "myanmar": {
    currency: "MMK",
    currencySymbol: "K",
    regionNote: "Tipping becoming common in tourist areas.",
    services: makeAllServices(r(5, 10)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 1000, note: "K1,000 appreciated" },
        { label: "Exceptional", tipAmount: 2000, note: "K2,000 generous" },
      ],
    },
  },
  "laos": {
    currency: "LAK",
    currencySymbol: "\u20AD",
    regionNote: "Tipping not expected but appreciated.",
    services: makeAllServices(r(5, 10)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 10000, note: "\u20AD10,000 appreciated" },
        { label: "Exceptional", tipAmount: 20000, note: "\u20AD20,000 generous" },
      ],
    },
  },
  "united arab emirates": {
    currency: "AED",
    currencySymbol: "\u062F.\u0625",
    regionNote: uaeNote,
    services: uaeOtherServices,
    cityOverrides: {
      "dubai": uaeDubaiServices,
      "abu dhabi": uaeDubaiServices,
    },
    cityNotes: {
      "dubai": uaeDubaiNote,
      "abu dhabi": uaeDubaiNote,
    },
  },
  "uae": {
    currency: "AED",
    currencySymbol: "\u062F.\u0625",
    regionNote: uaeNote,
    services: uaeOtherServices,
    cityOverrides: {
      "dubai": uaeDubaiServices,
      "abu dhabi": uaeDubaiServices,
    },
    cityNotes: {
      "dubai": uaeDubaiNote,
      "abu dhabi": uaeDubaiNote,
    },
  },
  "qatar": {
    currency: "QAR",
    currencySymbol: "\u0631.\u0642",
    regionNote: uaeNote,
    services: makeAllServices(r(10, 15), {
      restaurant_sitdown: r(15, 20),
      restaurant_takeout: r(15, 20),
      ...cruiseAt(r(15, 20)),
    }),
  },
  "saudi arabia": {
    currency: "SAR",
    currencySymbol: "\u0631.\u0633",
    regionNote: uaeNote,
    services: makeAllServices(r(10, 15), {
      restaurant_sitdown: r(15, 20),
      restaurant_takeout: r(15, 20),
      ...cruiseAt(r(15, 20)),
    }),
  },
  "kuwait": {
    currency: "KWD",
    currencySymbol: "KWD",
    regionNote: uaeNote,
    services: makeAllServices(r(10, 15), {
      restaurant_sitdown: r(15, 20),
      restaurant_takeout: r(15, 20),
      ...cruiseAt(r(15, 20)),
    }),
  },
  "bahrain": {
    currency: "BHD",
    currencySymbol: "BHD",
    regionNote: uaeNote,
    services: makeAllServices(r(10, 15), {
      restaurant_sitdown: r(15, 20),
      restaurant_takeout: r(15, 20),
      ...cruiseAt(r(15, 20)),
    }),
  },
  "oman": {
    currency: "OMR",
    currencySymbol: "OMR",
    regionNote: uaeNote,
    services: makeAllServices(r(10, 15), {
      restaurant_sitdown: r(15, 20),
      restaurant_takeout: r(15, 20),
      ...cruiseAt(r(15, 20)),
    }),
  },
  "jordan": {
    currency: "JOD",
    currencySymbol: "\u062F.\u0627",
    services: makeAllServices(r(10, 15)),
  },
  "egypt": {
    currency: "EGP",
    currencySymbol: "\u00A3",
    regionNote: "Check if service charge included.",
    services: makeAllServices(r(10, 15)),
  },
  "israel": {
    currency: "ILS",
    currencySymbol: "\u20AA",
    regionNote: "Service charge often included; check bill.",
    services: makeAllServices(r(10, 15)),
  },
  "morocco": {
    currency: "MAD",
    currencySymbol: "\u062F.\u0645.",
    services: makeAllServices(r(10, 15)),
  },
  "bahamas": {
    currency: "BSD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
    cityOverrides: {
      "nassau": caribbeanResortServices,
      "freeport": caribbeanResortServices,
    },
    cityNotes: {
      "nassau": caribbeanResortNote,
      "freeport": caribbeanResortNote,
    },
  },
  "barbados": {
    currency: "BBD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
    cityOverrides: {
      "bridgetown": caribbeanResortServices,
    },
    cityNotes: {
      "bridgetown": caribbeanResortNote,
    },
  },
  "jamaica": {
    currency: "JMD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
    cityOverrides: {
      "montego bay": caribbeanResortServices,
      "negril": caribbeanResortServices,
      "ocho rios": caribbeanResortServices,
    },
    cityNotes: {
      "montego bay": caribbeanResortNote,
      "negril": caribbeanResortNote,
      "ocho rios": caribbeanResortNote,
    },
  },
  "dominican republic": {
    currency: "DOP",
    currencySymbol: "$",
    regionNote: "10% service charge usually included; additional 10% tip customary.",
    services: makeAllServices(r(10, 15)),
  },
  "trinidad and tobago": {
    currency: "TTD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
  },
  "cayman islands": {
    currency: "KYD",
    currencySymbol: "$",
    regionNote: caribbeanResortNote,
    services: caribbeanResortServices,
  },
  "aruba": {
    currency: "AWG",
    currencySymbol: "Afl.",
    regionNote: caribbeanResortNote,
    services: caribbeanResortServices,
  },
  "st. lucia": {
    currency: "XCD",
    currencySymbol: "$",
    regionNote: caribbeanResortNote,
    services: caribbeanResortServices,
  },
  "saint lucia": {
    currency: "XCD",
    currencySymbol: "$",
    regionNote: caribbeanResortNote,
    services: caribbeanResortServices,
  },
  "turks and caicos": {
    currency: "USD",
    currencySymbol: "$",
    regionNote: caribbeanResortNote,
    services: caribbeanResortServices,
  },
  "antigua and barbuda": {
    currency: "XCD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
  },
  "st. kitts and nevis": {
    currency: "XCD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
  },
  "saint kitts and nevis": {
    currency: "XCD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
  },
  "grenada": {
    currency: "XCD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
  },
  "st. vincent and the grenadines": {
    currency: "XCD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
  },
  "saint vincent and the grenadines": {
    currency: "XCD",
    currencySymbol: "$",
    regionNote: caribbeanNote,
    services: makeAllServices(r(10, 15)),
  },
  "kenya": {
    currency: "KES",
    currencySymbol: "KSh",
    services: makeAllServices(r(10, 15)),
  },
  "tanzania": {
    currency: "TZS",
    currencySymbol: "TSh",
    services: makeAllServices(r(10, 15)),
  },
  "botswana": {
    currency: "BWP",
    currencySymbol: "P",
    services: makeAllServices(r(10, 15)),
  },
  "zimbabwe": {
    currency: "ZWL",
    currencySymbol: "$",
    services: makeAllServices(r(10, 15)),
  },
  "namibia": {
    currency: "NAD",
    currencySymbol: "$",
    services: makeAllServices(r(10, 15)),
  },
  "uganda": {
    currency: "UGX",
    currencySymbol: "USh",
    services: makeAllServices(r(10, 15)),
  },
  "rwanda": {
    currency: "RWF",
    currencySymbol: "FRw",
    services: makeAllServices(r(10, 15)),
  },
  "poland": {
    currency: "PLN",
    currencySymbol: "z\u0142",
    services: easternEuropeServices,
  },
  "czech republic": {
    currency: "CZK",
    currencySymbol: "K\u010D",
    services: easternEuropeServices,
  },
  "hungary": {
    currency: "HUF",
    currencySymbol: "Ft",
    services: easternEuropeServices,
  },
  "romania": {
    currency: "RON",
    currencySymbol: "lei",
    services: easternEuropeServices,
  },
  "bulgaria": {
    currency: "BGN",
    currencySymbol: "\u043B\u0432",
    services: easternEuropeServices,
  },
  "croatia": {
    currency: "EUR",
    currencySymbol: "\u20AC",
    regionNote: "Higher tips appreciated in tourist areas like Dubrovnik and Split.",
    services: easternEuropeServices,
  },
  "slovenia": {
    currency: "EUR",
    currencySymbol: "\u20AC",
    services: easternEuropeServices,
  },
  "slovakia": {
    currency: "EUR",
    currencySymbol: "\u20AC",
    services: easternEuropeServices,
  },
  "serbia": {
    currency: "RSD",
    currencySymbol: "din",
    services: easternEuropeServices,
  },
  "albania": {
    currency: "ALL",
    currencySymbol: "L",
    services: easternEuropeServices,
  },
  "bosnia and herzegovina": {
    currency: "BAM",
    currencySymbol: "KM",
    services: easternEuropeServices,
  },
  "bosnia": {
    currency: "BAM",
    currencySymbol: "KM",
    services: easternEuropeServices,
  },
  "russia": {
    currency: "RUB",
    currencySymbol: "\u20BD",
    regionNote: "Hotel staff expect larger tips than Western Europe.",
    services: makeAllServices(r(10, 15)),
  },
  "norway": {
    currency: "NOK",
    currencySymbol: "kr",
    regionNote: "Service included. Rounding up is fine.",
    services: makeAllServices(r(0, 5)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "Round up" },
        { label: "Exceptional", tipAmount: 30, note: "kr20–50 for excellent service" },
      ],
    },
  },
  "sweden": {
    currency: "SEK",
    currencySymbol: "kr",
    regionNote: "Service included. Rounding up appreciated but not required.",
    services: makeAllServices(r(0, 5)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "Round up" },
        { label: "Exceptional", tipAmount: 15, note: "kr10–20 for excellent service" },
      ],
    },
  },
  "denmark": {
    currency: "DKK",
    currencySymbol: "kr",
    regionNote: "Service included. Tipping not obligatory.",
    services: makeAllServices(r(0, 5)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "Round up" },
        { label: "Exceptional", tipAmount: 30, note: "kr20–50 for excellent service" },
      ],
    },
  },
  "finland": {
    currency: "EUR",
    currencySymbol: "\u20AC",
    regionNote: "Tipping not expected. Rounding up appreciated.",
    services: makeAllServices(r(0, 5)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 0, note: "Round up" },
        { label: "Exceptional", tipAmount: 1, note: "\u20AC1–2 for excellent service" },
      ],
    },
  },
  "iceland": {
    currency: "ISK",
    currencySymbol: "kr",
    isOptional: true,
    optionalPercentages: { skip: 0, good: 10, exceptional: 15 },
    regionNote: "Tipping is not traditional in Iceland but is increasingly appreciated in tourist areas. 10-15% is a kind gesture for excellent service.",
    services: makeAllServices(r(10, 15)),
  },
  "japan": {
    currency: "JPY",
    currencySymbol: "\u00A5",
    noTipping: true,
    noTipMessage: "Tipping is not customary in this location",
    noneMessage: "Tipping is not expected in Japan and may be considered rude.",
    services: {},
    flatServices: {
      tours: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1000, note: "\u00A51,000 in envelope" },
        { label: "Exceptional", tipAmount: 3000, note: "\u00A53,000–5,000 in envelope" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 500, note: "\u00A5500 per bag" },
        { label: "Exceptional", tipAmount: 1000, note: "\u00A51,000 per bag" },
      ],
      delivery: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 200, note: "Small gesture" },
        { label: "Exceptional", tipAmount: 500, note: "Generous gesture" },
      ],
    },
    exceptions: {
      "hotels_general": {
        range: r(0, 0),
        note: japanHotelNote,
        showCalculation: false,
      },
      "hotels_housekeeping": {
        range: r(0, 0),
        note: japanHotelNote,
        showCalculation: false,
      },
      "hotels_concierge": {
        range: r(0, 0),
        note: japanHotelNote,
        showCalculation: false,
      },
      "hotels_valet": {
        range: r(0, 0),
        note: japanHotelNote,
        showCalculation: false,
      },
      "hotels_roomservice": {
        range: r(0, 0),
        note: japanHotelNote,
        showCalculation: false,
      },
    },
  },
  "south korea": {
    currency: "KRW",
    currencySymbol: "\u20A9",
    noTipping: true,
    noTipMessage: "Tipping is not customary in this location",
    noneMessage: "Tipping not customary. Some upscale hotels may accept.",
    services: {},
    flatServices: {
      tours: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 10000, note: "\u20A910,000 per person" },
        { label: "Exceptional", tipAmount: 20000, note: "\u20A920,000 per person" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1000, note: "Per bag" },
        { label: "Exceptional", tipAmount: 2000, note: "Per bag" },
      ],
      delivery: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1000, note: "Small gesture" },
        { label: "Exceptional", tipAmount: 2000, note: "Generous gesture" },
      ],
    },
  },
  "korea": {
    currency: "KRW",
    currencySymbol: "\u20A9",
    noTipping: true,
    noTipMessage: "Tipping is not customary in this location",
    noneMessage: "Tipping not customary. Some upscale hotels may accept.",
    services: {},
    flatServices: {
      tours: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 10000, note: "\u20A910,000 per person" },
        { label: "Exceptional", tipAmount: 20000, note: "\u20A920,000 per person" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1000, note: "Per bag" },
        { label: "Exceptional", tipAmount: 2000, note: "Per bag" },
      ],
      delivery: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1000, note: "Small gesture" },
        { label: "Exceptional", tipAmount: 2000, note: "Generous gesture" },
      ],
    },
  },
  "china": {
    currency: "CNY",
    currencySymbol: "\u00A5",
    noTipping: true,
    noTipMessage: "Tipping is not customary in this location",
    noneMessage: "Tipping not traditional. May be refused in some settings.",
    services: {},
    flatServices: {
      tours: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 70, note: "\u00A570 (~$10 USD) per day" },
        { label: "Exceptional", tipAmount: 130, note: "\u00A5130 (~$20 USD) per day" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 10, note: "\u00A510 per bag" },
        { label: "Exceptional", tipAmount: 30, note: "\u00A530 per bag" },
      ],
      delivery: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 5, note: "Small gesture" },
        { label: "Exceptional", tipAmount: 10, note: "Generous gesture" },
      ],
    },
  },
  "singapore": {
    currency: "SGD",
    currencySymbol: "$",
    isOptional: true,
    optionalPercentages: { skip: 0, good: 10, exceptional: 15 },
    regionNote: "A 10% service charge and GST are standard in Singapore. An extra tip for truly exceptional service is welcome but not expected.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      tours: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 5, note: "S$5 per person" },
        { label: "Exceptional", tipAmount: 10, note: "S$10 per person" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1, note: "Per bag" },
        { label: "Exceptional", tipAmount: 2, note: "Per bag" },
      ],
      delivery: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 1, note: "Small gesture" },
        { label: "Exceptional", tipAmount: 2, note: "Generous gesture" },
      ],
    },
  },
  "taiwan": {
    currency: "TWD",
    currencySymbol: "NT$",
    isOptional: true,
    optionalPercentages: { skip: 0, good: 10, exceptional: 15 },
    regionNote: "Service charge common in hotels and upscale restaurants. Additional tip occasionally given.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      tours: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 200, note: "NT$200 per person" },
        { label: "Exceptional", tipAmount: 500, note: "NT$500 per person" },
      ],
      hotels_bellhop: [
        { label: "Dissatisfied", tipAmount: 0, note: "Not expected" },
        { label: "Average", tipAmount: 50, note: "Per bag" },
        { label: "Exceptional", tipAmount: 100, note: "Per bag" },
      ],
    },
  },
  "hong kong": {
    currency: "HKD",
    currencySymbol: "HK$",
    isOptional: true,
    optionalPercentages: { skip: 0, good: 10, exceptional: 15 },
    regionNote: "10% service charge often included. Extra 5% appreciated for good service.",
    services: makeAllServices(r(10, 15), {
      restaurant_takeout: r(0, 5),
    }),
  },
  "macau": {
    currency: "MOP",
    currencySymbol: "MOP$",
    regionNote: "10% service charge often included.",
    services: makeAllServices(r(10, 15), {
      restaurant_takeout: r(0, 5),
    }),
  },
  "ghana": {
    currency: "GHS",
    currencySymbol: "GH\u20B5",
    regionNote: "10% tip appreciated in restaurants.",
    services: makeAllServices(r(5, 10)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 5, note: "GH\u20B55 appreciated" },
        { label: "Exceptional", tipAmount: 10, note: "GH\u20B510 generous" },
      ],
    },
  },
  "nigeria": {
    currency: "NGN",
    currencySymbol: "\u20A6",
    regionNote: "10% service charge may be added. Small cash tip appreciated.",
    services: makeAllServices(r(5, 10)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 500, note: "\u20A6500 appreciated" },
        { label: "Exceptional", tipAmount: 1000, note: "\u20A61,000 generous" },
      ],
    },
  },
  "ethiopia": {
    currency: "ETB",
    currencySymbol: "Br",
    regionNote: "Tipping growing. 10% appreciated.",
    services: makeAllServices(r(10, 15)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 20, note: "Br20 appreciated" },
        { label: "Exceptional", tipAmount: 50, note: "Br50 generous" },
      ],
    },
  },
  "senegal": {
    currency: "XOF",
    currencySymbol: "CFA",
    regionNote: "Tipping appreciated in restaurants.",
    services: makeAllServices(r(5, 10)),
    flatServices: {
      restaurant_sitdown: [
        { label: "Dissatisfied", tipAmount: 0, note: "No extra tip needed" },
        { label: "Average", tipAmount: 500, note: "CFA500 appreciated" },
        { label: "Exceptional", tipAmount: 1000, note: "CFA1,000 generous" },
      ],
    },
  },
  "ivory coast": {
    currency: "XOF",
    currencySymbol: "CFA",
    regionNote: "Tipping appreciated.",
    services: makeAllServices(r(5, 10)),
  },
  "cote d'ivoire": {
    currency: "XOF",
    currencySymbol: "CFA",
    regionNote: "Tipping appreciated.",
    services: makeAllServices(r(5, 10)),
  },
  "mozambique": {
    currency: "MZN",
    currencySymbol: "MT",
    regionNote: "Tipping growing in tourist areas.",
    services: makeAllServices(r(10, 15)),
  },
  "madagascar": {
    currency: "MGA",
    currencySymbol: "Ar",
    regionNote: "Small tips appreciated.",
    services: makeAllServices(r(5, 10)),
  },
  "zambia": {
    currency: "ZMW",
    currencySymbol: "ZK",
    regionNote: "10% tip appreciated especially for safaris.",
    services: makeAllServices(r(10, 15)),
  },
  "tunisia": {
    currency: "TND",
    currencySymbol: "DT",
    regionNote: "5–10% tip common in tourist areas.",
    services: makeAllServices(r(5, 10)),
  },
  "lebanon": {
    currency: "LBP",
    currencySymbol: "L\u00A3",
    regionNote: "15% tip expected in restaurants.",
    services: makeAllServices(r(10, 15)),
  },
  "iran": {
    currency: "IRR",
    currencySymbol: "\uFDFC",
    regionNote: "Tipping not expected but rounding up is common.",
    services: makeAllServices(r(5, 10)),
  },
  "ecuador": {
    currency: "USD",
    currencySymbol: "$",
    regionNote: "10% service charge often added.",
    services: makeAllServices(r(10, 15)),
  },
  "bolivia": {
    currency: "BOB",
    currencySymbol: "Bs.",
    regionNote: "5–10% tip appreciated.",
    services: makeAllServices(r(5, 10)),
  },
  "uruguay": {
    currency: "UYU",
    currencySymbol: "$U",
    regionNote: "10% tip customary in restaurants.",
    services: makeAllServices(r(10, 15)),
  },
  "paraguay": {
    currency: "PYG",
    currencySymbol: "\u20B2",
    regionNote: "10% tip customary in restaurants.",
    services: makeAllServices(r(10, 15)),
  },
  "venezuela": {
    currency: "VES",
    currencySymbol: "Bs.",
    regionNote: "10% service charge often included.",
    services: makeAllServices(r(10, 15)),
  },
  "panama": {
    currency: "PAB",
    currencySymbol: "B/.",
    regionNote: "10% tip customary.",
    services: makeAllServices(r(10, 15)),
  },
  "guatemala": {
    currency: "GTQ",
    currencySymbol: "Q",
    regionNote: "10% tip customary in restaurants.",
    services: makeAllServices(r(10, 15)),
  },
  "honduras": {
    currency: "HNL",
    currencySymbol: "L",
    regionNote: "10% tip appreciated.",
    services: makeAllServices(r(10, 15)),
  },
  "el salvador": {
    currency: "USD",
    currencySymbol: "$",
    regionNote: "10% tip common.",
    services: makeAllServices(r(10, 15)),
  },
  "nicaragua": {
    currency: "NIO",
    currencySymbol: "C$",
    regionNote: "10% tip appreciated.",
    services: makeAllServices(r(10, 15)),
  },
  "belize": {
    currency: "BZD",
    currencySymbol: "BZ$",
    regionNote: "10–15% tip customary.",
    services: makeAllServices(r(10, 15)),
  },
  "cuba": {
    currency: "CUP",
    currencySymbol: "$",
    regionNote: "Tipping important as wages are low. USD tips preferred.",
    services: makeAllServices(r(10, 15)),
  },
  "puerto rico": {
    currency: "USD",
    currencySymbol: "$",
    regionNote: "US tipping standards apply.",
    services: makeAllServices(r(15, 20)),
  },
  "fiji": {
    currency: "FJD",
    currencySymbol: "FJ$",
    regionNote: "Tipping not traditionally expected but appreciated.",
    services: makeAllServices(r(5, 10)),
  },
  "brunei": {
    currency: "BND",
    currencySymbol: "B$",
    isOptional: true,
    optionalPercentages: { skip: 0, good: 5, exceptional: 10 },
    regionNote: "Tipping not expected but accepted graciously at tourist-facing venues.",
    services: makeAllServices(r(5, 10)),
  },
  "mongolia": {
    currency: "MNT",
    currencySymbol: "\u20AE",
    regionNote: "Tipping growing in tourist areas.",
    services: makeAllServices(r(5, 10)),
  },
  "papua new guinea": {
    currency: "PGK",
    currencySymbol: "K",
    isOptional: true,
    optionalPercentages: { skip: 0, good: 5, exceptional: 10 },
    regionNote: "Tipping at tourist venues and lodges is practiced even if not traditional.",
    services: makeAllServices(r(5, 10)),
  },
};

const usStates: { [key: string]: boolean } = {
  "alabama": true, "alaska": true, "arizona": true, "arkansas": true,
  "california": true, "colorado": true, "connecticut": true, "delaware": true,
  "florida": true, "georgia": true, "hawaii": true, "idaho": true,
  "illinois": true, "indiana": true, "iowa": true, "kansas": true,
  "kentucky": true, "louisiana": true, "maine": true, "maryland": true,
  "massachusetts": true, "michigan": true, "minnesota": true, "mississippi": true,
  "missouri": true, "montana": true, "nebraska": true, "nevada": true,
  "new hampshire": true, "new jersey": true, "new mexico": true, "new york": true,
  "north carolina": true, "north dakota": true, "ohio": true, "oklahoma": true,
  "oregon": true, "pennsylvania": true, "rhode island": true, "south carolina": true,
  "south dakota": true, "tennessee": true, "texas": true, "utah": true,
  "vermont": true, "virginia": true, "washington": true, "west virginia": true,
  "wisconsin": true, "wyoming": true,
};

const canadianProvinces: { [key: string]: boolean } = {
  "ontario": true, "quebec": true, "british columbia": true, "alberta": true,
  "manitoba": true, "saskatchewan": true, "nova scotia": true,
  "new brunswick": true, "newfoundland": true, "prince edward island": true,
  "northwest territories": true, "yukon": true, "nunavut": true,
};

const europeanCountries: { [key: string]: boolean } = {
  "austria": true, "belgium": true, "bulgaria": true, "croatia": true,
  "cyprus": true, "czech republic": true, "estonia": true,
  "greece": true, "hungary": true, "ireland": true,
  "latvia": true, "lithuania": true, "luxembourg": true, "malta": true,
  "netherlands": true, "poland": true, "portugal": true, "romania": true,
  "slovakia": true, "slovenia": true, "switzerland": true,
  "serbia": true, "albania": true, "bosnia and herzegovina": true,
};

const cityToCountry: { [city: string]: string } = {
  "tokyo": "japan", "osaka": "japan", "kyoto": "japan",
  "seoul": "south korea", "busan": "south korea",
  "beijing": "china", "shanghai": "china", "guangzhou": "china", "shenzhen": "china",
  "bangkok": "thailand", "phuket": "thailand", "chiang mai": "thailand",
  "pattaya": "thailand", "koh samui": "thailand", "krabi": "thailand", "hua hin": "thailand",
  "london": "united kingdom", "manchester": "united kingdom", "birmingham": "united kingdom", "edinburgh": "united kingdom", "liverpool": "united kingdom",
  "glasgow": "united kingdom", "cardiff": "united kingdom", "belfast": "united kingdom",
  "paris": "france", "lyon": "france", "marseille": "france", "nice": "france",
  "berlin": "germany", "munich": "germany", "hamburg": "germany", "frankfurt": "germany",
  "rome": "italy", "milan": "italy", "florence": "italy", "venice": "italy", "naples": "italy",
  "madrid": "spain", "barcelona": "spain", "seville": "spain",
  "sydney": "australia", "melbourne": "australia", "brisbane": "australia", "perth": "australia",
  "mumbai": "india", "delhi": "india", "bangalore": "india", "chennai": "india", "kolkata": "india", "new delhi": "india",
  "ho chi minh": "vietnam", "hanoi": "vietnam", "saigon": "vietnam", "ho chi minh city": "vietnam",
  "bali": "indonesia", "jakarta": "indonesia",
  "kuala lumpur": "malaysia",
  "phnom penh": "cambodia", "siem reap": "cambodia",
  "mexico city": "mexico", "cancun": "mexico", "guadalajara": "mexico", "playa del carmen": "mexico", "tulum": "mexico",
  "cabo san lucas": "mexico", "cabo": "mexico", "puerto vallarta": "mexico", "cozumel": "mexico",
  "monterrey": "mexico", "oaxaca": "mexico", "puebla": "mexico",
  "buenos aires": "argentina",
  "santiago": "chile",
  "istanbul": "turkey", "ankara": "turkey",
  "cape town": "south africa", "johannesburg": "south africa", "durban": "south africa",
  "dubai": "united arab emirates", "abu dhabi": "united arab emirates",
  "sharjah": "united arab emirates", "ajman": "united arab emirates", "fujairah": "united arab emirates",
  "cairo": "egypt",
  "doha": "qatar",
  "kuwait city": "kuwait",
  "manama": "bahrain",
  "muscat": "oman",
  "riyadh": "saudi arabia", "jeddah": "saudi arabia",
  "amman": "jordan",
  "jerusalem": "israel", "tel aviv": "israel",
  "casablanca": "morocco", "marrakech": "morocco",
  "oslo": "norway",
  "stockholm": "sweden",
  "copenhagen": "denmark",
  "helsinki": "finland",
  "reykjavik": "iceland",
  "auckland": "new zealand", "wellington": "new zealand",
  "bogota": "colombia", "medellin": "colombia",
  "lima": "peru",
  "san jose": "costa rica",
  "nassau": "bahamas", "freeport": "bahamas",
  "kingston": "jamaica",
  "montego bay": "jamaica", "negril": "jamaica", "ocho rios": "jamaica",
  "warsaw": "poland",
  "prague": "czech republic",
  "budapest": "hungary",
  "bucharest": "romania",
  "zagreb": "croatia", "dubrovnik": "croatia", "split": "croatia",
  "ljubljana": "slovenia",
  "belgrade": "serbia",
  "tirana": "albania",
  "sarajevo": "bosnia and herzegovina",
  "moscow": "russia", "st. petersburg": "russia", "st petersburg": "russia",
  "karachi": "pakistan", "lahore": "pakistan", "islamabad": "pakistan",
  "dhaka": "bangladesh",
  "colombo": "sri lanka",
  "kathmandu": "nepal",
  "manila": "philippines",
  "nairobi": "kenya", "mombasa": "kenya",
  "dar es salaam": "tanzania", "zanzibar": "tanzania",
  "kampala": "uganda",
  "kigali": "rwanda",
  "gaborone": "botswana",
  "harare": "zimbabwe",
  "windhoek": "namibia",
  "accra": "ghana",
  "lagos": "nigeria", "abuja": "nigeria",
  "addis ababa": "ethiopia",
  "dakar": "senegal",
  "lusaka": "zambia",
  "maputo": "mozambique",
  "tunis": "tunisia",
  "beirut": "lebanon",
  "tehran": "iran",
  "quito": "ecuador", "guayaquil": "ecuador",
  "la paz": "bolivia",
  "montevideo": "uruguay",
  "asuncion": "paraguay",
  "caracas": "venezuela",
  "panama city": "panama",
  "guatemala city": "guatemala",
  "tegucigalpa": "honduras",
  "san salvador": "el salvador",
  "managua": "nicaragua",
  "belize city": "belize",
  "havana": "cuba",
  "san juan": "puerto rico",
  "suva": "fiji",
  "ulaanbaatar": "mongolia",
  "yangon": "myanmar", "mandalay": "myanmar",
  "vientiane": "laos", "luang prabang": "laos",
  "taipei": "taiwan",
  "singapore": "singapore",
  "hong kong": "hong kong",
  "port moresby": "papua new guinea",
};

export function parseLocation(input: string): {
  country: string;
  city?: string;
  state?: string;
} {
  const normalized = input.toLowerCase().trim();
  const parts = normalized.split(",").map((p) => p.trim());

  if (parts.length === 1) {
    const single = parts[0];
    if (tippingDatabase[single]) {
      return { country: single };
    }
    if (usStates[single]) {
      return { country: "united states", state: single };
    }
    if (canadianProvinces[single]) {
      return { country: "canada", state: single };
    }
    if (europeanCountries[single]) {
      return { country: single };
    }
    const usCities = tippingDatabase["united states"]?.cityOverrides;
    if (usCities && usCities[single]) {
      return { country: "united states", city: single };
    }
    if (cityToCountry[single]) {
      return { country: cityToCountry[single], city: single };
    }
    return { country: single };
  }

  if (parts.length === 2) {
    const [first, second] = parts;
    if (tippingDatabase[second]) {
      return { country: second, city: first };
    }
    if (usStates[second]) {
      return { country: "united states", state: second, city: first };
    }
    if (canadianProvinces[second]) {
      return { country: "canada", state: second, city: first };
    }
    if (europeanCountries[second]) {
      return { country: second, city: first };
    }
    if (usStates[first]) {
      return { country: "united states", state: first };
    }
    return { country: second, city: first };
  }

  if (parts.length >= 3) {
    const city = parts[0];
    const state = parts[1];
    const country = parts.slice(2).join(", ");
    if (tippingDatabase[country]) {
      return { country, state, city };
    }
    if (country === "usa" || country === "us" || country === "united states") {
      return { country: "united states", state, city };
    }
    return { country, state, city };
  }

  return { country: normalized };
}

export function getRegionData(location: string): RegionData | null {
  const parsed = parseLocation(location);
  const countryData = tippingDatabase[parsed.country];

  if (!countryData) {
    const usData = tippingDatabase["united states"];
    return {
      ...usData,
      regionNote: undefined,
    };
  }

  if (countryData.noTipping) {
    return countryData;
  }

  let services = { ...countryData.services };
  let regionNote = countryData.regionNote;
  let flatServices = countryData.flatServices ? { ...countryData.flatServices } : undefined;

  if (parsed.city && countryData.cityOverrides) {
    const cityData = countryData.cityOverrides[parsed.city];
    if (cityData) {
      services = { ...services, ...cityData };
    }
  }

  if (parsed.city && countryData.cityFlatOverrides) {
    const cityFlatData = countryData.cityFlatOverrides[parsed.city];
    if (cityFlatData) {
      flatServices = { ...(flatServices || {}), ...cityFlatData };
    }
  }

  if (parsed.city && countryData.cityNotes) {
    const cityNote = countryData.cityNotes[parsed.city];
    if (cityNote) {
      regionNote = cityNote;
    }
  }

  if (services["hotels_general"] && !services["hotels"]) {
    services["hotels"] = services["hotels_general"];
  }
  if (services["transportation_taxi"] && !services["transportation"]) {
    services["transportation"] = services["transportation_taxi"];
  }

  return {
    ...countryData,
    services,
    flatServices,
    regionNote,
  };
}

export function getCurrencySymbol(location: string): string {
  const data = getRegionData(location);
  return data?.currencySymbol || "$";
}

export const SERVICE_TYPES = [
  { label: "Restaurant", value: "restaurant", subOptions: [
    { label: "Sit down", value: "restaurant_sitdown" },
    { label: "Take out", value: "restaurant_takeout" },
  ]},
  { label: "Hotels & Hospitality", value: "hotels", subOptions: [
    { label: "General services", value: "hotels_general" },
    { label: "Bellhop/Porter", value: "hotels_bellhop" },
    { label: "Housekeeping", value: "hotels_housekeeping" },
    { label: "Concierge", value: "hotels_concierge" },
    { label: "Valet Parking", value: "hotels_valet" },
    { label: "Room Service", value: "hotels_roomservice" },
  ]},
  { label: "Beauty", value: "beauty", subOptions: [
    { label: "Manicure/Pedicure", value: "beauty_manicure" },
    { label: "Hair", value: "beauty_hair" },
    { label: "Makeup", value: "beauty_makeup" },
    { label: "Massage", value: "beauty_massage" },
    { label: "Spa", value: "beauty_spa" },
    { label: "Tattoo", value: "beauty_tattoo" },
  ]},
  { label: "Delivery (food)", value: "delivery" },
  { label: "Bars/Bartenders", value: "bars" },
  { label: "Transportation", value: "transportation", subOptions: [
    { label: "Taxi/Rideshare", value: "transportation_taxi" },
    { label: "Airport Shuttle", value: "transportation_shuttle" },
    { label: "Airport Porter", value: "transportation_porter" },
    { label: "Private Car/Limo", value: "transportation_limo" },
  ]},
  { label: "Tours", value: "tours" },
  { label: "Movers", value: "movers" },
  { label: "Cruise Services", value: "cruise", subOptions: [
    { label: "Room Steward", value: "cruise_steward" },
    { label: "Dining Staff", value: "cruise_dining" },
    { label: "Bartender", value: "cruise_bartender" },
    { label: "Shore Excursion Guide", value: "cruise_excursion" },
    { label: "Spa/Salon Services", value: "cruise_spa" },
    { label: "Butler Service", value: "cruise_butler" },
  ]},
];
