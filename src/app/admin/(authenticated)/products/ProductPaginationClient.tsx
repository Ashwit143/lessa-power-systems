"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";

interface ProductPaginationClientProps {
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  firstCursor?: { createdAt: string; id: string };
  lastCursor?: { createdAt: string; id: string };
  currentCount: number;
}

export function ProductPaginationClient({
  totalCount,
  hasNext,
  hasPrev,
  firstCursor,
  lastCursor,
  currentCount,
}: ProductPaginationClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;
  
  // Calculate range
  const startRange = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRange = totalCount === 0 ? 0 : startRange + currentCount - 1;

  const navigate = (direction: "next" | "prev", cursor?: { createdAt: string; id: string }) => {
    if (!cursor) return;

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("dir", direction);
    current.set("cursorCreatedAt", cursor.createdAt);
    current.set("cursorId", cursor.id);
    
    if (direction === "next") {
      current.set("page", (currentPage + 1).toString());
    } else {
      current.set("page", Math.max(1, currentPage - 1).toString());
    }

    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`);
    });
  };

  return (
    <div className={`p-4 border-t border-neutral-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-neutral-50/50 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      <div className="text-sm text-neutral-500">
        Showing <span className="font-semibold text-neutral-900">{startRange}</span> to <span className="font-semibold text-neutral-900">{endRange}</span> of <span className="font-semibold text-neutral-900">{totalCount}</span> products
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!hasPrev || isPending}
          onClick={() => navigate("prev", firstCursor)}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!hasNext || isPending}
          onClick={() => navigate("next", lastCursor)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
