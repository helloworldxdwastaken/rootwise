import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
  variant?: "text" | "card" | "circle" | "bar";
  lines?: number;
};

export function LoadingSkeleton({ 
  className, 
  variant = "card",
  lines = 1 
}: LoadingSkeletonProps) {
  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 animate-pulse rounded bg-slate-200",
              i === lines - 1 && "w-4/5", // Last line shorter
              className
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    return (
      <div
        className={cn(
          "animate-pulse rounded-full bg-slate-200",
          className
        )}
      />
    );
  }

  if (variant === "bar") {
    return (
      <div
        className={cn(
          "h-2 animate-pulse rounded-full bg-slate-200",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-slate-200",
        className
      )}
    />
  );
}

