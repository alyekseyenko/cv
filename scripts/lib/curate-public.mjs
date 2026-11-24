import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  syncHighlightsFromRaw,
  syncTaglineFromRaw,
  buildRecruiterSummary,
} from "./merge-live-context.mjs";
import { dedupeExperienceBullets } from "./dedupe-public.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SKILL_GROUPS = {
  AI: [
    "LangGraph",
    "Model Context Protocol (MCP)",
    "Docling",
    "Qdrant",
    "ColPali",
    "Generative AI",
    "Machine Learning",
    "Vertex AI",
  ],
  Engineering: [
    "Python",
    "TypeScript",
    "FastAPI",
    "React",
    "Next.js",
    "GraphQL",
    "Celery",
    "Vitest",
    "Playwright",
  ],
  Data: [
    "PostgreSQL",
    "pgvector",
    "dbt",
    "SQL Server",
    "Redis",
    "Metabase",
    "ELT",
    "Data warehousing",
  ],
  "Cloud & Ops": [
    "Docker",
    "Docker Compose",
    "Linux",
    "GitHub Actions",
    "Hetzner Cloud",
    "Google Cloud Platform (GCP)",
    "Google Cloud Platform",
    "Prometheus",
    "Grafana",
    "Loki",
    "Alertmanager",
  ],
  "Automation & CRM": [
    "n8n",
    "Make.com",
    "Zoho Bigin",
    "Zoho Flow",
    "Twenty CRM",
    "PHC ERP",
    "Process Automation",
  ],
};

const BULLET_BLOCK_RE =
  /2x nominal|2,890|2890%|2409%|€814|814k|396h|33-person|€6,100|€11,100|€6m|€7m|98% match|ragas|innovation_hub_roi|not audited|internal figures|growth not profit|local path:|this repo|rute carreira|rute c\.|rutecarreira|asuaessencia|oseuplanob|snapshot \(11:21\)|habitarmos_revenue|4 direct reports|lead 4 people|4-person|habitarmos-phc-replica|ssh tunnel|~8\.9\s*gb/i;

const COPY_FIXES = [
  [
    /WordPress for corporate \(faster editorial\) and hand-built HTML for ARKITEK\/SKUBA/gi,
    "custom HTML/CSS for habitarmos.com and estoresrainha.com and WordPress catalogs on arkitek.pt and skuba.com.pt",
  ],
  [/BA in Graphic and Multimedia Design/gi, "BA in Multimedia Design"],
  [/\b40 daily users\b/gi, "~20 people"],
];

export function normalizeCopy(text) {
  if (typeof text !== "string") return text;
  let s = text
    .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, "$1-$2")
    .replace(/\u2014|\u2013/g, " · ")
    .replace(/\)\s*—\s*/g, "), ")
    .replace(/\s*—\s*/g, " · ");
  for (const [pattern, replacement] of COPY_FIXES) {
    s = s.replace(pattern, replacement);
  }
  return s.replace(/\s+/g, " ").trim();
}

function flattenTechStack(tech) {
  if (!tech) return [];
  if (Array.isArray(tech)) return tech;
  return Object.values(tech).flatMap((v) =>
    Array.isArray(v) ? v : typeof v === "string" ? [v] : [],
  );
}

const TECH_DENY = /dashboard|SQLite catalog|CEO\/SRE|visit summaries|optional_profiles/i;

function pickTech(techStack, limit = 6) {
  return flattenTechStack(techStack)
    .filter((t) => typeof t === "string" && t.length < 40 && !TECH_DENY.test(t))
    .slice(0, limit);
}

function curateExperience(experience) {
  return (experience ?? []).map((role) => ({
    company: role.company,
    location: role.location,
    role: role.role,
    period: normalizeCopy(role.period),
    bullets: (role.bullets ?? [])
      .map((b) => normalizeCopy(b))
      .filter((b) => b && !BULLET_BLOCK_RE.test(b))
      .slice(0, 5),
  }));
}

function applyExperienceOverlays(experience, overlays) {
  if (!overlays || typeof overlays !== "object") return experience;
  return experience.map((role) => {
    const extra = overlays[role.company];
    if (!extra?.length) return role;
    if (role.bullets?.length) return role;
    return { ...role, bullets: extra.map((b) => normalizeCopy(b)).slice(0, 3) };
  });
}

function buildSkillGroups(hardSkills) {
  const hardSet = new Set(hardSkills ?? []);
  const groups = Object.fromEntries(
    Object.entries(SKILL_GROUPS).map(([name, skills]) => [
      name,
      skills.filter((s) => hardSet.has(s) || hardSet.has(s.replace(" (GCP)", ""))),
    ]),
  );
  for (const [name, list] of Object.entries(groups)) {
    groups[name] = [
      ...new Set(list.map((s) => s.replace("Google Cloud Platform (GCP)", "Google Cloud Platform"))),
    ];
  }
  return groups;
}

