/** Shared numeric tokens for cross-section dedupe (highlights vs summary vs bullets). */
export function extractMetricTokens(text) {
  if (!text) return [];
  const s = String(text).toLowerCase();
  const found = new Set();
  const patterns = [
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
  if (!st.length) return false;
  const hv = (highlights ?? [])
    .map((h) => `${h.label} ${h.value}`)
    .join(" ")
    .toLowerCase();
  return st.some((tok) => hv.includes(tok.replace(/^~/, "")) || hv.includes(tok));
}

export function projectCorpus(project) {
  return [project.title, project.problem, project.built, ...(project.impact ?? [])]
    .join(" ")
    .toLowerCase();
}

function redundancyScore(bullet, highlights, corpora) {
  let score = 0;
  if (sentenceOverlapsHighlights(bullet, highlights)) score += 12;
  const b = String(bullet).toLowerCase();
  const words = b.match(/\b[a-z0-9]{5,}\b/g) ?? [];
  for (const corpus of corpora) {
    const hits = words.filter((w) => corpus.includes(w));
    score += hits.length;
  }
  return score;
}

/** Drop experience bullets that restate featured projects or highlight metrics. */
export function dedupeExperienceBullets(experience, featuredProjects, highlights = []) {
  const corpora = (featuredProjects ?? []).map(projectCorpus);
  const maxScore = 8;

  return (experience ?? []).map((role) => {
    const original = role.bullets ?? [];
    let bullets = original.filter((b) => redundancyScore(b, highlights, corpora) <= maxScore);

    if (bullets.length === 0 && original.length > 0) {
      const ranked = [...original].sort(
        (a, b) => redundancyScore(a, highlights, corpora) - redundancyScore(b, highlights, corpora),
      );
      bullets = [ranked[0]];
    }

    return { ...role, bullets: bullets.slice(0, 4) };
  });
}
