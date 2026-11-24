/** Shared numeric tokens for cross-section dedupe helpers. */
export function extractMetricTokens(text) {
  if (!text) return [];
  const s = String(text).toLowerCase();
  const found = new Set();
  const patterns = [
    /€\s*[\d.]+\s*k\+?/gi,
    /\d[\d.,]*\s*(?:k|m)\+?/gi,
    /\d[\d.,]+\+/g,
    /~\s*\d[\d.,]*/g,
    /\d+\s*\/\s*mo/gi,
  ];
  for (const re of patterns) {
    for (const m of s.match(re) ?? []) {
      found.add(m.replace(/\s+/g, "").replace(/~~/g, "~"));
    }
  }
  return [...found];
}

export function sentenceOverlapsHighlights(sentence, highlights) {
  const st = extractMetricTokens(sentence);
  const hv = (highlights ?? [])
    .map((h) => `${h.label} ${h.value}`)
    .join(" ")
    .toLowerCase();
  if (st.length) {
    if (st.some((tok) => hv.includes(tok.replace(/^~/, "")) || hv.includes(tok))) {
      return true;
    }
  }
  const s = String(sentence).toLowerCase();
  if (/€\s*20k|20k\+/.test(s) && hv.includes("20k")) return true;
  return false;
}

/**
 * Keep each role's full chronological narrative intact while removing exact
 * or near-exact duplicate bullets across roles.
 */
export function dedupeExperienceBullets(experience) {
  const seen = new Set();

  return (experience ?? []).map((role, index) => {
    const cap = index === 0 ? 5 : 4;
    const bullets = [];
    for (const b of role.bullets ?? []) {
      const key = String(b)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 72);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      bullets.push(b);
      if (bullets.length >= cap) break;
    }
    return { ...role, bullets };
  });
}
