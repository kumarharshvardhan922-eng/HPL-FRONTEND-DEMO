import React from "react";
import { cn } from "../../utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-hpl-surface-2/80 border border-hpl-border/40",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded-md w-full",
        variant === "rectangular" && "rounded-2xl",
        className
      )}
      {...props}
    />
  );
};

export const ScoreboardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-hpl-surface rounded-2xl p-6 border border-hpl-border shadow-card flex flex-col gap-6 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-3 items-center gap-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
};
