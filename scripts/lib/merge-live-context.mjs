import { readFileSync, existsSync } from "node:fs";

function formatK(n) {
  if (n == null || Number.isNaN(Number(n))) return null;
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (num >= 1000) return `~${Math.round(num / 1000)}k`;
  return String(num);
}

/** Refresh hero metrics from Job Hunter operational_metrics when present. */
export function syncHighlightsFromRaw(raw, baselineHighlights) {
  const base = Array.isArray(baselineHighlights) ? baselineHighlights : [];
  const m = raw?.operational_metrics;
  if (!m) return base;

  const byLabel = Object.fromEntries(base.map((h) => [h.label, { ...h }]));

  if (m.n8n_executions_last_7_days != null) {
    byLabel["Production workflows (n8n, 7 days)"] = {
      label: "Production workflows (n8n, 7 days)",
      value: `~${formatK(m.n8n_executions_last_7_days)} runs`,
    };
  }

  const rep = m.phc_replica_snapshot;
  if (rep?.rows_cv_rounded || rep?.raw_rows_total) {
    const v = rep.rows_cv_rounded || formatK(rep.raw_rows_total);
    if (v) {
      byLabel["Governed ERP replica (Postgres)"] = {
        label: "Governed ERP replica (Postgres)",
        value: `${String(v).includes("M") || String(v).includes("k") ? v : `${v}+`} rows`,
      };
    }
  }

  if (m.innovation_hub_roi_cost_basis || m.production_workflows) {
    byLabel["Automation portfolio hours saved"] = {
      label: "Automation portfolio hours saved",
      value: byLabel["Automation portfolio hours saved"]?.value ?? "~465/mo",
    };
  }

  return Object.values(byLabel);
}

/** CEO/recruiter-friendly summary: metrics first, owner scope second — no generic positioning fluff. */
export function buildRecruiterSummary(raw) {
  const base = String(raw?.summary || "").trim();
  const sentences = base.split(/(?<=[.!?])\s+/).filter(Boolean);
  let out = sentences.slice(0, 2).join(" ");

  const ec = raw?.employer_context;
  if (ec?.role_framing?.scope || ec?.role_framing?.executive_partner) {
    const line =
      "Sole hands-on technology owner for a four-brand group—ERP, CRM, field apps, and automation—with family leadership on ROI (self-hosted stack and FinOps, not SaaS sprawl).";
    if (!/sole|de facto|only person/i.test(out)) {
      out = out ? `${out} ${line}` : line;
    }
  }

  if (out.length > 620) {
    out = out.slice(0, 617).replace(/\s+\S*$/, "") + ".";
  }
  return out || base.slice(0, 400);
}

export function syncTaglineFromRaw(raw, baselineTagline) {
  const ec = raw?.employer_context?.role_framing?.primary_focus_2026;
  if (ec && ec.length < 160) return ec;
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

/** Optional one-line positioning from cover letter context (verified facts only). */
export function appendSummaryFromContext(summary, contextJson) {
  if (!contextJson?.identity?.positioning) return summary;
  const line = String(contextJson.identity.positioning).trim();
  if (!line || summary.includes(line.slice(0, 40))) return summary;
  const merged = `${summary} ${line}`.trim();
  return merged.length > 520 ? summary : merged;
}
