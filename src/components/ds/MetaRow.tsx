import { cn } from "@/lib/utils";

export function MetaRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5 sm:flex-row sm:gap-3", className)}>
      <span className="text-section-title shrink-0 sm:w-28">{label}</span>
      <span className="text-sm text-foreground/90">{value}</span>
    </div>
  );
}
