import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  className,
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-10 sm:py-12 print-break-inside-avoid", className)}
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`} className="text-section-title mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}
