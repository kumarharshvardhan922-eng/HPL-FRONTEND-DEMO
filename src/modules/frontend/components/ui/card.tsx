import React from "react";
import { cn } from "../../utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "lavender" | "hero" | "surface";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-hpl-surface border border-hpl-border shadow-card text-white",
      lavender: "bg-hpl-surface-2 border border-hpl-border shadow-soft text-white",
      surface: "bg-hpl-surface-2 border border-hpl-border shadow-soft text-white",
      hero: "bg-gradient-to-br from-hpl-surface via-hpl-surface-2 to-hpl-deep text-white border border-hpl-border shadow-card",
    };

    return (
      <div
        ref={ref}
        className={cn("rounded-2xl overflow-hidden transition-all duration-200", variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pb-3 border-b border-hpl-border flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-base sm:text-lg font-bold text-white tracking-tight font-display", className)} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs sm:text-sm text-hpl-muted", className)} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-3 border-t border-hpl-border flex items-center justify-between text-hpl-muted", className)} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";
