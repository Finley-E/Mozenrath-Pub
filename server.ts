import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { ISLANDS, FOOD_ITEMS, NUMA_ROSTER, PRIMORDIALS, VOCABULARY } from './services/mascareneData.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Shared Gemini client setup with lazy initialization
  let aiInstance: GoogleGenAI | null = null;
  const getAI = () => {
    if (!aiInstance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required.");
      }
      aiInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiInstance;
  };

  // API - Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // API - Static Mascarene Data
  app.get('/api/mascarene/static', (req, res) => {
    res.json({
      islands: ISLANDS,
      vocabulary: VOCABULARY,
      defaultNuma: NUMA_ROSTER,
      primordials: PRIMORDIALS,
      foods: FOOD_ITEMS
    });
  });

  // API - Generate Lore-Aligned Numa
  app.post('/api/gemini/generate-numa', async (req, res) => {
    try {
      const { userIdea, chosenClass, chosenStage } = req.body;
      const ai = getAI();

      const systemPrompt = `You are the core regional lore designer for Mascarene Civilization (Game Boy Color exploration game).
Your goal is to generate a new Numa companion creature.
You MUST strictly follow these phonetic, grammatical, and formatting limitations:
1. Name rules: Generates a completely new name that feels discovered.
   - Core root lexicon to use: ma, nu, va, ra, lo, we, sa, ki, ta, mu, na, yo, zu, ri, ko, lu, vi, se, wo, ya.
   - Acceptable phonetic building blocks:
     - Vowels: a, e, i, o, u
     - Consonants: k, m, n, r, s, t, v, w, y, z, l
   - Suffix rules for evolution stage:
     - juvenile (-i suffix, e.g. Taki, Seli, Lozi)
     - mature (-ku suffix, e.g. Seliku, Wesiku)
     - elder (-ma suffix, e.g. Selima, Wesima)
     - primordial (-ra suffix, e.g. Wera, Raza, Kora)
   - Do NOT use any letter outside the allowed vowels and consonants! No b, c, d, f, g, h, j, p, q, x!

2. Ecosystem constraints:
   - Must belong to one of these classes: Forest | Reef | Ocean | Volcano | Wind | Cave | Marsh | Night | Ancient | Spirit
   - Primary island must be one of: Lovi Canopy, Koru Basalt, Mase Shallows, Wesa High Lands.

3. Complete the request by delivering the entity in perfect JSON format with realistic in-game stats, ecosystem, behavior, and GBC 4-color pixel art design directions.`;

      const userMessage = `Create a Numa based on these parameters:
- User Inspiration/Idea: "${userIdea || 'A small spirit hovering in mist'}"
- Class constraint: "${chosenClass || 'Spirit'}"
- Stage constraint: "${chosenStage || 'juvenile'}"
Return the output as raw JSON matching the schema precisely.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING, description: "Linguistically aligned name complying exactly with allowed phonetics and stage suffix rules (-i, -ku, -ma, -ra)." },
          class: { type: Type.STRING, description: "Must be exactly Forest, Reef, Ocean, Volcano, Wind, Cave, Marsh, Night, Ancient, or Spirit" },
          stage: { type: Type.STRING, description: "Must be exactly juvenile, mature, elder, or primordial" },
          habitat: { type: Type.STRING, description: "Where they dwell on the island" },
          behavior: { type: Type.STRING, description: "Unique non-violent behavior, eating habits, or migration patterns" },
          ecologicalRole: { type: Type.STRING, description: "How they enrich the island's natural environment" },
          primaryIsland: { type: Type.STRING, description: "One of the 4 island settlements" },
          favoriteFoodIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of matching food IDs (e.g. food-01, stap-01, fora-02, fest-01, drinj-01)" },
          baseStats: {
            type: Type.OBJECT,
            properties: {
              memory: { type: Type.INTEGER, description: "Numeric value between 30 and 200" },
              current: { type: Type.INTEGER, description: "Numeric value between 5 and 60" },
              resonance: { type: Type.INTEGER, description: "Numeric value between 4 and 60" }
            },
            required: ["memory", "current", "resonance"]
          },
          pixelArtDescription: { type: Type.STRING, description: "Detailed guide for drawing GBC tile art with 160x144, 4-color palette constraints" }
        },
        required: ["id", "name", "class", "stage", "habitat", "behavior", "ecologicalRole", "primaryIsland", "favoriteFoodIds", "baseStats", "pixelArtDescription"]
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\n" + userMessage }] }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema
        }
      });

      const rawJson = response.text || '';
      const cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);
      
      res.json(parsedData);
    } catch (err: any) {
      console.error('[SERVER ERR] generate-numa failed:', err);
      // Return a beautiful fallback if API Key is missing or service is offline
      res.json({
        id: "gen-" + Math.floor(Math.random() * 900 + 100),
        name: "Loziku",
        class: "Forest",
        stage: "mature",
        habitat: "Misty forest floor and shaded mosses",
        behavior: "Rolls in circles around tree trunks, leaving behind glowing snail-like traces of mineralized gel.",
        ecologicalRole: "Moistens deep ironwood roots during dry seasons, protecting platform anchors.",
        primaryIsland: "Lovi Canopy",
        favoriteFoodIds: ["stap-01", "fora-01"],
        baseStats: { memory: 80, current: 16, resonance: 15 },
        pixelArtDescription: "16x16 sprite: A cozy mint-green leaf snail shell with two glowing amber eye stalks. Relies on the 4-color Lovi palette (deep moss green, forest teal, amber glow, cream soil)."
      });
    }
  });

  // API - Generate Regional Myths and Legends
  app.post('/api/gemini/generate-legend', async (req, res) => {
    try {
      const { islandName, titleContext } = req.body;
      const ai = getAI();

      const prompt = `Write a short, engaging regional children's legend or traditional recipe story set in the Mascarene Civilization (Munu Archipelago).
Focus on:
- Island: ${islandName || 'Lovi Canopy'}
- Core Theme/Context: ${titleContext || 'The night Raza flew over the high mountain'}
- Sound guidelines: Use traditional names (like Nulu, Seli, Suna, Kora, Vala, Munu) in the legend.
- Narrative tone: Evoke wonder, retro-game handbook cozy style, and gentle ecological coexistence. Do not mention conquest, combat or destruction. No external real world references. Keep it concise (under 250 words) so it matches a Game Boy player's booklet.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ legend: response.text || "A cozy quiet evening blanketed the huts of Koru Archipelago as Kora Vessels sang their soft hum of bond..." });
    } catch (err: any) {
      res.json({ 
        legend: `Far back in the currents of Munu, when the very roots of the Lovi Canopy were but tiny sprouts (ki), there was a giant Taki that listened to the water currents. It sang a soft melody (nulu) that called all of Canopy together. To this day, Suna Loomers weave glowing root fibers to remember that first sweet song of unity.` 
      });
    }
  });

  // Hot Module Dev Server and Production build integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mascarene Civilization Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[CRITICAL] Server crashed on launch:', err);
  process.exit(1);
});
