export type PersonalInfo = {
  name: string;
  title: string;
  tagline?: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github?: string;
  photo?: string;
};

export type Highlight = { label: string; value: string };

export type Experience = {
  company: string;
  location: string;
  role: string;
  period: string;
  bullets: string[];
};

export type Project = {
  id: string;
  title: string;
  period: string;
  company: string;
  link?: string;
  problem: string;
  built: string;
  impact: string[];
  tech: string[];
};

export type OtherWork = {
  id: string;
  title: string;
  summary: string;
  link?: string;
};

export type Certification = {
  name: string;
  issuer: string;
  issued?: string;
};

export type Education = {
  degree: string;
  institution: string;
  details: string;
  honors?: string;
  supplementary?: string;
};

export type CvData = {
  personal_info: PersonalInfo;
  summary: string;
  highlights: Highlight[];
  experience: Experience[];
  projects: Project[];
  other_work: OtherWork[];
  skill_groups: Record<string, string[]>;
  languages: string[];
  education: Education[];
  certifications: Certification[];
};
