import { MetaRow } from "@/components/ds";
import { Separator } from "@/components/ui/separator";
import type { Highlight, PersonalInfo } from "@/lib/cv-types";
import { Mail } from "lucide-react";
import Image from "next/image";

export function HeroSection({
  info,
  snapshotMetrics = [],
}: {
  info: PersonalInfo;
  snapshotMetrics?: Highlight[];
}) {
  const photoSrc = info.photo ?? "/profile.jpeg";

  return (
    <header id="top" className="pt-14 pb-8 sm:pt-20 sm:pb-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] xl:grid-cols-[minmax(0,320px)_1fr_minmax(0,280px)] xl:items-start xl:gap-12">
        {photoSrc ? (
          <div className="mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-none">
            <div className="overflow-hidden rounded-3xl border border-border bg-muted/40">
              <Image
                src={photoSrc}
                alt={info.name}
                width={640}
                height={800}
                priority
                sizes="(max-width: 1024px) 280px, 320px"
                className="aspect-[4/5] w-full object-cover object-[center_18%] sm:max-h-[min(520px,58vh)]"
              />
            </div>
          </div>
        ) : null}
        <div className="min-w-0 text-center lg:text-left">
          <h1 className="font-heading text-display text-foreground">{info.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground sm:text-xl">{info.title}</p>
          {info.tagline ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              {info.tagline}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">{info.location}</p>
          {snapshotMetrics.length > 0 ? (
            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {snapshotMetrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-border/80 bg-muted/30 px-4 py-3 text-left"
                >
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {m.label}
                  </dt>
                  <dd className="mt-1 font-heading text-lg text-foreground sm:text-xl">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2 xl:col-span-1 xl:col-start-3 xl:pt-2">
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
