"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RefreshCw, Home } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-6 p-5 bg-red-50 rounded-full inline-flex items-center justify-center">
          <svg className="h-10 w-10 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800 mb-3">Something went wrong</h1>
        <p className="text-neutral-600 mb-8">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={reset}
            leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
          >
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
