import { Item, AIMatchResult } from '../types';

export interface CategorizeResult {
  category: string;
  brand?: string;
  color?: string;
  suggestedName?: string;
  itemType?: string;
}

export async function aiCategorizeItem(input: string): Promise<CategorizeResult> {
  try {
    const res = await fetch('/api/ai/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('AI categorization request failed, using local heuristics', err);
  }

  // Graceful local heuristic fallback
  const lower = input.toLowerCase();
  let category = 'Other';
  if (/phone|iphone|samsung|laptop|macbook|ipad|tablet|charger|airpod|earbud|headphone|watch/i.test(lower)) category = 'Electronics';
  else if (/bag|backpack|tote|duffle|rucksack/i.test(lower)) category = 'Bags';
  else if (/wallet|purse|cardholder/i.test(lower)) category = 'Wallets';
  else if (/id|card|license|student card/i.test(lower)) category = 'ID Cards';
  else if (/key|keychain|car key|dorm key/i.test(lower)) category = 'Keys';
  else if (/book|notebook|textbook|folder|binder|novel/i.test(lower)) category = 'Books';
  else if (/jacket|hoodie|sweater|shirt|coat|hat|cap/i.test(lower)) category = 'Clothing';
  else if (/bottle|flask|umbrella|glasses|sunglasses|ring/i.test(lower)) category = 'Accessories';

  let color = '';
  const colors = ['black', 'blue', 'brown', 'silver', 'white', 'grey', 'gray', 'red', 'green', 'yellow', 'pink', 'purple', 'gold'];
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(lower)) {
      color = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  let brand = '';
  const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Sony', 'Nike', 'Adidas', 'Herschel', 'The North Face', 'Fossil', 'Casio', 'Hydro Flask', 'Stanley'];
  for (const b of brands) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(lower)) {
      brand = b;
      break;
    }
  }

  return {
    category,
    brand,
    color,
    suggestedName: input.trim(),
    itemType: category === 'Electronics' ? 'Device' : category,
  };
}

export async function aiFindMatches(targetItem: Item, candidateItems: Item[]): Promise<AIMatchResult[]> {
  try {
    const res = await fetch('/api/ai/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetItem, candidateItems }),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.matches)) {
        return data.matches;
      }
    }
  } catch (err) {
    console.warn('AI match endpoint failed, falling back to client match engine', err);
  }

  // Graceful rule-based comparison algorithm
  const results: AIMatchResult[] = [];
  for (const candidate of candidateItems) {
    // Only compare opposite types or relevant cross-type items
    if (candidate.type === targetItem.type) continue;
    if (candidate.status === 'Resolved') continue;

    let score = 25;
    const reasons: string[] = [];

    // Category comparison
    if (candidate.category === targetItem.category) {
      score += 25;
      reasons.push('Same item category');
    }

    // Color comparison
    if (
      targetItem.color &&
      candidate.color &&
      (targetItem.color.toLowerCase() === candidate.color.toLowerCase() ||
        candidate.color.toLowerCase().includes(targetItem.color.toLowerCase()))
    ) {
      score += 18;
      reasons.push('Same color');
    }

    // Brand comparison
    if (
      targetItem.brand &&
      candidate.brand &&
      (targetItem.brand.toLowerCase() === candidate.brand.toLowerCase() ||
        candidate.brand.toLowerCase().includes(targetItem.brand.toLowerCase()))
    ) {
      score += 18;
      reasons.push('Same brand');
    }

    // Location comparison
    if (candidate.location === targetItem.location) {
      score += 12;
      reasons.push('Similar campus location');
    }

    // Text token similarity
    const targetWords = `${targetItem.name} ${targetItem.description}`.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const candWords = `${candidate.name} ${candidate.description}`.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const matchingWords = targetWords.filter(w => candWords.includes(w));
    if (matchingWords.length > 0) {
      score += Math.min(15, matchingWords.length * 5);
      reasons.push('Similar description details');
    }

    score = Math.min(96, Math.max(score, 30));

    if (score >= 50) {
      results.push({
        candidateId: candidate.itemId,
        score,
        reasons: reasons.length > 0 ? reasons : ['General campus similarity'],
        explanation: `Shared attributes in ${reasons.join(', ').toLowerCase() || 'item specifications'}.`,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export async function aiEnhanceDescription(name: string, category: string, roughNotes: string, type: 'lost' | 'found'): Promise<string> {
  try {
    const res = await fetch('/api/ai/enhance-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, roughNotes, type }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.enhancedDescription) {
        return data.enhancedDescription;
      }
    }
  } catch (err) {
    console.warn('AI enhance description failed, using standard formatting', err);
  }

  const base = roughNotes.trim();
  if (type === 'lost') {
    return base
      ? `${base}. Lost recently on campus. Please contact if seen; identifying marks can be verified upon recovery.`
      : `${name} (${category}) misplaced on campus. Has noticeable student usage marks. Please contact if found.`;
  } else {
    return base
      ? `${base}. Safely retrieved on campus. Stored safely until claimant provides identifying verification.`
      : `${name} found on campus. In good condition. Please specify unique features or serial info to claim.`;
  }
}
