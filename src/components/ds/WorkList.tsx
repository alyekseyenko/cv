import type { OtherWork } from "@/lib/cv-types";
import { ExternalLink } from "lucide-react";

export function WorkList({ items }: { items: OtherWork[] }) {
  return (
    <ul className="divide-y divide-border/70 rounded-xl border border-border bg-card">
      {items.map((item) => (
        <li key={item.id} className="px-5 py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              >
                {item.title}
                <ExternalLink className="size-3.5 opacity-50" aria-hidden />
              </a>
            ) : (
              <span className="text-sm font-medium">{item.title}</span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
        </li>
      ))}
    </ul>
  );
}
