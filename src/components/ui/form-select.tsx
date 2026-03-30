"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import * as React from "react";

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends Omit<
  React.ComponentProps<"select">,
  "children"
> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
  icon?: React.ReactNode;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      hint,
      required,
      placeholder,
      options,
      icon,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            className={cn(
              "text-sm font-medium text-foreground",
              required &&
                "after:content-['*'] after:ml-1 after:text-destructive",
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            data-slot="select"
            className={cn(
              "appearance-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm cursor-pointer",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              error
                ? "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-destructive"
                : "",
              icon && "pl-10",
              "pr-9",
              className,
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled selected>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";

export { FormSelect, type SelectOption };
