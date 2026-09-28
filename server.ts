import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client (safely on server)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint 1: AI Auto-Categorization and field extraction
app.post('/api/ai/categorize', async (req: Request, res: Response) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Text input is required' });
    }

    if (!ai) {
      // Intelligent rule-based heuristic fallback if API key is not yet set
      const lower = input.toLowerCase();
      let category = 'Other';
      if (/phone|iphone|samsung|laptop|macbook|ipad|tablet|charger|airpod|earbud|headphone|watch|kindle/i.test(lower)) category = 'Electronics';
      else if (/bag|backpack|tote|duffle|rucksack/i.test(lower)) category = 'Bags';
      else if (/wallet|purse|cardholder/i.test(lower)) category = 'Wallets';
      else if (/id|card|license|student card/i.test(lower)) category = 'ID Cards';
      else if (/key|keychain|car key|dorm key/i.test(lower)) category = 'Keys';
      else if (/book|notebook|textbook|folder|binder|novel/i.test(lower)) category = 'Books';
      else if (/jacket|hoodie|sweater|shirt|coat|hat|cap|scarf/i.test(lower)) category = 'Clothing';
      else if (/bottle|flask|umbrella|glasses|sunglasses|ring|bracelet|watch/i.test(lower)) category = 'Accessories';

      let color = '';
      const colors = ['black', 'blue', 'brown', 'silver', 'white', 'grey', 'gray', 'red', 'green', 'yellow', 'pink', 'purple', 'gold'];
      for (const c of colors) {
        if (new RegExp(`\\b${c}\\b`, 'i').test(lower)) {
          color = c.charAt(0).toUpperCase() + c.slice(1);
          break;
        }
      }

      let brand = '';
      const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Sony', 'Nike', 'Adidas', 'Herschel', 'North Face', 'Fossil', 'Casio', 'Hydro Flask', 'Stanley'];
      for (const b of brands) {
        if (new RegExp(`\\b${b}\\b`, 'i').test(lower)) {
          brand = b;
          break;
        }
      }

      return res.json({
        category,
        brand,
        color,
        suggestedName: input.trim(),
        itemType: category === 'Electronics' ? 'Device' : category,
      });
    }

    const prompt = `Analyze this description of a lost or found campus item: "${input}".
Extract structured data in JSON format with these exact fields:
- category: MUST be strictly one of ["Electronics", "Bags", "Wallets", "ID Cards", "Keys", "Books", "Clothing", "Accessories", "Other"]
- brand: (e.g., "Apple", "Samsung", "Nike", or "" if none)
- color: (primary color, e.g., "Black", "Navy Blue", or "" if none)
- suggestedName: concise polished title for the item (e.g. "Black Samsung Galaxy S23", "Brown Leather Bi-fold Wallet")
- itemType: specific item type (e.g., "Smartphone", "Water Bottle", "Backpack")

Return ONLY valid raw JSON with no Markdown fences or extra commentary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ai/categorize:', error);
    return res.status(500).json({ error: 'Failed to categorize item' });
  }
});

// Endpoint 2: AI Smart Matching between a target item and candidate items
app.post('/api/ai/match', async (req: Request, res: Response) => {
  try {
    const { targetItem, candidateItems } = req.body;
    if (!targetItem || !candidateItems || !Array.isArray(candidateItems)) {
      return res.status(400).json({ error: 'Target item and candidate items required' });
    }

    if (candidateItems.length === 0) {
      return res.json({ matches: [] });
    }

    if (!ai) {
      // Heuristic fallback matching
      const matches = candidateItems.map((candidate: any) => {
        let score = 30;
        const reasons: string[] = [];

        if (candidate.category === targetItem.category) {
          score += 25;
          reasons.push('Same item category');
        }
        if (targetItem.color && candidate.color && targetItem.color.toLowerCase() === candidate.color.toLowerCase()) {
          score += 15;
          reasons.push('Same color');
        }
        if (targetItem.brand && candidate.brand && targetItem.brand.toLowerCase() === candidate.brand.toLowerCase()) {
          score += 15;
          reasons.push('Same brand');
        }
        if (candidate.location === targetItem.location) {
          score += 10;
          reasons.push('Similar campus location');
        }
        const targetWords = (targetItem.name + ' ' + (targetItem.description || '')).toLowerCase().split(/\s+/);
        const candWords = (candidate.name + ' ' + (candidate.description || '')).toLowerCase().split(/\s+/);
        const common = targetWords.filter((w: string) => w.length > 3 && candWords.includes(w));
        if (common.length > 0) {
          score += 10;
          reasons.push('Similar description details');
        }

        score = Math.min(score, 98);
        return {
          candidateId: candidate.itemId,
          score,
          reasons: reasons.length > 0 ? reasons : ['General campus item resemblance'],
          explanation: `Strong correspondence in ${reasons.join(', ').toLowerCase() || 'item details'}.`,
        };
      }).filter((m: any) => m.score >= 50).sort((a: any, b: any) => b.score - a.score);

      return res.json({ matches });
    }

    // Prepare candidate summaries for Gemini
    const candidateSummary = candidateItems.slice(0, 10).map((c: any) => ({
      id: c.itemId,
      name: c.name,
      category: c.category,
      color: c.color,
      brand: c.brand || '',
      location: c.location,
      date: c.date,
      description: c.description || '',
    }));

    const prompt = `You are the CampusFind intelligent matching engine for college lost & found.
