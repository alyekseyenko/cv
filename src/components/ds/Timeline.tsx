import type { Experience } from "@/lib/cv-types";

export function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="grid grid-cols-1 gap-10 xl:grid-cols-2 xl:gap-x-12 xl:gap-y-10">
      {items.map((item) => (
        <li key={`${item.company}-${item.period}`} className="print-break-inside-avoid">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h3 className="text-base font-medium text-foreground">{item.role}</h3>
              <p className="text-sm text-muted-foreground">
                {item.company}
                {item.location ? ` · ${item.location}` : ""}
              </p>
            </div>
            <time
              className="font-mono-data shrink-0 text-xs text-muted-foreground sm:text-right"
              dateTime={item.period}
            >
              {item.period}
            </time>
          </div>
          <ul className="mt-4 list-none space-y-2.5 text-sm leading-relaxed text-foreground/85">
            {item.bullets.map((bullet) => (
              <li key={bullet.slice(0, 48)} className="relative pl-4 before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-border">
                {bullet}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
