import React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs sm:text-sm font-semibold text-white">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-xl border bg-hpl-surface-2 text-sm text-white placeholder-hpl-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-hpl-accent/30 focus:border-hpl-accent",
            error ? "border-hpl-live focus:border-hpl-live focus:ring-red-500/20" : "border-hpl-border hover:border-hpl-accent/60",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-hpl-live font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-hpl-muted">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
