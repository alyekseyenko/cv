import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SKILL_GROUPS = {
  AI: [
    "LangGraph",
    "Model Context Protocol (MCP)",
    "Generative AI",
    "Machine Learning",
    "Docling",
    "CrewAI",
    "Qdrant",
    "Vertex AI",
  ],
  Engineering: [
    "Python",
    "TypeScript",
    "FastAPI",
    "React",
    "Next.js",
    "GraphQL",
    "Playwright",
    "Celery",
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
    "Google Cloud Platform (GCP)",
    "Google Cloud Platform",
    "Hetzner Cloud",
    "Prometheus",
    "Grafana",
    "GitHub Actions",
    "Observability",
  ],
  "Automation & CRM": [
    "n8n",
    "Zoho Bigin",
    "Zoho Flow",
    "Make.com",
    "Twenty CRM",
    "PHC ERP",
    "Process Automation",
    "WordPress",
  ],
};

const BULLET_BLOCK_RE =
  /2x nominal|2,890|2890%|€6,100|€11,100|innovation_hub_roi|not audited|internal figures|growth not profit|local path:|this repo|Rute C\.|snapshot \(11:21\)|habitarmos_revenue/i;

const COPY_FIXES = [
  [/arkitek\.pt & skuba\.com\.pt \(HTML\)/gi, "arkitek.pt & skuba.com.pt (WordPress)"],
  [
    /WordPress for corporate \(faster editorial\) and hand-built HTML for ARKITEK\/SKUBA product catalogs/gi,
    "WordPress across all four brand sites (corporate and ARKITEK/SKUBA catalogs)",
  ],
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

function curateSummary(summary) {
  const text = normalizeCopy(summary || "");
  if (!text) return "";
  const sentences = text.split(/(?<=[.!?])\s+/).slice(0, 3);
  return sentences.join(" ");
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
      .slice(0, 4),
  }));
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
    groups[name] = [...new Set(list.map((s) => s.replace("Google Cloud Platform (GCP)", "Google Cloud Platform")))];
  }
  return groups;
}

function curateCertifications(certs, allowlist) {
  const allowed = new Set(allowlist);
  return (certs ?? [])
    .filter((c) => allowed.has(c.name))
    .map(({ name, issuer, issued }) => ({
      name,
      issuer,
      issued: issued ? String(issued).slice(0, 4) : undefined,
    }));
}

function mapFeaturedProject(rawProject, overlay) {
  const impact = (rawProject.edges_outcomes ?? [])
    .map((o) => normalizeCopy(o))
    .filter((o) => o && !BULLET_BLOCK_RE.test(o))
    .slice(0, 3);

  return {
    id: rawProject.id,
    title: overlay.title || normalizeCopy(rawProject.title),
    period: normalizeCopy(rawProject.period),
    company: normalizeCopy(rawProject.company),
    link: rawProject.link || undefined,
    problem: overlay.problem || normalizeCopy(rawProject.context?.split(/(?<=[.!?])\s+/)[0] || ""),
    built:
      overlay.built ||
      normalizeCopy(rawProject.role || rawProject.context?.split(/(?<=[.!?])\s+/)[1] || ""),
    impact: impact.length ? impact : [normalizeCopy(rawProject.context || "").slice(0, 160)],
    tech: pickTech(rawProject.tech_stack),
  };
}

export function buildPublicCv(raw, baselinePath) {
  const baseline = JSON.parse(
    readFileSync(baselinePath ?? join(__dirname, "..", "cv-public-baseline.json"), "utf8"),
  );

  const projectsById = Object.fromEntries((raw.projects ?? []).map((p) => [p.id, p]));
  const featured = baseline.featured_project_ids
    .map((id) => {
      const rawProject = projectsById[id];
      if (!rawProject) return null;
      return mapFeaturedProject(rawProject, baseline.project_overlays[id] ?? {});
    })
    .filter(Boolean);

  const info = raw.personal_info ?? {};

  return {
    personal_info: {
      name: info.name || "Vadym Alyekseyenko",
      title: baseline.personal_info.title,
      tagline: baseline.personal_info.tagline,
      email: info.email,
      phone: info.phone,
      location: baseline.personal_info.location,
      website: info.website,
      github: baseline.personal_info.github,
      photo: baseline.personal_info.photo,
    },
    summary: curateSummary(raw.summary),
    highlights: baseline.highlights,
    experience: curateExperience(raw.experience),
    projects: featured,
    other_work: baseline.other_work,
    skill_groups: buildSkillGroups(raw.hard_skills),
    languages: raw.languages ?? [],
    education: (raw.education ?? []).map((ed) => ({
      degree: ed.degree,
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