Target Item:
- Type: ${targetItem.type} (Looking for matching items of opposite type)
- Name: ${targetItem.name}
- Category: ${targetItem.category}
- Color: ${targetItem.color}
- Brand: ${targetItem.brand || 'N/A'}
- Location: ${targetItem.location}
- Date: ${targetItem.date}
- Description: ${targetItem.description}

Candidate Items:
${JSON.stringify(candidateSummary, null, 2)}

Compare the Target Item against each Candidate.
Calculate a match confidence score between 0 and 100 for each candidate that has at least 50% plausibility.
List concise reasons (e.g., "Same item category", "Same brand", "Same color", "Similar location", "Similar description").
Provide a brief 1-sentence explanation.

Return JSON in this exact structure:
{
  "matches": [
    {
      "candidateId": "string",
      "score": 91,
      "reasons": ["Same item category", "Same brand", "Same color", "Similar location"],
      "explanation": "Both refer to a black Samsung Galaxy smartphone reported in or near the Library."
    }
  ]
}
Return only candidate IDs that reach at least 50% score, ordered highest score first. No Markdown wrappers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{"matches": []}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ai/match:', error);
    return res.status(500).json({ error: 'Failed to run AI matching' });
  }
});

// Endpoint 3: AI Enhance Description
app.post('/api/ai/enhance-description', async (req: Request, res: Response) => {
  try {
    const { name, category, roughNotes, type } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    if (!ai) {
      const clean = roughNotes ? `${roughNotes.trim()}. Condition appears intact with standard campus usage marks.` : `Item: ${name}. In good condition. Please verify with identifying details when contacting.`;
      return res.json({ enhancedDescription: clean });
    }

    const prompt = `Help a college student write a clear, helpful lost/found report description.
Item Name: ${name}
Category: ${category}
Report Type: ${type}
Student's rough notes: "${roughNotes || ''}"

Generate a polished, helpful 2-3 sentence description.
Guidelines:
- Include observable characteristics (materials, condition, stickers, case style, keychain features).
- DO NOT reveal confidential security features (like exact PINs, passwords, full card numbers) so the owner can still be verified during a claim.
- Keep the tone polite, clear, and student-friendly.

Return JSON:
{
  "enhancedDescription": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ai/enhance-description:', error);
    return res.status(500).json({ error: 'Failed to enhance description' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CampusFind server running on http://localhost:${PORT}`);
  });
}

startServer();
