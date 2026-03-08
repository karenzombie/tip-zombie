import { parseLocation } from "./tipping-data";

export type BannerType = "INFO" | "CAUTION" | "NO_TIP" | "OPTIONAL";

export interface BannerMessage {
  message: string;
  type: BannerType;
}

function serviceCategory(serviceKey: string): string {
  if (serviceKey === "restaurant_sitdown") return "REST_SD";
  if (serviceKey === "restaurant_takeout") return "REST_TO";
  if (serviceKey.startsWith("hotels_")) return "HOTEL_" + serviceKey.replace("hotels_", "").toUpperCase();
  if (serviceKey === "hotels") return "HOTEL";
  if (serviceKey.startsWith("beauty_")) return "BEAUTY";
  if (serviceKey === "delivery") return "DELIVERY";
  if (serviceKey === "bars") return "BARS";
  if (serviceKey.startsWith("transportation_")) {
    const sub = serviceKey.replace("transportation_", "");
    if (sub === "shuttle") return "TRANS_SHUTTLE";
    if (sub === "limo") return "TRANS_LIMO";
    return "TRANS";
  }
  if (serviceKey === "tours") return "TOURS";
  if (serviceKey === "movers") return "MOVERS";
  if (serviceKey.startsWith("cruise_")) return "CRUISE";
  return "ALL_OTHERS";
}

const US_MAJOR_CITIES = [
  "new york", "nyc", "manhattan", "brooklyn", "queens", "bronx",
  "los angeles", "la", "san francisco", "sf",
  "chicago", "boston", "seattle", "washington", "washington d.c.", "dc",
  "las vegas", "vegas", "miami"
];

interface BannerRule {
  [serviceCategory: string]: BannerMessage;
}

interface CountryBannerData {
  cities?: { [cityPattern: string]: BannerRule };
  services: BannerRule;
}

