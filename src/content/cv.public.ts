import type { CvData } from "@/lib/cv-types";

export const cvPublic: CvData = {
  personal_info: {
    name: "Vadym Alyekseyenko",
    title: "AI & Automation Engineer · Digital Transformation Lead",
    tagline:
      "I build and run production AI and automation systems for a four-brand group, partnering with owners on strategy and delivery.",
    email: "vadymalyekseyenko@gmail.com",
    phone: "+351910799500",
    location: "Portugal · remote (EU / US)",
    website: "https://www.linkedin.com/in/vadym-alyekseyenko-0113b11b0/",
    github: "https://github.com/alyekseyenko",
  },
  summary:
    "I lead digital transformation and hands-on engineering for HABITARMOS / ESTORESRAINHA GROUP: ERP and CRM data platforms, field apps, quoting, observability, and agent-assisted operations. I work directly with owners, coach cross-functional teams, and ship software that stays in production. On the side I run ALYGEN, a freelance B2B practice focused on automation and web delivery for SMBs.",
  highlights: [
    { label: "Production workflows", value: "80+" },
    { label: "Hours saved monthly", value: "~465h" },
    { label: "Daily field app users", value: "40" },
    { label: "Distributors synced", value: "500+" },
    { label: "ERP rows in cloud replica", value: "5M+" },
  ],
  experience: [
    {
      company: "HABITARMOS / ESTORESRAINHA GROUP",
      location: "Portugal",
      role: "Digital Transformation Lead & AI/Automation Engineer",
      period: "Jan 2026 – Present",
      bullets: [
        "Own the group digital roadmap across four brands: CRM, automation, field systems, and executive visibility.",
        "Delivered a governed PHC ERP cloud read replica with analytics marts so leadership and CRM use consistent data instead of ad-hoc SQL.",
        "Built the HABITAI operations layer: agent tooling, inventory and logistics workflows, and KPI surfaces for owners.",
        "Scaled production automation (n8n, Zoho Flow, Make.com) and ran a 55-project Innovation Hub with about 465 hours saved per month and roughly 28-day average delivery.",
      ],
    },
    {
      company: "HABITARMOS / ESTORESRAINHA GROUP",
      location: "Portugal",
      role: "Senior AI Systems and Automation Engineer",
      period: "Jan 2024 – Dec 2025",
      bullets: [
        "Connected PHC ERP to Zoho Bigin for 500+ distributors with accounts, contacts, and pipeline visibility for sales.",
        "Led the ESTORESRAINHA digital turnaround: scheduling, catalog, service tracking, and CRM ingestion for 15k+ customers.",
        "Shipped the field PWA (app-tecnicos) for technicians and warehouse teams: offline-first sync, maps, and CRM integration.",
        "Built orcamentos-ia, a multi-supplier quoting platform that turns field measurements into auditable proposals in minutes.",
      ],
    },
    {
      company: "HABITARMOS / ESTORESRAINHA GROUP",
      location: "Portugal",
      role: "Software and Automation Developer",
      period: "Jul 2020 – Dec 2023",
      bullets: [
        "Created the group web presence across four brands on WordPress, including ARKITEK and SKUBA catalog sites with strong SEO.",
        "Introduced automation for catalog visuals and SKU matching using generative and computer-vision pipelines.",
        "Partnered with marketing and operations to replace manual processes with measurable digital channels.",
      ],
    },
    {
      company: "ALYGEN (freelance B2B practice)",
      location: "Portugal / Remote",
      role: "Freelance B2B Automation & Digital Services Consultant",
      period: "2021 – Present",
      bullets: [
        "Run ALYGEN: web, automation, and digital operations for SMB clients with a focus on measurable leads and revenue.",
        "Built Alygen CRM, an open-source sales stack with automated audits, lead scoring, and multi-channel outreach.",
        "Long-term delivery for coaching and wellness clients: WordPress/WooCommerce properties, SEO, and event ticketing in production.",
      ],
    },
  ],
  projects: [
    {
      id: "habitai",
      title: "HABITAI · Unified Operations Platform",
      period: "2023 – Present",
      company: "HABITARMOS / ESTORESRAINHA GROUP",
      problem:
        "Operations data lived in ERP, CRM, logistics, and spreadsheets with no single place for owners or field teams to act.",
      built:
        "Operations cockpit tying PHC data, CRM sync, automation, inventory signals, and agent-assisted Q&A on governed metrics.",
      impact: [
        "One surface for leadership KPIs and day-to-day ops across four brands.",
        "Grounded agent workflows instead of guessing from raw LAN databases.",
        "Foundation for field apps, quoting, and observability built on the same data layer.",
      ],
      tech: ["Python", "FastAPI", "PostgreSQL", "n8n", "MCP", "Metabase", "Docker"],
    },
    {
      id: "phc_replica",
      title: "PHC ERP · Cloud Read Replica",
      period: "2024 – Present",
      company: "HABITARMOS / ESTORESRAINHA GROUP",
      problem:
        "CRM and automations could not safely use live ERP data without exposing on-prem SQL or copying numbers by hand.",
      built:
        "Hybrid sync to PostgreSQL on a VPS, dbt marts, role-scoped access, and executive dashboards for two PHC tenants.",
      impact: [
        "5M+ rows available for CRM, alerts, and BI without opening ERP to the internet.",
        "Leadership dashboards on governed metrics instead of one-off exports.",
        "Decoupled integrations from fragile LAN dependencies.",
      ],
      tech: ["PostgreSQL", "dbt", "Docker", "SQL Server", "Metabase", "Python"],
    },
    {
      id: "app_tecnicos",
      title: "app-tecnicos · Field Operations PWA",
      period: "2024 – Present",
      company: "ESTORESRAINHA GROUP",
      link: "https://github.com/alyekseyenko/services-blinds",
      problem:
        "Field service ran on paper: slow customer updates, lost technician time, and no shared schedule when clients called.",
      built:
        "Production PWA with offline queue, maps and routing, warehouse module, and Twenty CRM sync on Hetzner.",
      impact: [
        "40 people use the app daily across field, warehouse, dispatch, and office.",
        "Measurements and visit status replay safely when connectivity returns.",
        "Single operational picture when customers ask who is scheduled and where.",
      ],
      tech: ["Next.js", "TypeScript", "PWA", "Dexie", "GraphQL", "Docker"],
    },
    {
      id: "orcamentos_ia",
      title: "orcamentos-ia · Multi-Supplier Quoting",
      period: "2024 – Present",
      company: "HABITARMOS / ESTORESRAINHA GROUP",
      problem:
        "Quotes depended on manual PDF and spreadsheet work; sales waited days while prices had to stay auditable.",
      built:
        "FastAPI and React platform with supplier plug-ins, deterministic pricing tiers, PDF ingestion, and CRM handoff.",
      impact: [
        "Quote cycles moved from days to minutes with frozen unit prices at proposal time.",
        "20+ supplier catalogs with human review on ingested price lists.",
        "Pairs with field measurements from the technician app.",
      ],
      tech: ["FastAPI", "React", "PostgreSQL", "Celery", "Redis", "Docling"],
    },
    {
      id: "alygen_crm",
      title: "Alygen CRM · B2B Outreach Stack",
      period: "2025 – Present",
      company: "ALYGEN",
      link: "https://github.com/alyekseyenko/alygen",
      problem:
        "Freelance prospecting meant hours of manual site audits and slow, generic proposals per lead.",
      built:
        "Open-source CRM with automated technical audits, ML lead scoring, agent-assisted copy, and email and messaging dispatch.",
      impact: [
        "Scaled outreach from a handful to hundreds of qualified leads per day.",
        "Sub-minute proposals grounded in real site signals instead of templates alone.",
        "Polyglot stack designed for a solo builder budget.",
      ],
      tech: ["React", "Node.js", "FastAPI", "PostgreSQL", "pgvector", "Playwright"],
    },
    {
      id: "risk_radar",
      title: "Container Risk Radar · Fleet Observability",
      period: "2026 – Present",
      company: "HABITARMOS / ESTORESRAINHA GROUP",
      problem:
        "Websites, VPS hosts, containers, and automations were monitored in separate tools with no shared risk picture.",
      built:
        "Docker Compose observability stack with Prometheus, Loki, Grafana, scoring engine, and a Next.js control dashboard.",
      impact: [
        "One place to see drift, failing jobs, SSL gaps, and host pressure before customers notice.",
        "Explainable risk scores per workload instead of alert noise.",
        "Slack and Telegram notifications for on-call visibility.",
      ],
      tech: ["Prometheus", "Grafana", "Loki", "Next.js", "Python", "Docker Compose"],
    },
  ],
  other_work: [
    {
      id: "zohosync",
      title: "ZohoSync · PHC to Zoho Bigin",
      summary:
        "Commercial sync for 500+ distributors: accounts, contacts, pipeline, and rep KPIs from ERP truth.",
    },
    {
      id: "brand_sites",
      title: "Group brand websites",
      summary:
        "WordPress across four public brands including habitarmos.com, estoresrainha.com, arkitek.pt, and skuba.com.pt.",
    },
    {
      id: "rute_carreira",
      title: "Rute Carreira · coaching & wellness",
      summary:
        "End-to-end WordPress and WooCommerce stack, SEO, and ticketing sites that support daily leads and product sales.",
    },
    {
      id: "jobfinder",
      title: "LinkedIn Jobfinder Scout",
      summary:
        "Portfolio agent system for job matching, ATS PDF export, and structured CV ingestion (not affiliated with LinkedIn).",
    },
    {
      id: "praxis",
      title: "Praxis · agent coding harness",
      summary:
        "R&D sandbox with Docker evaluation gates, human approval UI, and vector memory for safer coding agents.",
      link: "https://github.com/alyekseyenko/praxis-alygen",
    },
    {
      id: "lfgbot",
      title: "LFG Valorant · Discord community",
      summary:
        "Discord bot and web app for matchmaking, moderation, and guild analytics for a gaming community.",
    },
  ],
  skill_groups: {
    AI: [
      "LangGraph",
      "Model Context Protocol (MCP)",
      "Generative AI",
      "Machine Learning",
      "Docling",
      "RAG",
      "Vertex AI",
      "CrewAI",
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
  },
  languages: [
    "Portuguese (native)",
    "Ukrainian (native)",
    "Russian (native)",
    "English (full professional proficiency)",
  ],
  education: [
    {
      degree: "BA in Graphic and Multimedia Design",
      institution: "ESAD.CR",
      details: "2017 – 2020",
      honors: "Best student / top graduate (class recognition)",
      supplementary: "Guest sessions on Arduino and programming (2020)",
    },
    {
      degree: "BSc studies in Computer Engineering",
      institution: "ESTG Leiria",
      details: "2014 – 2017",
    },
  ],
  certifications: [
    {
      name: "Microsoft Generative AI Engineering",
      issuer: "Microsoft",
      issued: "2026",
    },
    {
      name: "Machine Learning",
      issuer: "DeepLearning.AI",
      issued: "2026",
    },
    {
      name: "Generative AI Leader",
      issuer: "Google Cloud",
    },
    {
      name: "Professional Scrum Master I (PSM I)",
      issuer: "Scrum.org",
      issued: "2026",
    },
    {
      name: "Google Advanced Data Analytics",
      issuer: "Google",
    },
    {
      name: "Google IT Automation with Python",
      issuer: "Google",
      issued: "2026",
    },
    {
      name: "IBM AI Product Manager",
      issuer: "IBM",
      issued: "2025",
    },
    {
      name: "Google UX Design",
      issuer: "Google",
      issued: "2025",
    },
  ],
};
