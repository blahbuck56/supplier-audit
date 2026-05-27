import { cn } from "@/lib/utils";
import { getScoreDotColor } from "@/lib/audit-types";

interface ScoreDotProps {
  score: number;
  size?: number;
  className?: string;
}

export function ScoreDot({ score, size = 8, className }: ScoreDotProps) {
  const colorClass = getScoreDotColor(score);
  const label =
    score >= 75 ? "strong" : score >= 55 ? "moderate" : score > 0 ? "weak" : "insufficient data";

  return (
    <span
      aria-label={`Score ${score}: ${label}`}
      role="img"
      className={cn("inline-block rounded-full shrink-0", colorClass, className)}
      style={{ width: size, height: size }}
    />
  );
}

interface StaticDotProps {
  color: "green" | "amber" | "red" | "gray";
  size?: number;
  className?: string;
}

export function StaticDot({ color, size = 8, className }: StaticDotProps) {
  const colorMap = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    gray: "bg-gray-400",
  };
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block rounded-full shrink-0", colorMap[color], className)}
      style={{ width: size, height: size }}
    />
  );
}
