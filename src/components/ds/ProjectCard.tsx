import type { Project } from "@/lib/cv-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col border border-border bg-card shadow-none ring-0 print-break-inside-avoid">
      <CardHeader className="space-y-2 p-5 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base font-medium leading-snug">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                {project.title}
                <ExternalLink className="size-3.5 shrink-0 opacity-50" aria-hidden />
              </a>
            ) : (
              project.title
            )}
          </CardTitle>
          {project.period ? (
            <span className="font-mono-data text-xs text-muted-foreground">
              {project.period}
            </span>
          ) : null}
        </div>
        {project.company ? (
          <p className="text-xs text-muted-foreground">{project.company}</p>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4 p-5 pt-2">
        <div className="space-y-3 text-sm leading-relaxed">
          {project.problem ? (
            <div>
              <p className="text-section-title mb-1">Problem</p>
              <p className="text-foreground/85">{project.problem}</p>
            </div>
          ) : null}
          {project.built ? (
            <div>
              <p className="text-section-title mb-1">Built</p>
              <p className="text-foreground/85">{project.built}</p>
            </div>
          ) : null}
          {project.impact?.length ? (
            <div>
              <p className="text-section-title mb-1">Impact</p>
              <ul className="space-y-1.5 text-foreground/80">
                {project.impact.map((item) => (
                  <li
                    key={item.slice(0, 48)}
                    className="border-l-2 border-border pl-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {project.tech?.length ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tech.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-md px-2 py-0 font-normal text-muted-foreground"
              >
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
