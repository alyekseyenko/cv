import { Badge } from "@/components/ui/badge";

export function SkillGroup({
  name,
  skills,
}: {
  name: string;
  skills: string[];
}) {
  if (skills.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-foreground">{name}</h3>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="outline"
            className="rounded-md border-border/80 bg-background px-2 py-0.5 font-normal"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
