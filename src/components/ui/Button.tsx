"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

// ---------------------------------------------------------------------------
// Button variants using CVA
// ---------------------------------------------------------------------------
const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-700 text-white hover:bg-primary-800 focus-visible:ring-primary-600 shadow-sm",
        accent:
          "bg-accent text-white hover:bg-accent-600 focus-visible:ring-accent shadow-sm",
        whatsapp:
          "bg-whatsapp text-white hover:opacity-90 focus-visible:ring-whatsapp shadow-sm",
        outline:
          "border-2 border-primary-700 text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-600 bg-transparent",
        ghost:
          "text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400 bg-transparent",
        destructive:
          "bg-error text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm",
        link: "text-primary-700 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-600",
      },
      size: {
        sm:   "px-3 py-1.5 text-sm h-8",
        md:   "px-4 py-2.5 text-sm h-10",
        lg:   "px-6 py-3 text-base h-12",
        xl:   "px-8 py-4 text-base h-14",
        icon: "p-2 h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
      loading: {
        true: "opacity-70 cursor-wait",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// ---------------------------------------------------------------------------
// Loading spinner
// ---------------------------------------------------------------------------
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Button component
// ---------------------------------------------------------------------------
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, fullWidth, loading: isLoading }),
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            {loadingText ?? children}
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
