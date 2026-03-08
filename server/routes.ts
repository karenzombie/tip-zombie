import type { Express } from "express";
import { createServer, type Server } from "node:http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/places/autocomplete", async (req, res) => {
    const input = req.query.input as string;
    if (!input || input.length < 2) {
      return res.json({ predictions: [] });
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=5&accept-language=en`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "TipZombie/1.0 (info@zombieplatforms.com)",
        },
      });
      const data = await response.json();

      const predictions = (data || [])
        .filter((place: any) => {
          const rank = place.place_rank;
          return rank <= 16;
        })
        .map((place: any) => {
        const addr = place.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.province || addr.county || "";
        const state = addr.state || addr.region || "";
        const country = addr.country || "";

        const displayName = place.name || place.display_name.split(",")[0]?.trim() || "";
        const mainText = displayName || city || country;

        const secondaryParts: string[] = [];
        if (state && state !== mainText) secondaryParts.push(state);
        if (country && country !== mainText) secondaryParts.push(country);
        const secondaryText = secondaryParts.join(", ");

        const resolvedCity = addr.city || addr.town || addr.village || addr.municipality || addr.province || "";

        return {
          placeId: place.place_id?.toString() || place.osm_id?.toString() || "",
          description: place.display_name,
          mainText,
          secondaryText,
          locationData: {
            city: resolvedCity || displayName || null,
            state: state || null,
            country: country || null,
            countryCode: addr.country_code?.toUpperCase() || null,
          },
        };
      });

      return res.json({ predictions });
    } catch {
      return res.status(500).json({ error: "Failed to fetch locations", predictions: [] });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