const bannerMatrix: { [country: string]: CountryBannerData } = {
  "united states": {
    cities: {
      "__us_major__": {
        "REST_SD": { message: "In major US cities, 20-25% is the norm. 18% is considered the minimum for adequate service.", type: "INFO" },
        "BARS": { message: "In major US cities, $2 per drink is the baseline. 20% on tab service is standard.", type: "INFO" },
        "BEAUTY": { message: "In major US cities, 20-25% is expected for beauty services, especially in upscale salons.", type: "INFO" },
        "TRANS": { message: "In major US cities, $2-3 minimum tip or 20% of fare — whichever is greater — is standard.", type: "INFO" },
      },
    },
    services: {
      "REST_SD": { message: "US restaurant tipping: 18-20% is now the standard for good service. 15% may be considered low.", type: "INFO" },
      "REST_TO": { message: "Takeout tipping is optional but appreciated. 10-15% is a kind gesture for counter or app-based orders.", type: "INFO" },
      "HOTEL_BELLHOP": { message: "Bellhop tip: $1-2 per bag is standard in the US.", type: "INFO" },
      "HOTEL_HOUSEKEEPING": { message: "Housekeeping is often overlooked. $2-5 per night is standard; $5-10 at upscale hotels.", type: "INFO" },
      "HOTEL_VALET": { message: "$2-5 when your car is retrieved is customary. Tipping at drop-off is optional.", type: "INFO" },
      "HOTEL_CONCIERGE": { message: "$5-10 for basic assistance; $20-50 for hard-to-get reservations or complex requests.", type: "INFO" },
      "HOTEL_ROOMSERVICE": { message: "Room service: 15-20% if a service charge is not already included on the bill. Check first.", type: "CAUTION" },
      "HOTEL_GENERAL": { message: "Hotel tipping in the US: $2-5 per night housekeeping, $1-2 per bag for bellhop.", type: "INFO" },
      "BEAUTY": { message: "US beauty services: 20% is now the standard. 15% is acceptable for basic services.", type: "INFO" },
      "DELIVERY": { message: "Delivery tipping: 15-20% or a $3-5 minimum, whichever is greater, is standard.", type: "INFO" },
      "BARS": { message: "$1-2 per drink at a bar is standard. For table service, 15-20% of the tab.", type: "INFO" },
      "TRANS": { message: "Taxi/rideshare tipping: 15-20% is standard. $2 minimum for short trips.", type: "INFO" },
      "TRANS_SHUTTLE": { message: "$1-3 per bag or 15-20% of the fare is customary for airport shuttle drivers.", type: "INFO" },
      "TRANS_LIMO": { message: "Private car/limo tipping: 15-20% of the total fare is expected.", type: "INFO" },
      "TOURS": { message: "Tour guide tipping: $5-10 per person for a half-day tour; $10-20 per person for a full-day tour.", type: "INFO" },
      "MOVERS": { message: "Movers: $20-40 per mover for a half-day move; $40-60 per mover for a full day. Cash is preferred.", type: "INFO" },
      "CRUISE": { message: "Most cruise lines apply automatic daily gratuities ($15-20/person/day). Check your cruise account before tipping additional amounts.", type: "CAUTION" },
      "ALL_OTHERS": { message: "US tipping: 15-20% is standard for most services.", type: "INFO" },
    },
  },

  "canada": {
    services: {
      "REST_SD": { message: "Canadian restaurant tipping mirrors the US: 15-20% is standard. In Toronto and Vancouver, 18-20% is expected.", type: "INFO" },
      "REST_TO": { message: "Takeout tipping is optional in Canada. 10-15% is appreciated.", type: "INFO" },
      "BEAUTY": { message: "15-20% is standard for beauty services across Canada.", type: "INFO" },
      "BARS": { message: "$1-2 per drink or 15-20% on tab service is standard in Canada.", type: "INFO" },
      "TRANS": { message: "15-20% for taxis and rideshare in Canada. Round up for short trips.", type: "INFO" },
      "TOURS": { message: "Tour guides: $10-20 per person per day is expected in Canada.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping in Canada mirrors US standards: $2-5 per night housekeeping, $1-2 per bag for bellhop.", type: "INFO" },
      "ALL_OTHERS": { message: "Canadian tipping mirrors US customs: 15-20% is standard for most services.", type: "INFO" },
    },
  },

  "mexico": {
    services: {
      "REST_SD": { message: "Tourist areas and resorts: 15-20% is expected. Local restaurants and smaller spots: 10-15% is acceptable.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected in Mexico. $1-2 per bag for bellhop; $1-2 per night for housekeeping.", type: "INFO" },
      "TRANS": { message: "Taxis in Mexico: tipping is not mandatory but 10-15% is appreciated. Agree on fare before riding.", type: "INFO" },
      "TOURS": { message: "Tour guide tipping: 10-15% of the tour cost is customary in Mexico.", type: "INFO" },
      "BEAUTY": { message: "10-15% is standard for beauty services in Mexico.", type: "INFO" },
      "ALL_OTHERS": { message: "Tipping in Mexico: 10-15% is standard at local spots; 15-20% in tourist areas.", type: "INFO" },
    },
  },

  "united kingdom": {
    cities: {
      "london": {
        "REST_SD": { message: "London restaurants commonly add a 12.5% service charge. Check your bill carefully — if included, no additional tip is needed.", type: "CAUTION" },
      },
    },
    services: {
      "REST_SD": { message: "Always check your bill — many UK restaurants add a 10-12.5% discretionary service charge. If included, an additional tip is not expected.", type: "CAUTION" },
      "REST_TO": { message: "Takeout tipping is not expected in the UK.", type: "OPTIONAL" },
      "BARS": { message: "Tipping at UK bars is uncommon. Offering to 'buy the barman a drink' is a traditional gesture instead.", type: "INFO" },
      "BEAUTY": { message: "10-15% is appreciated for beauty services in the UK, though not always expected. £5-10 flat for shorter appointments.", type: "OPTIONAL" },
      "TRANS": { message: "London black cabs: round up or add 10-15%. Ride-hailing services like Uber are app-tipped.", type: "INFO" },
      "HOTEL": { message: "Tipping at UK hotels is not required but appreciated. £1-2 per bag for porters; £1-2 per night for housekeeping in upscale hotels.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: £5-10 per person for a half-day; £10-15 for a full day is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping in the UK is appreciated but not obligatory. 10-15% for good service is a kind gesture.", type: "OPTIONAL" },
    },
  },

  "france": {
    services: {
      "REST_SD": { message: "Service is legally included in all French bills (service compris). An extra tip is not required. Leaving €1-2 or rounding up for excellent service is a warm gesture.", type: "CAUTION" },
      "REST_TO": { message: "Tipping for takeout is not expected in France.", type: "NO_TIP" },
      "BARS": { message: "Rounding up to the nearest euro is common at French cafés and bars. A formal tip is not expected.", type: "OPTIONAL" },
      "BEAUTY": { message: "Tipping is not common at French salons. Leaving €2-5 for exceptional work is appreciated but not expected.", type: "OPTIONAL" },
      "TRANS": { message: "Taxi tipping is not required in France. Rounding up the fare is a common courtesy.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel staff in France do not expect tips. €1-2 for a porter or €1-2 per night for housekeeping at upscale hotels is appreciated.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: €5-10 per person for a half-day; €10-15 for a full day is appreciated, though not expected.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping in France is not obligatory. Service charges are included by law. Small rounding-up gestures are always welcome.", type: "OPTIONAL" },
    },
  },

  "germany": {
    services: {
      "REST_SD": { message: "Rounding up or adding 5-10% is the norm in Germany. Say the total amount when paying — handing over extra and saying 'stimmt so' means 'keep the change.'", type: "INFO" },
      "BARS": { message: "Round up to the nearest euro at German bars. A formal tip percentage is not expected.", type: "OPTIONAL" },
      "BEAUTY": { message: "€5-10 flat for hair or nail services is common in Germany. Percentage-based tipping is unusual.", type: "OPTIONAL" },
      "TRANS": { message: "German taxis: round up the fare or add 5-10% for good service.", type: "OPTIONAL" },
      "HOTEL": { message: "Tipping hotel staff is not common in Germany. €1-2 for a porter is a kind gesture at upscale hotels.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: €5-10 per person for a half or full day is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping in Germany: rounding up or adding 5-10% is appreciated. Not tipping is not considered rude.", type: "OPTIONAL" },
    },
  },

  "austria": {
    services: {
      "REST_SD": { message: "Rounding up or adding 5-10% is the norm in Germany. Say the total amount when paying — handing over extra and saying 'stimmt so' means 'keep the change.'", type: "INFO" },
      "BARS": { message: "Round up to the nearest euro at German bars. A formal tip percentage is not expected.", type: "OPTIONAL" },
      "BEAUTY": { message: "€5-10 flat for hair or nail services is common in Germany. Percentage-based tipping is unusual.", type: "OPTIONAL" },
      "TRANS": { message: "German taxis: round up the fare or add 5-10% for good service.", type: "OPTIONAL" },
      "HOTEL": { message: "Tipping hotel staff is not common in Germany. €1-2 for a porter is a kind gesture at upscale hotels.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: €5-10 per person for a half or full day is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping in Germany: rounding up or adding 5-10% is appreciated. Not tipping is not considered rude.", type: "OPTIONAL" },
    },
  },

  "switzerland": {
    services: {
      "REST_SD": { message: "Service charges are typically included in Swiss bills. Rounding up or leaving 5-10% for excellent service is customary but not required. Currency: CHF.", type: "CAUTION" },
      "TRANS": { message: "Swiss taxis: rounding up the fare is common. No formal tip percentage is expected.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not common in Switzerland. A small tip for exceptional service is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping in Switzerland is optional. Service charges are typically included. Round up for good service.", type: "OPTIONAL" },
    },
  },

  "italy": {
    services: {
      "REST_SD": { message: "Many Italian restaurants charge a coperto (cover charge) of €1-3 per person — this is not a tip. An additional 5-10% for good service is appreciated but not required.", type: "CAUTION" },
      "BARS": { message: "At Italian bars, small coins left on the counter (€0.10-0.50) are a traditional gesture. No percentage tip is expected.", type: "OPTIONAL" },
      "BEAUTY": { message: "Tipping is not common at Italian salons. €2-5 for exceptional work is a kind gesture.", type: "OPTIONAL" },
      "TRANS": { message: "Italian taxis: rounding up is sufficient. A formal tip is not expected.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not standard in Italy. €1-2 for a porter at luxury hotels is acceptable.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: €5-10 per person is a nice gesture for a half or full day tour.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping in Italy is not obligatory. The coperto cover charge at restaurants is separate. Small rounding-up gestures are always appreciated.", type: "OPTIONAL" },
    },
  },

  "spain": {
    services: {
      "REST_SD": { message: "Tipping is not mandatory in Spain or Portugal. 5-10% for sit-down restaurants is a kind gesture. At tapas bars, leaving small change is sufficient.", type: "OPTIONAL" },
      "BARS": { message: "Small coins on the bar are customary in Spain. A formal tip is not expected.", type: "OPTIONAL" },
      "BEAUTY": { message: "Tipping at salons is not common in Spain or Portugal. €2-5 for great work is appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up the taxi fare is standard in Spain and Portugal. No formal percentage tip is expected.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not expected. €1-2 for a porter at upscale hotels is acceptable.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping in Spain and Portugal is optional. Small gestures are always welcomed but never required.", type: "OPTIONAL" },
    },
  },

  "portugal": {
    services: {
      "REST_SD": { message: "Tipping is not mandatory in Spain or Portugal. 5-10% for sit-down restaurants is a kind gesture. At tapas bars, leaving small change is sufficient.", type: "OPTIONAL" },
      "BARS": { message: "Small coins on the bar are customary in Spain. A formal tip is not expected.", type: "OPTIONAL" },
      "BEAUTY": { message: "Tipping at salons is not common in Spain or Portugal. €2-5 for great work is appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up the taxi fare is standard in Spain and Portugal. No formal percentage tip is expected.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not expected. €1-2 for a porter at upscale hotels is acceptable.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping in Spain and Portugal is optional. Small gestures are always welcomed but never required.", type: "OPTIONAL" },
    },
  },

  "belgium": {
    services: {
      "REST_SD": { message: "A service charge of 10-15% is generally included in Belgian and Dutch restaurant bills. An additional tip is not required. Rounding up or leaving €1-2 for exceptional service is appreciated.", type: "CAUTION" },
      "BARS": { message: "Rounding up at bars is common in Belgium and the Netherlands. A formal tip is not expected.", type: "OPTIONAL" },
      "BEAUTY": { message: "Tipping is not common at salons in Belgium or the Netherlands. A few euros for excellent service is a warm gesture.", type: "OPTIONAL" },
      "TRANS": { message: "Taxi tipping is not expected. Rounding up to the nearest euro is a common courtesy.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not common. Service is typically included. A small tip for exceptional service is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not obligatory. Service charges are typically included. Rounding up is a kind gesture.", type: "OPTIONAL" },
    },
  },

  "netherlands": {
    services: {
      "REST_SD": { message: "A service charge of 10-15% is generally included in Belgian and Dutch restaurant bills. An additional tip is not required. Rounding up or leaving €1-2 for exceptional service is appreciated.", type: "CAUTION" },
      "BARS": { message: "Rounding up at bars is common in Belgium and the Netherlands. A formal tip is not expected.", type: "OPTIONAL" },
      "BEAUTY": { message: "Tipping is not common at salons in Belgium or the Netherlands. A few euros for excellent service is a warm gesture.", type: "OPTIONAL" },
      "TRANS": { message: "Taxi tipping is not expected. Rounding up to the nearest euro is a common courtesy.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not common. Service is typically included. A small tip for exceptional service is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not obligatory. Service charges are typically included. Rounding up is a kind gesture.", type: "OPTIONAL" },
    },
  },

  "norway": {
    services: {
      "REST_SD": { message: "Tipping is not customary in Scandinavian countries. Service workers receive fair wages. Rounding up or leaving 5% for truly exceptional service is optional but uncommon among locals.", type: "NO_TIP" },
      "BARS": { message: "Tipping at bars is not expected in Scandinavia. Pay the stated price.", type: "NO_TIP" },
      "BEAUTY": { message: "Tipping is not customary at salons in Scandinavia. Workers receive fair wages.", type: "NO_TIP" },
      "TRANS": { message: "Taxi tipping is not expected in Scandinavia. Rounding up is a purely optional gesture.", type: "NO_TIP" },
      "HOTEL": { message: "Hotel tipping is not customary in Scandinavia.", type: "NO_TIP" },
      "TOURS": { message: "Tour guide tipping is not expected but a small amount (50-100 SEK/NOK/DKK) for exceptional service is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not customary in Scandinavia. Workers receive fair wages and do not rely on gratuities.", type: "NO_TIP" },
    },
  },

  "sweden": {
    services: {
      "REST_SD": { message: "Tipping is not customary in Scandinavian countries. Service workers receive fair wages. Rounding up or leaving 5% for truly exceptional service is optional but uncommon among locals.", type: "NO_TIP" },
      "BARS": { message: "Tipping at bars is not expected in Scandinavia. Pay the stated price.", type: "NO_TIP" },
      "BEAUTY": { message: "Tipping is not customary at salons in Scandinavia. Workers receive fair wages.", type: "NO_TIP" },
      "TRANS": { message: "Taxi tipping is not expected in Scandinavia. Rounding up is a purely optional gesture.", type: "NO_TIP" },
      "HOTEL": { message: "Hotel tipping is not customary in Scandinavia.", type: "NO_TIP" },
      "TOURS": { message: "Tour guide tipping is not expected but a small amount (50-100 SEK/NOK/DKK) for exceptional service is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not customary in Scandinavia. Workers receive fair wages and do not rely on gratuities.", type: "NO_TIP" },
    },
  },

  "denmark": {
    services: {
      "REST_SD": { message: "Tipping is not customary in Scandinavian countries. Service workers receive fair wages. Rounding up or leaving 5% for truly exceptional service is optional but uncommon among locals.", type: "NO_TIP" },
      "BARS": { message: "Tipping at bars is not expected in Scandinavia. Pay the stated price.", type: "NO_TIP" },
      "BEAUTY": { message: "Tipping is not customary at salons in Scandinavia. Workers receive fair wages.", type: "NO_TIP" },
      "TRANS": { message: "Taxi tipping is not expected in Scandinavia. Rounding up is a purely optional gesture.", type: "NO_TIP" },
      "HOTEL": { message: "Hotel tipping is not customary in Scandinavia.", type: "NO_TIP" },
      "TOURS": { message: "Tour guide tipping is not expected but a small amount (50-100 SEK/NOK/DKK) for exceptional service is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not customary in Scandinavia. Workers receive fair wages and do not rely on gratuities.", type: "NO_TIP" },
    },
  },

  "finland": {
    services: {
      "REST_SD": { message: "Tipping is not customary in Scandinavian countries. Service workers receive fair wages. Rounding up or leaving 5% for truly exceptional service is optional but uncommon among locals.", type: "NO_TIP" },
      "BARS": { message: "Tipping at bars is not expected in Scandinavia. Pay the stated price.", type: "NO_TIP" },
      "BEAUTY": { message: "Tipping is not customary at salons in Scandinavia. Workers receive fair wages.", type: "NO_TIP" },
      "TRANS": { message: "Taxi tipping is not expected in Scandinavia. Rounding up is a purely optional gesture.", type: "NO_TIP" },
      "HOTEL": { message: "Hotel tipping is not customary in Scandinavia.", type: "NO_TIP" },
      "TOURS": { message: "Tour guide tipping is not expected but a small amount (50-100 SEK/NOK/DKK) for exceptional service is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not customary in Scandinavia. Workers receive fair wages and do not rely on gratuities.", type: "NO_TIP" },
    },
  },

  "iceland": {
    services: {
      "REST_SD": { message: "Tipping is not traditional in Iceland but is increasingly appreciated in tourist areas. 10-15% is a kind gesture for excellent service.", type: "OPTIONAL" },
      "BARS": { message: "Tipping at bars is not expected in Iceland. Rounding up is a kind gesture.", type: "OPTIONAL" },
      "BEAUTY": { message: "Tipping is not customary at salons in Iceland. A small gesture for excellent service is appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Taxi tipping is not expected in Iceland. Rounding up is a purely optional gesture.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not customary in Iceland but appreciated for exceptional service.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guide tipping is increasingly common in Iceland. 10-15% for exceptional service is a kind gesture.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not traditional in Iceland but is increasingly appreciated in tourist areas. 10-15% is a kind gesture for excellent service.", type: "OPTIONAL" },
    },
  },

  "japan": {
    services: {
      "REST_SD": { message: "Tipping is not expected in Japan and may be considered rude. The best way to show appreciation is to thank your server with a bow and arigatou gozaimashita.", type: "NO_TIP" },
      "BEAUTY": { message: "Tipping is not practiced at Japanese salons or spas. Do not leave a tip.", type: "NO_TIP" },
      "TRANS": { message: "Do not tip taxi drivers in Japan. It may cause confusion or be refused.", type: "NO_TIP" },
      "HOTEL": { message: "Tipping hotel staff in Japan is not expected and may be declined. If you wish to show appreciation, a small gift is more culturally appropriate than cash.", type: "NO_TIP" },
      "TOURS": { message: "For private or high-end tour guides in Japan, a tip placed discreetly in an envelope is sometimes accepted but not expected.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not expected in Japan and may be considered rude. The best way to show appreciation is to thank your server with a bow and arigatou gozaimashita.", type: "NO_TIP" },
    },
  },

  "south korea": {
    services: {
      "REST_SD": { message: "Tipping is not customary in South Korea. Service staff may feel uncomfortable accepting tips. Show appreciation with a thank you instead.", type: "NO_TIP" },
      "TOURS": { message: "For tour guides, a small optional tip is appreciated but not expected.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not customary in South Korea. Service staff may feel uncomfortable accepting tips. Show appreciation with a thank you instead.", type: "NO_TIP" },
    },
  },

  "china": {
    services: {
      "REST_SD": { message: "Tipping is not practiced at local Chinese restaurants. International hotels may have different expectations.", type: "NO_TIP" },
      "TOURS": { message: "Tour guides and drivers do expect tips in China, particularly for international tourists. $10-20/day for a guide and $5-10/day for a driver is standard.", type: "INFO" },
      "HOTEL_BELLHOP": { message: "At international or luxury hotels in China, ¥10-30 for a bellhop is acceptable.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not customary in mainland China. International establishments may have different practices.", type: "NO_TIP" },
    },
  },

  "hong kong": {
    services: {
      "REST_SD": { message: "A 10% service charge is typically added to Hong Kong restaurant bills. Check before tipping to avoid double tipping.", type: "CAUTION" },
      "TRANS": { message: "Taxi tipping is not expected in Hong Kong. Rounding up is a courtesy.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel staff in Hong Kong appreciate small tips. HK$10-20 for a porter; HK$10-20/night for housekeeping at upscale hotels.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "A service charge is typically included in Hong Kong bills. Check before adding an additional tip.", type: "CAUTION" },
    },
  },

  "taiwan": {
    services: {
      "REST_SD": { message: "Service charge common in hotels and upscale restaurants. Additional tip occasionally given.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not customary in Taiwan but service charge is common. Additional tipping is optional.", type: "OPTIONAL" },
    },
  },

  "singapore": {
    services: {
      "REST_SD": { message: "A 10% service charge and GST are standard in Singapore. An extra tip for truly exceptional service is welcome but not expected.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not expected in Singapore. Service charges are included. An extra tip for exceptional service is welcome.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "A 10% service charge and GST are standard in Singapore. An extra tip for truly exceptional service is welcome but not expected.", type: "OPTIONAL" },
    },
  },

  "thailand": {
    services: {
      "REST_SD": { message: "In tourist areas and upscale restaurants, 10% is a kind gesture. At local spots, rounding up or leaving small change is sufficient.", type: "INFO" },
      "BEAUTY": { message: "For massage and spa services in Thailand, 50-100 baht (~$1.50-3 USD) for shorter treatments and 10-15% for longer or luxury services is customary.", type: "INFO" },
      "TRANS": { message: "Taxis in Thailand: not required, but rounding up the metered fare is common. Agree on fare or insist on meter first.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping: 20-50 baht per bag for porters; 20-50 baht per night for housekeeping in tourist areas.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: 100-200 baht ($3-6 USD) per person for a half-day; 200-300 baht for a full day is standard.", type: "INFO" },
      "ALL_OTHERS": { message: "Tipping is appreciated but not mandatory in Thailand. Small gestures in tourist areas are welcomed.", type: "OPTIONAL" },
    },
  },

  "vietnam": {
    services: {
      "REST_SD": { message: "5-10% at restaurants in cities and tourist areas is appreciated if no service charge is included. Check your bill first.", type: "CAUTION" },
      "BEAUTY": { message: "Spa and massage tipping: 5-10% is standard. 10,000-20,000 VND extra for basic services is a common gesture.", type: "INFO" },
      "TRANS": { message: "Taxis and rideshare: rounding up or a small flat tip is appreciated. Use metered taxis or reputable apps.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not expected but small amounts for porters (20,000-50,000 VND) are appreciated.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: 50,000-100,000 VND (~$2-4 USD) per person for a half or full day is appropriate.", type: "INFO" },
      "ALL_OTHERS": { message: "Tipping is increasingly common in Vietnam's cities and tourist areas. Small gestures are always appreciated.", type: "OPTIONAL" },
    },
  },

  "indonesia": {
    services: {
      "REST_SD": { message: "5-10% at tourist-area restaurants is appreciated if no service charge is added. Local spots don't expect tips.", type: "OPTIONAL" },
      "BEAUTY": { message: "Small flat tips (50,000-100,000 IDR in Indonesia) for spa and massage services are appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up or a small flat tip for drivers is a kind gesture. Not expected.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: $5-10 per person per day is a standard and appreciated tip.", type: "INFO" },
      "ALL_OTHERS": { message: "Tipping is appreciated in tourist areas but not expected. Small gestures go a long way.", type: "OPTIONAL" },
    },
  },

  "cambodia": {
    services: {
      "REST_SD": { message: "5-10% at tourist-area restaurants is appreciated if no service charge is added. Local spots don't expect tips.", type: "OPTIONAL" },
      "BEAUTY": { message: "Small flat tips ($1-5 USD equivalent) for spa and massage services are appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up or a small flat tip for drivers is a kind gesture. Not expected.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: $5-10 per person per day is a standard and appreciated tip.", type: "INFO" },
      "ALL_OTHERS": { message: "Tipping is appreciated in tourist areas but not expected. Small gestures go a long way.", type: "OPTIONAL" },
    },
  },

  "laos": {
    services: {
      "REST_SD": { message: "5-10% at tourist-area restaurants is appreciated if no service charge is added. Local spots don't expect tips.", type: "OPTIONAL" },
      "BEAUTY": { message: "Small flat tips ($1-5 USD equivalent) for spa and massage services are appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up or a small flat tip for drivers is a kind gesture. Not expected.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: $5-10 per person per day is a standard and appreciated tip.", type: "INFO" },
      "ALL_OTHERS": { message: "Tipping is appreciated in tourist areas but not expected. Small gestures go a long way.", type: "OPTIONAL" },
    },
  },

  "myanmar": {
    services: {
      "REST_SD": { message: "5-10% at tourist-area restaurants is appreciated if no service charge is added. Local spots don't expect tips.", type: "OPTIONAL" },
      "BEAUTY": { message: "Small flat tips ($1-5 USD equivalent) for spa and massage services are appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up or a small flat tip for drivers is a kind gesture. Not expected.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: $5-10 per person per day is a standard and appreciated tip.", type: "INFO" },
      "ALL_OTHERS": { message: "Tipping is appreciated in tourist areas but not expected. Small gestures go a long way.", type: "OPTIONAL" },
    },
  },

  "malaysia": {
    services: {
      "REST_SD": { message: "A 10% service charge is commonly added to Malaysian and Philippine restaurant bills. Check before tipping.", type: "CAUTION" },
      "BEAUTY": { message: "5-10% is appreciated for beauty services. Not always expected.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up or a small flat tip for taxis and rideshare is appreciated but not required.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "A service charge is typically included. Small tips for exceptional service are always welcome.", type: "CAUTION" },
    },
  },

  "philippines": {
    services: {
      "REST_SD": { message: "A 10% service charge is commonly added to Malaysian and Philippine restaurant bills. Check before tipping.", type: "CAUTION" },
      "BEAUTY": { message: "5-10% is appreciated for beauty services. Not always expected.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up or a small flat tip for taxis and rideshare is appreciated but not required.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "A service charge is typically included. Small tips for exceptional service are always welcome.", type: "CAUTION" },
    },
  },

  "india": {
    services: {
      "REST_SD": { message: "10-15% is standard at sit-down restaurants in India, even if a service charge is included — it may not reach the server directly.", type: "INFO" },
      "BEAUTY": { message: "10-15% is appreciated for beauty and personal care services in India's cities.", type: "INFO" },
      "TRANS": { message: "Auto-rickshaws and taxis: rounding up or 10% is appreciated. Negotiate fare before the ride.", type: "OPTIONAL" },
      "HOTEL": { message: "$1-2 equivalent per bag for porters; $1-2 per night for housekeeping is standard at mid-range and upscale hotels.", type: "INFO" },
      "TOURS": { message: "Tour guides: 10-15% of the tour cost or $5-10 per person per day is expected.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is customary for most service industries in India. Cash tips are preferred.", type: "INFO" },
    },
  },

  "australia": {
    services: {
      "REST_SD": { message: "Tipping is not expected in Australia — service workers receive fair wages. 10-15% for exceptional service is entirely optional.", type: "OPTIONAL" },
      "BARS": { message: "Tipping at Australian bars is not expected. Rounding up is a kind gesture.", type: "OPTIONAL" },
      "BEAUTY": { message: "Tipping at Australian salons is not expected. A small gesture for excellent service is appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Taxi and rideshare tipping is not expected in Australia. Rounding up is a courtesy.", type: "OPTIONAL" },
      "HOTEL": { message: "Hotel tipping is not customary in Australia but appreciated for exceptional service.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guide tipping is not expected but 10-15% for exceptional service is a welcome gesture.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not expected in Australia — service workers receive fair wages. 10-15% for exceptional service is entirely optional.", type: "OPTIONAL" },
    },
  },

  "new zealand": {
    services: {
      "REST_SD": { message: "Tipping is not required in New Zealand. 10-15% is a welcome gesture for exceptional service.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "Tipping is not required in New Zealand. 10-15% is a welcome gesture for exceptional service.", type: "OPTIONAL" },
    },
  },

  "united arab emirates": {
    services: {
      "REST_SD": { message: "A 10% service charge is typically included in UAE restaurant bills. An additional 10-15% tip is still expected and appreciated, especially in Dubai.", type: "CAUTION" },
      "BEAUTY": { message: "10-15% for beauty services is expected in Dubai and Abu Dhabi.", type: "INFO" },
      "TRANS": { message: "Dubai taxis: rounding up is sufficient for short trips. 10% for longer rides or if luggage is handled.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected in the UAE. $1-2 per bag for porters; $2-5 per night for housekeeping is standard.", type: "INFO" },
      "TOURS": { message: "Tour guides: 10-15% is expected in the UAE.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services in the UAE. Service charges are often included — check your bill first.", type: "CAUTION" },
    },
  },

  "qatar": {
    services: {
      "REST_SD": { message: "Service charges are often included. An additional 15-20% tip is customary and expected at restaurants in Qatar and Saudi Arabia.", type: "CAUTION" },
      "HOTEL": { message: "Hotel staff tipping is expected. $2-5 per night for housekeeping; $1-2 per bag for porters.", type: "INFO" },
      "ALL_OTHERS": { message: "15-20% is customary for most services. Check bills for included service charges.", type: "CAUTION" },
    },
  },

  "saudi arabia": {
    services: {
      "REST_SD": { message: "Service charges are often included. An additional 15-20% tip is customary and expected at restaurants in Qatar and Saudi Arabia.", type: "CAUTION" },
      "HOTEL": { message: "Hotel staff tipping is expected. $2-5 per night for housekeeping; $1-2 per bag for porters.", type: "INFO" },
      "ALL_OTHERS": { message: "15-20% is customary for most services. Check bills for included service charges.", type: "CAUTION" },
    },
  },

  "jordan": {
    services: {
      "REST_SD": { message: "10-15% at sit-down restaurants is expected. Check your bill for included service charges to avoid double tipping.", type: "CAUTION" },
      "TOURS": { message: "Tour guide tipping is important in this region. $10-20 per person per day for guides; $5-10 for drivers is standard.", type: "INFO" },
      "TRANS": { message: "Tipping taxi drivers 10% or rounding up is expected.", type: "INFO" },
      "HOTEL": { message: "$1-2 per bag for porters; $1-2 per night for housekeeping is standard.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is standard for most services. Cash tips are preferred.", type: "INFO" },
    },
  },

  "egypt": {
    services: {
      "REST_SD": { message: "10-15% at sit-down restaurants is expected. Check your bill for included service charges to avoid double tipping.", type: "CAUTION" },
      "TOURS": { message: "Tour guide tipping is important in this region. $10-20 per person per day for guides; $5-10 for drivers is standard.", type: "INFO" },
      "TRANS": { message: "Tipping taxi drivers 10% or rounding up is expected.", type: "INFO" },
      "HOTEL": { message: "$1-2 per bag for porters; $1-2 per night for housekeeping is standard.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is standard for most services. Cash tips are preferred.", type: "INFO" },
    },
  },

  "morocco": {
    services: {
      "REST_SD": { message: "10-15% at sit-down restaurants is expected. Check your bill for included service charges to avoid double tipping.", type: "CAUTION" },
      "TOURS": { message: "Tour guide tipping is important in this region. $10-20 per person per day for guides; $5-10 for drivers is standard.", type: "INFO" },
      "TRANS": { message: "Tipping taxi drivers 10% or rounding up is expected.", type: "INFO" },
      "HOTEL": { message: "$1-2 per bag for porters; $1-2 per night for housekeeping is standard.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is standard for most services. Cash tips are preferred.", type: "INFO" },
    },
  },

  "israel": {
    services: {
      "REST_SD": { message: "A service charge is often included in Israeli restaurant bills. An additional 10-15% tip is still common and appreciated, particularly in Tel Aviv.", type: "CAUTION" },
      "TRANS": { message: "Taxi tipping is not required in Israel but 10% is appreciated.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "10-15% for most services is appreciated in Israel. Check bills for service charges.", type: "CAUTION" },
    },
  },

  "turkey": {
    services: {
      "REST_SD": { message: "5-10% at restaurants is standard in Turkey, typically left as coins or by rounding up. 10-15% in tourist areas.", type: "INFO" },
      "BEAUTY": { message: "Small tips (equivalent of €2-5) for hair and personal care services are appreciated in Turkey.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up taxi fares is standard in Turkey. No formal tip percentage is expected.", type: "OPTIONAL" },
      "TOURS": { message: "Tour guides: 10-15% or $5-10 per person is appreciated.", type: "INFO" },
      "ALL_OTHERS": { message: "5-10% for most services is customary in Turkey. Cash tips are preferred.", type: "INFO" },
    },
  },

  "south africa": {
    services: {
      "REST_SD": { message: "10-15% is expected at sit-down restaurants in South Africa.", type: "INFO" },
      "TOURS": { message: "Safari guides and drivers: 10-15% per day is customary. $10-20 per person per day for a guide; $5-10 for a driver is standard.", type: "INFO" },
      "TRANS": { message: "10-15% for taxis is standard in South Africa. Agree on fare before the ride.", type: "INFO" },
      "HOTEL": { message: "$1-2 equivalent per bag for porters; $1-2 per night for housekeeping is appreciated.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services in South Africa.", type: "INFO" },
    },
  },

  "kenya": {
    services: {
      "REST_SD": { message: "10-15% is expected at sit-down restaurants in this region.", type: "INFO" },
      "TOURS": { message: "Tipping guides and drivers is an important part of the safari experience. $10-20 per person per day for a guide; $5-10 for a driver is the standard range.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services across East and Southern Africa.", type: "INFO" },
    },
  },

  "tanzania": {
    services: {
      "REST_SD": { message: "10-15% is expected at sit-down restaurants in this region.", type: "INFO" },
      "TOURS": { message: "Tipping guides and drivers is an important part of the safari experience. $10-20 per person per day for a guide; $5-10 for a driver is the standard range.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services across East and Southern Africa.", type: "INFO" },
    },
  },

  "botswana": {
    services: {
      "REST_SD": { message: "10-15% is expected at sit-down restaurants in this region.", type: "INFO" },
      "TOURS": { message: "Tipping guides and drivers is an important part of the safari experience. $10-20 per person per day for a guide; $5-10 for a driver is the standard range.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services across East and Southern Africa.", type: "INFO" },
    },
  },

  "namibia": {
    services: {
      "REST_SD": { message: "10-15% is expected at sit-down restaurants in this region.", type: "INFO" },
      "TOURS": { message: "Tipping guides and drivers is an important part of the safari experience. $10-20 per person per day for a guide; $5-10 for a driver is the standard range.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services across East and Southern Africa.", type: "INFO" },
    },
  },

  "uganda": {
    services: {
      "REST_SD": { message: "10-15% is expected at sit-down restaurants in this region.", type: "INFO" },
      "TOURS": { message: "Tipping guides and drivers is an important part of the safari experience. $10-20 per person per day for a guide; $5-10 for a driver is the standard range.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services across East and Southern Africa.", type: "INFO" },
    },
  },

  "rwanda": {
    services: {
      "REST_SD": { message: "10-15% is expected at sit-down restaurants in this region.", type: "INFO" },
      "TOURS": { message: "Tipping guides and drivers is an important part of the safari experience. $10-20 per person per day for a guide; $5-10 for a driver is the standard range.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services across East and Southern Africa.", type: "INFO" },
    },
  },

  "zimbabwe": {
    services: {
      "REST_SD": { message: "10-15% is expected at sit-down restaurants in this region.", type: "INFO" },
      "TOURS": { message: "Tipping guides and drivers is an important part of the safari experience. $10-20 per person per day for a guide; $5-10 for a driver is the standard range.", type: "INFO" },
      "HOTEL": { message: "Hotel tipping is expected. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% is expected for most services across East and Southern Africa.", type: "INFO" },
    },
  },

  "bahamas": { services: { ...caribbeanServices() } },
  "barbados": { services: { ...caribbeanServices() } },
  "st. lucia": { services: { ...caribbeanServices() } },
  "saint lucia": { services: { ...caribbeanServices() } },
  "aruba": { services: { ...caribbeanServices() } },
  "cayman islands": { services: { ...caribbeanServices() } },
  "antigua": { services: { ...caribbeanServices() } },
  "antigua and barbuda": { services: { ...caribbeanServices() } },
  "grenada": { services: { ...caribbeanServices() } },
  "st. kitts": { services: { ...caribbeanServices() } },
  "saint kitts and nevis": { services: { ...caribbeanServices() } },
  "st. vincent": { services: { ...caribbeanServices() } },
  "saint vincent and the grenadines": { services: { ...caribbeanServices() } },
  "turks and caicos": { services: { ...caribbeanServices() } },

  "jamaica": {
    services: {
      "REST_SD": { message: "10-15% is expected in Jamaica. Service charges are often added automatically — check your bill.", type: "CAUTION" },
      ...caribbeanServicesOther(),
    },
  },

  "dominican republic": {
    services: {
      "REST_SD": { message: "A 10% service charge is usually included. An additional 10% tip is still customary and appreciated.", type: "CAUTION" },
      ...caribbeanServicesOther(),
    },
  },

  "brazil": {
    services: {
      "REST_SD": { message: "A 10% service charge (taxa de serviço) is commonly included in Brazilian restaurant bills. An additional tip is optional but appreciated for excellent service.", type: "CAUTION" },
      "TRANS": { message: "Taxi tipping is not expected in Brazil. Rounding up is a courtesy.", type: "OPTIONAL" },
      "BEAUTY": { message: "10-15% is appreciated for beauty services in Brazil.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "A 10% service charge is often included. Small additional tips are appreciated.", type: "CAUTION" },
    },
  },

  "argentina": {
    services: {
      "REST_SD": { message: "10% at restaurants is standard in Argentina and Chile. Given Argentina's inflation, a slightly higher tip is always welcomed.", type: "INFO" },
      "BEAUTY": { message: "10-15% for beauty and personal care services is appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up or leaving 10% for taxis is customary.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "10% for most services is standard across Argentina and Chile.", type: "INFO" },
    },
  },

  "chile": {
    services: {
      "REST_SD": { message: "10% at restaurants is standard in Argentina and Chile. Given Argentina's inflation, a slightly higher tip is always welcomed.", type: "INFO" },
      "BEAUTY": { message: "10-15% for beauty and personal care services is appreciated.", type: "OPTIONAL" },
      "TRANS": { message: "Rounding up or leaving 10% for taxis is customary.", type: "OPTIONAL" },
      "ALL_OTHERS": { message: "10% for most services is standard across Argentina and Chile.", type: "INFO" },
    },
  },

  "colombia": {
    services: {
      "REST_SD": { message: "Tipping in Colombia mirrors US standards: 15-20% is expected. A 10% service charge is sometimes included — check your bill.", type: "CAUTION" },
      "ALL_OTHERS": { message: "15-20% is standard for most services in Colombia.", type: "INFO" },
    },
  },

  "peru": {
    services: {
      "REST_SD": { message: "10-15% at sit-down restaurants in cities and tourist areas is appreciated.", type: "INFO" },
      "TOURS": { message: "Tour guides: 10-15% or $5-10 per person is standard.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% for most services is appreciated.", type: "INFO" },
    },
  },

  "costa rica": {
    services: {
      "REST_SD": { message: "A 10% service charge (servicio) is legally required on Costa Rican restaurant bills. An extra tip is not expected but appreciated for exceptional service.", type: "CAUTION" },
      "TOURS": { message: "Tour guides: 10-15% or $5-10 per person is standard.", type: "INFO" },
      "ALL_OTHERS": { message: "10-15% for most services is appreciated.", type: "INFO" },
    },
  },

  "poland": { services: { ...easternEuropeServices() } },
  "czech republic": { services: { ...easternEuropeServices() } },
  "czechia": { services: { ...easternEuropeServices() } },
  "hungary": { services: { ...easternEuropeServices() } },
  "croatia": { services: { ...easternEuropeServices() } },
  "romania": { services: { ...easternEuropeServices() } },
  "bulgaria": { services: { ...easternEuropeServices() } },
  "serbia": { services: { ...easternEuropeServices() } },
  "slovenia": { services: { ...easternEuropeServices() } },
  "slovakia": { services: { ...easternEuropeServices() } },
  "bosnia": { services: { ...easternEuropeServices() } },
  "bosnia and herzegovina": { services: { ...easternEuropeServices() } },
  "albania": { services: { ...easternEuropeServices() } },

  "russia": {
    services: {
      "REST_SD": { message: "10-15% at restaurants is standard in Russia's cities. Rounding up is also common.", type: "INFO" },
      "ALL_OTHERS": { message: "10% for most services is customary in Russia. Cash is preferred.", type: "INFO" },
    },
  },
};

function caribbeanServices(): BannerRule {
  return {
    "REST_SD": { message: "Many Caribbean restaurants automatically add a 10-15% service charge. Check your bill before tipping to avoid double tipping.", type: "CAUTION" },
    "HOTEL": { message: "Hotel tipping is expected throughout the Caribbean. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
    "TRANS": { message: "Taxi tipping: 10-15% is appreciated throughout the Caribbean.", type: "INFO" },
    "TOURS": { message: "Tour guides: 10-15% or $5-10 per person is standard throughout the Caribbean.", type: "INFO" },
    "ALL_OTHERS": { message: "10-15% is expected for most services. Service charges are often included at restaurants — check before tipping.", type: "CAUTION" },
  };
}

function caribbeanServicesOther(): BannerRule {
  return {
    "HOTEL": { message: "Hotel tipping is expected throughout the Caribbean. $1-2 per bag for porters; $1-2 per night for housekeeping.", type: "INFO" },
    "TRANS": { message: "Taxi tipping: 10-15% is appreciated throughout the Caribbean.", type: "INFO" },
    "TOURS": { message: "Tour guides: 10-15% or $5-10 per person is standard throughout the Caribbean.", type: "INFO" },
    "ALL_OTHERS": { message: "10-15% is expected for most services. Service charges are often included at restaurants — check before tipping.", type: "CAUTION" },
  };
}

function easternEuropeServices(): BannerRule {
  return {
    "REST_SD": { message: "10-15% at sit-down restaurants is appreciated across Eastern Europe. Rounding up is also common.", type: "INFO" },
    "TRANS": { message: "Rounding up or leaving 10% for taxis is a kind gesture.", type: "OPTIONAL" },
    "BEAUTY": { message: "Small tips (€2-5 equivalent) for hair and personal care services are appreciated.", type: "OPTIONAL" },
    "ALL_OTHERS": { message: "Tipping is appreciated but not obligatory in Eastern Europe. 10-15% for good service is a kind gesture.", type: "OPTIONAL" },
  };
}

const CRUISE_OVERRIDE: BannerMessage = {
  message: "Most cruise lines apply automatic daily gratuities ($15-20 USD per person per day). Check your cruise account balance before tipping additional amounts to avoid over-tipping.",
  type: "CAUTION",
};

const DEFAULT_FALLBACK: BannerMessage = {
  message: "Tipping customs vary by location. Review the Tip Guide tab for country-specific recommendations.",
  type: "INFO",
};

function isUSMajorCity(city: string): boolean {
  const cityLower = city.toLowerCase().trim();
  return US_MAJOR_CITIES.some(c => cityLower.includes(c));
}

export function getBannerMessages(
  location: string,
  serviceKey: string
): BannerMessage[] {
  const parsed = parseLocation(location);
  const country = parsed.country.toLowerCase();
  const city = parsed.city?.toLowerCase() || "";
  const cat = serviceCategory(serviceKey);

  const messages: BannerMessage[] = [];
  const countryData = bannerMatrix[country];

  if (!countryData) {
    messages.push(DEFAULT_FALLBACK);
  } else {
    let found = false;

    if (country === "united states" && city && isUSMajorCity(city)) {
      const cityRules = countryData.cities?.["__us_major__"];
      if (cityRules) {
        if (cityRules[cat]) {
          messages.push(cityRules[cat]);
          found = true;
        }
      }
    }

    if (!found && countryData.cities && city) {
      for (const [cityPattern, cityRules] of Object.entries(countryData.cities)) {
        if (cityPattern === "__us_major__") continue;
        if (city.includes(cityPattern)) {
          if (cityRules[cat]) {
            messages.push(cityRules[cat]);
            found = true;
            break;
          }
        }
      }
    }

    if (!found) {
      const hotelGenericCat = cat.startsWith("HOTEL_") ? "HOTEL" : null;

      if (countryData.services[cat]) {
        messages.push(countryData.services[cat]);
      } else if (hotelGenericCat && countryData.services[hotelGenericCat]) {
        messages.push(countryData.services[hotelGenericCat]);
      } else if (countryData.services["ALL_OTHERS"]) {
        messages.push(countryData.services["ALL_OTHERS"]);
      } else {
        messages.push(DEFAULT_FALLBACK);
      }
    }
  }

  if (cat === "CRUISE") {
    messages.push(CRUISE_OVERRIDE);
  }

  return messages;
}

const HIDE_CARDS_COUNTRIES: Record<string, Set<string> | "all"> = {
  "japan": new Set(["REST_SD", "REST_TO", "BEAUTY", "TRANS", "HOTEL", "HOTEL_BELLHOP", "HOTEL_HOUSEKEEPING", "HOTEL_VALET", "HOTEL_CONCIERGE", "HOTEL_ROOMSERVICE", "HOTEL_GENERAL", "BARS", "DELIVERY", "MOVERS", "CRUISE"]),
  "south korea": new Set(["REST_SD", "REST_TO", "BEAUTY", "TRANS", "HOTEL", "HOTEL_BELLHOP", "HOTEL_HOUSEKEEPING", "HOTEL_VALET", "HOTEL_CONCIERGE", "HOTEL_ROOMSERVICE", "HOTEL_GENERAL", "BARS", "DELIVERY", "MOVERS", "CRUISE"]),
  "china": new Set(["REST_SD", "REST_TO", "BEAUTY", "TRANS", "BARS", "DELIVERY", "MOVERS", "CRUISE"]),
};

export function shouldHideCards(location: string, serviceKey: string): boolean {
  const parsed = parseLocation(location);
  const country = parsed.country.toLowerCase();
  const cat = serviceCategory(serviceKey);
  const rule = HIDE_CARDS_COUNTRIES[country];
  if (!rule) return false;
  if (rule === "all") return true;
  return rule.has(cat);
}
