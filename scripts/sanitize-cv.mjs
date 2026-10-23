import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sourcePath =
  process.env.CV_SOURCE ??
  "C:\\Users\\habit\\Desktop\\linked - Cópia (4) - Cópia\\backend\\user_cv.json";

const raw = JSON.parse(readFileSync(sourcePath, "utf8"));

const SKILL_GROUPS = {
  AI: [
    "LangGraph",
    "Model Context Protocol (MCP)",
    "Generative AI",
    "Machine Learning",
    "CrewAI",
    "Docling",
    "ColPali",
    "Vertex AI",
    "Qdrant",
  ],
  Backend: [
    "Python",
    "FastAPI",
    "Celery",
    "SQLAlchemy",
    "GraphQL",
    "BullMQ",
    "Playwright",
  ],
  Frontend: [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "shadcn/ui",
    "Tremor",
    "PWA",
    "Dexie",
  ],
  Data: [
    "PostgreSQL",
    "pgvector",
    "dbt",
    "ELT",
    "Data warehousing",
    "Data Analytics",
    "Data Visualization",
    "Metabase",
    "SQL Server",
    "Redis",
  ],
  "Cloud & Ops": [
    "Docker",
    "Docker Compose",
    "Google Cloud Platform (GCP)",
    "Hetzner Cloud",
    "Prometheus",
    "Grafana",
    "Loki",
    "Observability",
    "GitHub Actions",
  ],
  "Automation & CRM": [
    "n8n",
    "Zoho Bigin",
    "Zoho Flow",
    "Make.com",
    "Twenty CRM",
    "PHC ERP",
    "Process Automation",
  ],
  Design: ["UX Design", "Figma", "SEO", "Digital Marketing", "e-Commerce", "WordPress"],
};

const COPY_FIXES = [
  [/arkitek\.pt & skuba\.com\.pt \(HTML\)/gi, "arkitek.pt & skuba.com.pt (WordPress)"],
  [
    /WordPress for corporate \(faster editorial\) and hand-built HTML for ARKITEK\/SKUBA product catalogs/gi,
    "WordPress across all four brand sites (corporate and ARKITEK/SKUBA catalogs)",
  ],
  [/hand-built HTML for ARKITEK\/SKUBA/gi, "WordPress for ARKITEK/SKUBA"],
];

function normalizeCopy(text) {
  if (typeof text !== "string") return text;
  let s = text.replace(/\)\s*—\s*/g, "), ").replace(/\s*—\s*/g, " · ");
  for (const [pattern, replacement] of COPY_FIXES) {
    s = s.replace(pattern, replacement);
  }
  return s;
}

function normalizeContent(value) {
  if (typeof value === "string") return normalizeCopy(value);
  if (Array.isArray(value)) return value.map(normalizeContent);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeContent(entry)]),
    );
  }
  return value;
}

function flattenTechStack(tech) {
  if (!tech) return [];
  if (Array.isArray(tech)) return tech;
  return Object.values(tech).flatMap((v) =>
    Array.isArray(v) ? v : typeof v === "string" ? [v] : [],
  );
}

function sanitizeProject(p) {
  return {
    id: p.id,
    title: p.title,
    context: p.context,
    role: p.role,
    period: p.period,
    company: p.company,
    link: p.link || undefined,
    portfolio_priority: p.portfolio_priority ?? "unset",
    tech: flattenTechStack(p.tech_stack).slice(0, 12),
    outcomes: (p.edges_outcomes ?? []).slice(0, 4),
  };
}

const priority = (p) => p.portfolio_priority ?? "unset";
const projects = (raw.projects ?? []).map(sanitizeProject);
const featured = projects.filter((p) => priority(p) !== "low");
const more = projects.filter((p) => priority(p) === "low");

const hardSet = new Set(raw.hard_skills ?? []);
const skill_groups = Object.fromEntries(
  Object.entries(SKILL_GROUPS).map(([name, skills]) => [
    name,
    skills.filter((s) => hardSet.has(s)),
  ]),
);
const grouped = new Set(Object.values(skill_groups).flat());
const other = [...hardSet].filter((s) => !grouped.has(s)).sort();
if (other.length) skill_groups.Other = other;

const out = {
  personal_info: {
    ...raw.personal_info,
    github: "https://github.com/alyekseyenko",
  },
  summary: raw.summary,
  highlights: [
    { label: "Production workflows", value: "80+" },
    { label: "Innovation Hub projects", value: "55" },
    { label: "Staff coached", value: "~40" },
    { label: "Group brands", value: "4" },
    { label: "Freelance closed (ALYGEN)", value: "€20k+" },
  ],
  experience: raw.experience,
  projects: featured,
  projects_more: more,
  skill_groups,
  soft_skills: raw.soft_skills,
  languages: raw.languages,
  education: raw.education,
  certifications: (raw.certifications ?? []).map(({ name, issuer, issued }) => ({
    name,
    issuer,
    issued,
  })),
  books_read: raw.books_read,
};

const normalized = normalizeContent(out);

const dest = join(root, "src", "content", "cv.source.json");
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(normalized, null, 2), "utf8");
console.log(
  `Wrote ${dest} (${featured.length} featured, ${more.length} more). Public site uses cv.public.ts.`,
);
