import {
  Container,
  Metric,
  ProjectCard,
  Section,
  SkillGroup,
  Timeline,
  WorkList,
} from "@/components/ds";
import { HeroSection } from "@/components/cv/HeroSection";
import { SiteNav } from "@/components/cv/SiteNav";
import { cv } from "@/lib/cv";

export function CvPage() {
  const skillEntries = Object.entries(cv.skill_groups).filter(
    ([, skills]) => skills.length > 0,
  );

  return (
    <>
      <SiteNav />
      <main>
        <Container>
          <HeroSection info={cv.personal_info} />

          <Section id="about" title="About">
            <div className="grid gap-8 xl:grid-cols-2 xl:gap-12">
              <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                {cv.summary}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cv.highlights.map((h) => (
                  <Metric key={h.label} label={h.label} value={h.value} />
                ))}
              </div>
            </div>
          </Section>

          <Section id="experience" title="Experience">
            <Timeline items={cv.experience} />
          </Section>

          <Section id="projects" title="Selected projects">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
              {cv.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Section>

          <Section id="other-work" title="Other work">
            <WorkList items={cv.other_work} />
          </Section>

          <Section id="skills" title="Skills">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {skillEntries.map(([name, skills]) => (
                <SkillGroup key={name} name={name} skills={skills} />
              ))}
            </div>
          </Section>

          <Section id="education" title="Education & credentials" className="pb-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <p className="text-section-title mb-4">Education</p>
                <ul className="space-y-4">
                  {cv.education.map((ed) => (
                    <li key={ed.degree} className="print-break-inside-avoid">
                      <h3 className="text-sm font-medium">{ed.degree}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ed.institution} · {ed.details}
                      </p>
                      {ed.honors ? (
                        <p className="mt-1 text-xs text-muted-foreground">{ed.honors}</p>
                      ) : null}
                      {ed.supplementary ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {ed.supplementary}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-section-title mb-4">Certifications</p>
                <ul className="space-y-2 text-sm">
                  {cv.certifications.map((cert) => (
                    <li
                      key={cert.name}
                      className="break-inside-avoid text-foreground/85"
                    >
                      <span className="font-medium">{cert.name}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {cert.issuer}
                        {cert.issued ? ` (${cert.issued})` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-section-title mb-3">Languages</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/85">
                {cv.languages.map((lang) => (
                  <li key={lang}>{lang}</li>
                ))}
              </ul>
            </div>
          </Section>
        </Container>
      </main>
      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        <Container>
          © {new Date().getFullYear()} {cv.personal_info.name}
        </Container>
      </footer>
    </>
  );
}
