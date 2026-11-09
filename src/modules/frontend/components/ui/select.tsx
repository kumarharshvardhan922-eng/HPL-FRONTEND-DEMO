import React from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs sm:text-sm font-semibold text-white">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-xl border bg-hpl-surface-2 text-sm text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-hpl-accent/30 focus:border-hpl-accent appearance-none cursor-pointer",
            error ? "border-hpl-live focus:border-hpl-live" : "border-hpl-border hover:border-hpl-accent/60",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-hpl-surface text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-hpl-live font-medium">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";
