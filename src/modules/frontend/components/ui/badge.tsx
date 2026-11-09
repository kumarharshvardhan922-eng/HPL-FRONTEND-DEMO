import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "live" | "upcoming" | "completed" | "warning" | "outline" | "lavender";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-semibold rounded-full select-none";

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  const variantStyles = {
    default: "bg-hpl-surface-2 text-hpl-accent border border-hpl-border",
    lavender: "bg-hpl-surface-2 text-hpl-accent-soft border border-hpl-border",
    live: "bg-hpl-live text-white shadow-sm shadow-red-500/30",
    upcoming: "bg-hpl-surface-2 text-hpl-accent border border-hpl-border",
    completed: "bg-hpl-surface-2 text-hpl-muted border border-hpl-border",
    warning: "bg-hpl-gold/20 text-hpl-gold border border-hpl-gold/40",
    outline: "border border-hpl-border text-hpl-muted bg-transparent",
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {variant === "live" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
      )}
      {children}
    </span>
  );
};
