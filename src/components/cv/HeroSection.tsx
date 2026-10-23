import { MetaRow } from "@/components/ds";
import { Separator } from "@/components/ui/separator";
import type { PersonalInfo } from "@/lib/cv-types";
import { Mail } from "lucide-react";

export function HeroSection({ info }: { info: PersonalInfo }) {
  return (
    <header id="top" className="pt-14 pb-8 sm:pt-20 sm:pb-10">
      <div className="grid gap-8 xl:grid-cols-2 xl:items-end xl:gap-12">
        <div>
          <h1 className="font-heading text-display text-foreground">{info.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground sm:text-xl">{info.title}</p>
          {info.tagline ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              {info.tagline}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">{info.location}</p>
        </div>
        <div className="flex flex-col gap-3 xl:pb-1">
          <MetaRow
            label="Email"
            value={
              <a
                href={`mailto:${info.email}`}
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <Mail className="size-3.5 opacity-60" aria-hidden />
                {info.email}
              </a>
            }
          />
          <MetaRow
            label="LinkedIn"
            value={
              <a
                href={info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                Profile ↗
              </a>
            }
          />
          {info.github ? (
            <MetaRow
              label="GitHub"
              value={
                <a
                  href={info.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  alyekseyenko ↗
                </a>
              }
            />
          ) : null}
        </div>
      </div>
      <Separator className="my-8 bg-border/70" />
    </header>
  );
}
