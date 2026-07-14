"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm font-semibold uppercase tracking-wide text-xs px-2.5 py-0.5 transition-colors",
  {
    variants: {
      variant: {
        primary:    "bg-primary-100 text-primary-700",
        accent:     "bg-accent/10 text-accent-600",
        success:    "bg-green-100 text-green-700",
        warning:    "bg-yellow-100 text-yellow-700",
        error:      "bg-red-100 text-red-700",
        neutral:    "bg-neutral-100 text-neutral-600",
        solar:      "bg-amber-100 text-amber-700",
        whatsapp:   "bg-whatsapp/10 text-whatsapp-dark",
        published:  "bg-green-100 text-green-700",
        draft:      "bg-neutral-100 text-neutral-500",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "published" ? "bg-green-500" :
            variant === "draft" ? "bg-neutral-400" :
            "bg-current opacity-60"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Card components
// ---------------------------------------------------------------------------
export function Card({
  className,
  children,
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "card-base",
        hover && "card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pt-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pb-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 pb-6 pt-4 border-t border-neutral-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
export function Spinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" }[size];
  return (
    <svg
      className={cn("animate-spin text-primary-600", sizeClass, className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading..."
      role="status"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="mb-4 p-4 bg-neutral-100 rounded-full">
          <Icon className="h-8 w-8 text-neutral-400" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">{title}</h3>
      {description && (
        <p className="text-small text-neutral-500 max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------
export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4 p-4 bg-red-50 rounded-full">
        <svg className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">{title}</h3>
      <p className="text-small text-neutral-500 max-w-md mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-outline px-6 py-2.5 text-sm font-semibold rounded-md border-2 border-primary-700 text-primary-700 hover:bg-primary-50 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
export function Divider({ className, label }: { className?: string; label?: string }) {
  if (label) {
    return (
      <div className={cn("relative flex items-center my-6", className)}>
        <div className="flex-grow border-t border-neutral-200" />
        <span className="px-4 text-caption text-neutral-400 font-medium">{label}</span>
        <div className="flex-grow border-t border-neutral-200" />
      </div>
    );
  }
  return <hr className={cn("border-t border-neutral-200 my-6", className)} />;
}
