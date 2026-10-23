import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-none px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
