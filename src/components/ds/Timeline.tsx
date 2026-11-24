import type { Experience } from "@/lib/cv-types";

export function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative space-y-10 border-l border-border/80 pl-6 sm:pl-8">
      {items.map((item, idx) => (
        <li
          key={`${item.company}-${item.period}`}
          className="relative print-break-inside-avoid"
        >
          <span
            aria-hidden
            className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background sm:-left-[37px] ${
              idx === 0 ? "bg-foreground" : "bg-muted-foreground/50"
            }`}
          />
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
          <ul className="mt-3.5 max-w-4xl list-none space-y-2 text-sm leading-relaxed text-foreground/85">
            {item.bullets.map((bullet) => (
              <li
                key={bullet.slice(0, 48)}
                className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/50"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
