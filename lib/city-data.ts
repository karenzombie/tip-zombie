export interface CityEntry {
  city: string;
  state?: string;
  country: string;
  countryCode: string;
}

const CITIES: CityEntry[] = [
  { city: "New York", state: "New York", country: "United States", countryCode: "US" },
  { city: "Los Angeles", state: "California", country: "United States", countryCode: "US" },
  { city: "Chicago", state: "Illinois", country: "United States", countryCode: "US" },
  { city: "Houston", state: "Texas", country: "United States", countryCode: "US" },
  { city: "Phoenix", state: "Arizona", country: "United States", countryCode: "US" },
  { city: "Philadelphia", state: "Pennsylvania", country: "United States", countryCode: "US" },
  { city: "San Antonio", state: "Texas", country: "United States", countryCode: "US" },
  { city: "San Diego", state: "California", country: "United States", countryCode: "US" },
  { city: "Dallas", state: "Texas", country: "United States", countryCode: "US" },
  { city: "Austin", state: "Texas", country: "United States", countryCode: "US" },
  { city: "Jacksonville", state: "Florida", country: "United States", countryCode: "US" },
  { city: "San Francisco", state: "California", country: "United States", countryCode: "US" },
  { city: "Seattle", state: "Washington", country: "United States", countryCode: "US" },
  { city: "Denver", state: "Colorado", country: "United States", countryCode: "US" },
  { city: "Nashville", state: "Tennessee", country: "United States", countryCode: "US" },
  { city: "Washington", state: "District of Columbia", country: "United States", countryCode: "US" },
  { city: "Boston", state: "Massachusetts", country: "United States", countryCode: "US" },
  { city: "Las Vegas", state: "Nevada", country: "United States", countryCode: "US" },
  { city: "Portland", state: "Oregon", country: "United States", countryCode: "US" },
  { city: "Atlanta", state: "Georgia", country: "United States", countryCode: "US" },
  { city: "Miami", state: "Florida", country: "United States", countryCode: "US" },
  { city: "Orlando", state: "Florida", country: "United States", countryCode: "US" },
  { city: "Tampa", state: "Florida", country: "United States", countryCode: "US" },
  { city: "Minneapolis", state: "Minnesota", country: "United States", countryCode: "US" },
  { city: "Charlotte", state: "North Carolina", country: "United States", countryCode: "US" },
  { city: "Detroit", state: "Michigan", country: "United States", countryCode: "US" },
  { city: "New Orleans", state: "Louisiana", country: "United States", countryCode: "US" },
  { city: "Salt Lake City", state: "Utah", country: "United States", countryCode: "US" },
  { city: "Honolulu", state: "Hawaii", country: "United States", countryCode: "US" },
  { city: "San Jose", state: "California", country: "United States", countryCode: "US" },
  { city: "Indianapolis", state: "Indiana", country: "United States", countryCode: "US" },
  { city: "Columbus", state: "Ohio", country: "United States", countryCode: "US" },
  { city: "Pittsburgh", state: "Pennsylvania", country: "United States", countryCode: "US" },
  { city: "St. Louis", state: "Missouri", country: "United States", countryCode: "US" },
  { city: "Kansas City", state: "Missouri", country: "United States", countryCode: "US" },
  { city: "Milwaukee", state: "Wisconsin", country: "United States", countryCode: "US" },
  { city: "Raleigh", state: "North Carolina", country: "United States", countryCode: "US" },
  { city: "Baltimore", state: "Maryland", country: "United States", countryCode: "US" },
  { city: "Cleveland", state: "Ohio", country: "United States", countryCode: "US" },
  { city: "Cincinnati", state: "Ohio", country: "United States", countryCode: "US" },
  { city: "Savannah", state: "Georgia", country: "United States", countryCode: "US" },
  { city: "Charleston", state: "South Carolina", country: "United States", countryCode: "US" },
  { city: "Anchorage", state: "Alaska", country: "United States", countryCode: "US" },

  { city: "Toronto", state: "Ontario", country: "Canada", countryCode: "CA" },
  { city: "Vancouver", state: "British Columbia", country: "Canada", countryCode: "CA" },
  { city: "Montreal", state: "Quebec", country: "Canada", countryCode: "CA" },
  { city: "Calgary", state: "Alberta", country: "Canada", countryCode: "CA" },
  { city: "Ottawa", state: "Ontario", country: "Canada", countryCode: "CA" },
  { city: "Edmonton", state: "Alberta", country: "Canada", countryCode: "CA" },
  { city: "Winnipeg", state: "Manitoba", country: "Canada", countryCode: "CA" },
  { city: "Quebec City", state: "Quebec", country: "Canada", countryCode: "CA" },
  { city: "Halifax", state: "Nova Scotia", country: "Canada", countryCode: "CA" },
  { city: "Victoria", state: "British Columbia", country: "Canada", countryCode: "CA" },

  { city: "London", country: "United Kingdom", countryCode: "GB" },
  { city: "Manchester", country: "United Kingdom", countryCode: "GB" },
  { city: "Birmingham", country: "United Kingdom", countryCode: "GB" },
  { city: "Edinburgh", country: "United Kingdom", countryCode: "GB" },
  { city: "Glasgow", country: "United Kingdom", countryCode: "GB" },
  { city: "Liverpool", country: "United Kingdom", countryCode: "GB" },
  { city: "Bristol", country: "United Kingdom", countryCode: "GB" },
  { city: "Leeds", country: "United Kingdom", countryCode: "GB" },
  { city: "Oxford", country: "United Kingdom", countryCode: "GB" },
  { city: "Cambridge", country: "United Kingdom", countryCode: "GB" },
  { city: "Dublin", country: "Ireland", countryCode: "IE" },
  { city: "Cork", country: "Ireland", countryCode: "IE" },
  { city: "Galway", country: "Ireland", countryCode: "IE" },

  { city: "Paris", country: "France", countryCode: "FR" },
  { city: "Marseille", country: "France", countryCode: "FR" },
  { city: "Lyon", country: "France", countryCode: "FR" },
  { city: "Nice", country: "France", countryCode: "FR" },
  { city: "Bordeaux", country: "France", countryCode: "FR" },
  { city: "Berlin", country: "Germany", countryCode: "DE" },
  { city: "Munich", country: "Germany", countryCode: "DE" },
  { city: "Hamburg", country: "Germany", countryCode: "DE" },
  { city: "Frankfurt", country: "Germany", countryCode: "DE" },
  { city: "Cologne", country: "Germany", countryCode: "DE" },
  { city: "Rome", country: "Italy", countryCode: "IT" },
  { city: "Milan", country: "Italy", countryCode: "IT" },
  { city: "Florence", country: "Italy", countryCode: "IT" },
  { city: "Venice", country: "Italy", countryCode: "IT" },
  { city: "Naples", country: "Italy", countryCode: "IT" },
  { city: "Madrid", country: "Spain", countryCode: "ES" },
  { city: "Barcelona", country: "Spain", countryCode: "ES" },
  { city: "Seville", country: "Spain", countryCode: "ES" },
  { city: "Valencia", country: "Spain", countryCode: "ES" },
  { city: "Lisbon", country: "Portugal", countryCode: "PT" },
  { city: "Porto", country: "Portugal", countryCode: "PT" },
  { city: "Amsterdam", country: "Netherlands", countryCode: "NL" },
  { city: "Rotterdam", country: "Netherlands", countryCode: "NL" },
  { city: "Brussels", country: "Belgium", countryCode: "BE" },
  { city: "Bruges", country: "Belgium", countryCode: "BE" },
  { city: "Vienna", country: "Austria", countryCode: "AT" },
  { city: "Salzburg", country: "Austria", countryCode: "AT" },
  { city: "Zurich", country: "Switzerland", countryCode: "CH" },
  { city: "Geneva", country: "Switzerland", countryCode: "CH" },
  { city: "Bern", country: "Switzerland", countryCode: "CH" },
  { city: "Prague", country: "Czech Republic", countryCode: "CZ" },
  { city: "Budapest", country: "Hungary", countryCode: "HU" },
  { city: "Warsaw", country: "Poland", countryCode: "PL" },
  { city: "Krakow", country: "Poland", countryCode: "PL" },
  { city: "Athens", country: "Greece", countryCode: "GR" },
  { city: "Santorini", country: "Greece", countryCode: "GR" },
  { city: "Istanbul", country: "Turkey", countryCode: "TR" },
  { city: "Ankara", country: "Turkey", countryCode: "TR" },
  { city: "Copenhagen", country: "Denmark", countryCode: "DK" },
  { city: "Stockholm", country: "Sweden", countryCode: "SE" },
  { city: "Oslo", country: "Norway", countryCode: "NO" },
  { city: "Helsinki", country: "Finland", countryCode: "FI" },
  { city: "Reykjavik", country: "Iceland", countryCode: "IS" },
  { city: "Bucharest", country: "Romania", countryCode: "RO" },
  { city: "Sofia", country: "Bulgaria", countryCode: "BG" },
  { city: "Zagreb", country: "Croatia", countryCode: "HR" },
  { city: "Dubrovnik", country: "Croatia", countryCode: "HR" },
  { city: "Belgrade", country: "Serbia", countryCode: "RS" },
  { city: "Ljubljana", country: "Slovenia", countryCode: "SI" },
  { city: "Tallinn", country: "Estonia", countryCode: "EE" },
  { city: "Riga", country: "Latvia", countryCode: "LV" },
  { city: "Vilnius", country: "Lithuania", countryCode: "LT" },
  { city: "Bratislava", country: "Slovakia", countryCode: "SK" },
  { city: "Kiev", country: "Ukraine", countryCode: "UA" },
  { city: "Moscow", country: "Russia", countryCode: "RU" },
  { city: "St. Petersburg", country: "Russia", countryCode: "RU" },
  { city: "Malta", country: "Malta", countryCode: "MT" },
  { city: "Valletta", country: "Malta", countryCode: "MT" },
  { city: "Monaco", country: "Monaco", countryCode: "MC" },
  { city: "Luxembourg", country: "Luxembourg", countryCode: "LU" },

  { city: "Tokyo", country: "Japan", countryCode: "JP" },
  { city: "Osaka", country: "Japan", countryCode: "JP" },
  { city: "Kyoto", country: "Japan", countryCode: "JP" },
  { city: "Seoul", country: "South Korea", countryCode: "KR" },
  { city: "Busan", country: "South Korea", countryCode: "KR" },
  { city: "Beijing", country: "China", countryCode: "CN" },
  { city: "Shanghai", country: "China", countryCode: "CN" },
  { city: "Guangzhou", country: "China", countryCode: "CN" },
  { city: "Shenzhen", country: "China", countryCode: "CN" },
  { city: "Hong Kong", country: "Hong Kong", countryCode: "HK" },
  { city: "Taipei", country: "Taiwan", countryCode: "TW" },
  { city: "Singapore", country: "Singapore", countryCode: "SG" },
  { city: "Bangkok", country: "Thailand", countryCode: "TH" },
  { city: "Phuket", country: "Thailand", countryCode: "TH" },
  { city: "Chiang Mai", country: "Thailand", countryCode: "TH" },
  { city: "Hanoi", country: "Vietnam", countryCode: "VN" },
  { city: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN" },
  { city: "Kuala Lumpur", country: "Malaysia", countryCode: "MY" },
  { city: "Penang", country: "Malaysia", countryCode: "MY" },
  { city: "Jakarta", country: "Indonesia", countryCode: "ID" },
  { city: "Bali", country: "Indonesia", countryCode: "ID" },
  { city: "Manila", country: "Philippines", countryCode: "PH" },
  { city: "Cebu", country: "Philippines", countryCode: "PH" },
  { city: "Phnom Penh", country: "Cambodia", countryCode: "KH" },
  { city: "Siem Reap", country: "Cambodia", countryCode: "KH" },
  { city: "Vientiane", country: "Laos", countryCode: "LA" },
  { city: "Yangon", country: "Myanmar", countryCode: "MM" },
  { city: "Colombo", country: "Sri Lanka", countryCode: "LK" },
  { city: "Kathmandu", country: "Nepal", countryCode: "NP" },
  { city: "Dhaka", country: "Bangladesh", countryCode: "BD" },
  { city: "Ulaanbaatar", country: "Mongolia", countryCode: "MN" },
  { city: "Thimphu", country: "Bhutan", countryCode: "BT" },
  { city: "Bandar Seri Begawan", country: "Brunei", countryCode: "BN" },
  { city: "Port Moresby", country: "Papua New Guinea", countryCode: "PG" },

  { city: "Mumbai", country: "India", countryCode: "IN" },
  { city: "New Delhi", country: "India", countryCode: "IN" },
  { city: "Bangalore", country: "India", countryCode: "IN" },
  { city: "Chennai", country: "India", countryCode: "IN" },
  { city: "Kolkata", country: "India", countryCode: "IN" },
  { city: "Jaipur", country: "India", countryCode: "IN" },
  { city: "Goa", country: "India", countryCode: "IN" },
  { city: "Hyderabad", country: "India", countryCode: "IN" },
  { city: "Islamabad", country: "Pakistan", countryCode: "PK" },
  { city: "Karachi", country: "Pakistan", countryCode: "PK" },
  { city: "Lahore", country: "Pakistan", countryCode: "PK" },

  { city: "Sydney", country: "Australia", countryCode: "AU" },
  { city: "Melbourne", country: "Australia", countryCode: "AU" },
  { city: "Brisbane", country: "Australia", countryCode: "AU" },
  { city: "Perth", country: "Australia", countryCode: "AU" },
  { city: "Adelaide", country: "Australia", countryCode: "AU" },
  { city: "Gold Coast", country: "Australia", countryCode: "AU" },
  { city: "Cairns", country: "Australia", countryCode: "AU" },
  { city: "Auckland", country: "New Zealand", countryCode: "NZ" },
  { city: "Wellington", country: "New Zealand", countryCode: "NZ" },
  { city: "Queenstown", country: "New Zealand", countryCode: "NZ" },
  { city: "Christchurch", country: "New Zealand", countryCode: "NZ" },
  { city: "Suva", country: "Fiji", countryCode: "FJ" },

  { city: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
  { city: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE" },
  { city: "Doha", country: "Qatar", countryCode: "QA" },
  { city: "Riyadh", country: "Saudi Arabia", countryCode: "SA" },
  { city: "Jeddah", country: "Saudi Arabia", countryCode: "SA" },
  { city: "Muscat", country: "Oman", countryCode: "OM" },
  { city: "Kuwait City", country: "Kuwait", countryCode: "KW" },
  { city: "Manama", country: "Bahrain", countryCode: "BH" },
  { city: "Amman", country: "Jordan", countryCode: "JO" },
  { city: "Beirut", country: "Lebanon", countryCode: "LB" },
  { city: "Tel Aviv", country: "Israel", countryCode: "IL" },
  { city: "Jerusalem", country: "Israel", countryCode: "IL" },

  { city: "Cairo", country: "Egypt", countryCode: "EG" },
  { city: "Marrakech", country: "Morocco", countryCode: "MA" },
  { city: "Casablanca", country: "Morocco", countryCode: "MA" },
  { city: "Tunis", country: "Tunisia", countryCode: "TN" },
  { city: "Cape Town", country: "South Africa", countryCode: "ZA" },
  { city: "Johannesburg", country: "South Africa", countryCode: "ZA" },
  { city: "Durban", country: "South Africa", countryCode: "ZA" },
  { city: "Nairobi", country: "Kenya", countryCode: "KE" },
  { city: "Mombasa", country: "Kenya", countryCode: "KE" },
  { city: "Dar es Salaam", country: "Tanzania", countryCode: "TZ" },
  { city: "Zanzibar", country: "Tanzania", countryCode: "TZ" },
  { city: "Kampala", country: "Uganda", countryCode: "UG" },
  { city: "Kigali", country: "Rwanda", countryCode: "RW" },
  { city: "Addis Ababa", country: "Ethiopia", countryCode: "ET" },
  { city: "Lagos", country: "Nigeria", countryCode: "NG" },
  { city: "Abuja", country: "Nigeria", countryCode: "NG" },
  { city: "Accra", country: "Ghana", countryCode: "GH" },
  { city: "Dakar", country: "Senegal", countryCode: "SN" },
  { city: "Windhoek", country: "Namibia", countryCode: "NA" },
  { city: "Victoria Falls", country: "Zimbabwe", countryCode: "ZW" },
  { city: "Lusaka", country: "Zambia", countryCode: "ZM" },
  { city: "Maputo", country: "Mozambique", countryCode: "MZ" },
  { city: "Antananarivo", country: "Madagascar", countryCode: "MG" },

  { city: "Mexico City", country: "Mexico", countryCode: "MX" },
  { city: "Cancun", country: "Mexico", countryCode: "MX" },
  { city: "Guadalajara", country: "Mexico", countryCode: "MX" },
  { city: "Puerto Vallarta", country: "Mexico", countryCode: "MX" },
  { city: "Cabo San Lucas", country: "Mexico", countryCode: "MX" },
  { city: "Playa del Carmen", country: "Mexico", countryCode: "MX" },
  { city: "Havana", country: "Cuba", countryCode: "CU" },
  { city: "San Juan", country: "Puerto Rico", countryCode: "PR" },
  { city: "Nassau", country: "Bahamas", countryCode: "BS" },
  { city: "Kingston", country: "Jamaica", countryCode: "JM" },
  { city: "Montego Bay", country: "Jamaica", countryCode: "JM" },
  { city: "Punta Cana", country: "Dominican Republic", countryCode: "DO" },
  { city: "Santo Domingo", country: "Dominican Republic", countryCode: "DO" },
  { city: "San Jose", country: "Costa Rica", countryCode: "CR" },
  { city: "Panama City", country: "Panama", countryCode: "PA" },
  { city: "Guatemala City", country: "Guatemala", countryCode: "GT" },
  { city: "Belize City", country: "Belize", countryCode: "BZ" },
  { city: "Tegucigalpa", country: "Honduras", countryCode: "HN" },
  { city: "Managua", country: "Nicaragua", countryCode: "NI" },
  { city: "San Salvador", country: "El Salvador", countryCode: "SV" },

  { city: "Buenos Aires", country: "Argentina", countryCode: "AR" },
  { city: "Rio de Janeiro", country: "Brazil", countryCode: "BR" },
  { city: "Sao Paulo", country: "Brazil", countryCode: "BR" },
  { city: "Lima", country: "Peru", countryCode: "PE" },
  { city: "Cusco", country: "Peru", countryCode: "PE" },
  { city: "Santiago", country: "Chile", countryCode: "CL" },
  { city: "Bogota", country: "Colombia", countryCode: "CO" },
  { city: "Cartagena", country: "Colombia", countryCode: "CO" },
  { city: "Medellin", country: "Colombia", countryCode: "CO" },
  { city: "Quito", country: "Ecuador", countryCode: "EC" },
  { city: "Montevideo", country: "Uruguay", countryCode: "UY" },
  { city: "La Paz", country: "Bolivia", countryCode: "BO" },
  { city: "Asuncion", country: "Paraguay", countryCode: "PY" },
  { city: "Caracas", country: "Venezuela", countryCode: "VE" },
  { city: "Georgetown", country: "Guyana", countryCode: "GY" },
  { city: "Paramaribo", country: "Suriname", countryCode: "SR" },
];

const COUNTRIES: string[] = [
  "United States", "Canada", "United Kingdom", "Ireland",
  "France", "Germany", "Italy", "Spain", "Portugal", "Netherlands", "Belgium",
  "Austria", "Switzerland", "Czech Republic", "Hungary", "Poland", "Greece",
  "Turkey", "Denmark", "Sweden", "Norway", "Finland", "Iceland",
  "Romania", "Bulgaria", "Croatia", "Serbia", "Slovenia",
  "Estonia", "Latvia", "Lithuania", "Slovakia", "Ukraine", "Russia",
  "Malta", "Monaco", "Luxembourg",
  "Japan", "South Korea", "China", "Hong Kong", "Taiwan", "Singapore",
  "Thailand", "Vietnam", "Malaysia", "Indonesia", "Philippines",
  "Cambodia", "Laos", "Myanmar", "Sri Lanka", "Nepal", "Bangladesh",
  "Mongolia", "Bhutan", "Brunei", "Papua New Guinea",
  "India", "Pakistan",
  "Australia", "New Zealand", "Fiji",
  "United Arab Emirates", "Qatar", "Saudi Arabia", "Oman", "Kuwait", "Bahrain",
  "Jordan", "Lebanon", "Israel", "Egypt", "Morocco", "Tunisia",
  "South Africa", "Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia",
  "Nigeria", "Ghana", "Senegal", "Namibia", "Zimbabwe", "Zambia",
  "Mozambique", "Madagascar",
  "Mexico", "Cuba", "Puerto Rico", "Bahamas", "Jamaica",
  "Dominican Republic", "Costa Rica", "Panama", "Guatemala", "Belize",
  "Honduras", "Nicaragua", "El Salvador",
  "Argentina", "Brazil", "Peru", "Chile", "Colombia", "Ecuador",
  "Uruguay", "Bolivia", "Paraguay", "Venezuela", "Guyana", "Suriname",
];

export function searchLocations(query: string, limit: number = 5): CityEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const results: { entry: CityEntry; score: number }[] = [];

  for (const city of CITIES) {
    const cityLower = city.city.toLowerCase();
    const countryLower = city.country.toLowerCase();
    const stateLower = (city.state || "").toLowerCase();
    const fullText = `${cityLower} ${stateLower} ${countryLower}`;

    let score = -1;

    if (cityLower === q) {
      score = 100;
    } else if (cityLower.startsWith(q)) {
      score = 80 + (q.length / cityLower.length) * 10;
    } else if (countryLower === q) {
      score = 70;
    } else if (countryLower.startsWith(q)) {
      score = 60 + (q.length / countryLower.length) * 10;
    } else if (fullText.includes(q)) {
      score = 40 + (q.length / fullText.length) * 10;
    } else {
      const words = q.split(/[\s,]+/).filter(Boolean);
      if (words.length > 1 && words.every(w => fullText.includes(w))) {
        score = 50 + (q.length / fullText.length) * 10;
      }
    }

    if (score > 0) {
      results.push({ entry: city, score });
    }
  }

  for (const country of COUNTRIES) {
    const countryLower = country.toLowerCase();
    if (countryLower === q || countryLower.startsWith(q)) {
      const alreadyHasCity = results.some(
        r => r.entry.country.toLowerCase() === countryLower && !r.entry.state
      );
      if (!alreadyHasCity) {
        const isDuplicate = results.some(
          r => r.entry.city.toLowerCase() === countryLower && r.entry.country.toLowerCase() === countryLower
        );
        if (!isDuplicate) {
          results.push({
            entry: { city: country, country, countryCode: "" },
            score: countryLower === q ? 95 : 55 + (q.length / countryLower.length) * 10,
          });
        }
      }
    }
  }

  results.sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const unique: CityEntry[] = [];
  for (const r of results) {
    const key = `${r.entry.city}|${r.entry.state || ""}|${r.entry.country}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r.entry);
      if (unique.length >= limit) break;
    }
  }

  return unique;
}
