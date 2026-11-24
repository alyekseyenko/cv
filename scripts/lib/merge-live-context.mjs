import { readFileSync, existsSync } from "node:fs";

function formatK(n) {
  if (n == null || Number.isNaN(Number(n))) return null;
  const num = Number(n);
  if (num >= 1_000_000) return `${Math.floor(num / 1_000_000)}M+`;
  if (num >= 1000) {
    const k = num / 1000;
    const rounded = k >= 10 ? k.toFixed(1).replace(/\.0$/, "") : String(Math.round(k));
    return `${rounded}k`;
  }
  return String(num);
}

/** Refresh hero metrics from Job Hunter operational_metrics while keeping canonical wording. */
export function syncHighlightsFromRaw(raw, baselineHighlights) {
  const base = Array.isArray(baselineHighlights) ? baselineHighlights.map((h) => ({ ...h })) : [];
  const m = raw?.operational_metrics;
  if (!m) return base;

  return base.map((item) => {
    if (/Production workflows/i.test(item.label) && m.n8n_executions_last_7_days != null) {
      const n8n = formatK(m.n8n_executions_last_7_days);
      return {
        label: `Production workflows (~${n8n} n8n/week)`,
        value: m.production_workflows || item.value,
      };
    }
    if (/Governed ERP read replica/i.test(item.label) && m.phc_replica_snapshot?.raw_rows_total) {
      return {
        ...item,
        value: `${formatK(m.phc_replica_snapshot.raw_rows_total)} rows`,
      };
    }
    return item;
  });
}

/** Crisp recruiter-ready summary grounded in user_cv.json and leadership working model. */
export function buildRecruiterSummary(raw) {
  const base = String(raw?.summary || "").trim();
  const extra =
    "I partner directly with leadership to turn business questions into governed numbers—visibility on revenue, debt, stock, customers, and feedback—on a lean self-hosted stack.";

  if (!base) return extra;
  const combined = /governed numbers|business questions/i.test(base)
    ? base
    : `${base} ${extra}`;

  return combined.length > 620 ? base : combined;
}

/** Public site always uses baseline tagline (internal focus strings stay in Job Hunter). */
export function syncTaglineFromRaw(_raw, baselineTagline) {
  return baselineTagline;
}

export function loadCoverLetterContext(contextPath) {
  if (!contextPath || !existsSync(contextPath)) return null;
  try {
    return JSON.parse(readFileSync(contextPath, "utf8"));
  } catch {
    return null;
  }
}
