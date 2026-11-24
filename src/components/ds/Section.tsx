import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  subtitle,
  className,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-10 sm:py-12 print-break-inside-avoid", className)}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mb-6">
        <h2 id={`${id}-heading`} className="text-section-title">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
