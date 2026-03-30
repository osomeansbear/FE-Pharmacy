"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const spinnerVariants = cva(
  "animate-spin rounded-full border border-current border-r-transparent",
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-6",
        lg: "size-8",
        xl: "size-10",
      },
      variant: {
        default: "border-primary text-primary",
        secondary: "border-secondary text-secondary",
        muted: "border-muted-foreground text-muted-foreground",
        destructive: "border-destructive text-destructive",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

interface LoadingSpinnerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string;
  showText?: boolean;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size, variant, text, showText = false, className, ...props }, ref) => {
    const displayText = showText ? text : undefined;

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          className,
        )}
        ref={ref}
        {...props}
      >
        <div className={spinnerVariants({ size, variant })} />
        {displayText && (
          <p className="text-sm text-muted-foreground">{displayText}</p>
        )}
      </div>
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner, spinnerVariants };