function curateCertifications(certs, allowlist) {
  const allowed = new Set(allowlist);
  return (certs ?? [])
    .filter((c) => allowed.has(c.name) && Boolean(c.issued))
    .map(({ name, issuer, issued }) => ({
      name,
      issuer,
      issued: String(issued).slice(0, 4),
    }));
}

function safePublicLink(rawProject, overlay) {
  const candidate = overlay.link ?? rawProject.link ?? "";
  return /^https?:\/\//i.test(String(candidate).trim()) ? String(candidate).trim() : undefined;
}

function mapFeaturedProject(rawProject, overlay) {
  const fromRaw = (rawProject.edges_outcomes ?? [])
    .map((o) => normalizeCopy(o))
    .filter((o) => o && !BULLET_BLOCK_RE.test(o))
    .slice(0, 3);
  const impact =
    overlay.impact?.length
      ? overlay.impact.map((o) => normalizeCopy(o))
      : fromRaw.length
        ? fromRaw
        : [normalizeCopy(rawProject.context || "").slice(0, 160)];

  const tech =
    overlay.tech?.length
      ? overlay.tech
      : overlay.edges_skills?.length
        ? overlay.edges_skills.slice(0, 6)
        : pickTech(rawProject.tech_stack);

  return {
    id: rawProject.id,
    title: overlay.title || normalizeCopy(rawProject.title),
    period: normalizeCopy(rawProject.period),
    company: normalizeCopy(rawProject.company),
    link: safePublicLink(rawProject, overlay),
    problem: overlay.problem || normalizeCopy(rawProject.context?.split(/(?<=[.!?])\s+/)[0] || ""),
    built:
      overlay.built ||
      normalizeCopy(rawProject.role || rawProject.context?.split(/(?<=[.!?])\s+/)[1] || ""),
    impact,
    tech,
  };
}

function buildPublicProjectList(raw, baseline, projectsById) {
  const order = baseline.featured_project_ids ?? [];
  const exclude = new Set(baseline.exclude_project_ids ?? []);
  const includeAll = baseline.include_all_master_projects === true;

  const orderedIds = [];
  const seen = new Set();

  for (const id of order) {
    if (exclude.has(id) || !projectsById[id]) continue;
    orderedIds.push(id);
    seen.add(id);
  }

  if (includeAll) {
    for (const p of raw.projects ?? []) {
      if (!p?.id || exclude.has(p.id) || seen.has(p.id)) continue;
      orderedIds.push(p.id);
      seen.add(p.id);
    }
  }

  return orderedIds.map((id) =>
    mapFeaturedProject(projectsById[id], baseline.project_overlays[id] ?? {}),
  );
}

export function buildPublicCv(raw, baselinePath) {
  const baseline = JSON.parse(
    readFileSync(baselinePath ?? join(__dirname, "..", "cv-public-baseline.json"), "utf8"),
  );

  const highlights = syncHighlightsFromRaw(raw, baseline.highlights);
  const tagline = syncTaglineFromRaw(raw, baseline.personal_info.tagline);

  const projectsById = Object.fromEntries((raw.projects ?? []).map((p) => [p.id, p]));
  const featured = buildPublicProjectList(raw, baseline, projectsById);

  const summary = buildRecruiterSummary(raw, highlights);

  const experience = applyExperienceOverlays(
    dedupeExperienceBullets(curateExperience(raw.experience)),
    baseline.experience_overlays,
  );

  const info = raw.personal_info ?? {};

  return {
    personal_info: {
      name: info.name || "Vadym Alyekseyenko",
      title: baseline.personal_info.title || info.title || "Applied AI & Automation Engineer",
      tagline,
      email: info.email,
      phone: info.phone,
      location: baseline.personal_info.location,
      website: info.website,
      github: baseline.personal_info.github,
      photo: baseline.personal_info.photo,
      pdf_url: baseline.personal_info.pdf_url,
    },
    summary,
    highlights,
    experience,
    projects: featured,
    other_work: baseline.other_work ?? [],
    skill_groups: buildSkillGroups(raw.hard_skills),
    languages: raw.languages ?? [],
    education: (raw.education ?? []).map((ed) => ({
      degree: normalizeCopy(ed.degree),
      institution: ed.institution,
      details: normalizeCopy(ed.details),
      honors: ed.honors ? normalizeCopy(ed.honors) : undefined,
      supplementary: ed.supplementary ? normalizeCopy(ed.supplementary) : undefined,
    })),
    certifications: curateCertifications(
      raw.certifications,
      baseline.certification_allowlist,
    ),
  };
}
