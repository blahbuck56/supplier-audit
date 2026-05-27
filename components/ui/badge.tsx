import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium font-mono tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-foreground",
        outline: "border border-border text-muted",
        strategic: "bg-emerald-500 text-white",
        preferred: "bg-amber-500 text-white",
        probation: "bg-red-500 text-white",
        insufficient: "bg-gray-400 text-white",
        navy: "bg-navy text-white",
        muted: "bg-gray-100 text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
