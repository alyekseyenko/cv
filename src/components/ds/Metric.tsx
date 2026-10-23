import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "border border-border bg-card shadow-none ring-0 print:border print:shadow-none",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-1 p-4">
        <span className="font-mono-data text-lg font-medium tracking-tight text-foreground">
          {value}
        </span>
        <span className="text-xs leading-snug text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
