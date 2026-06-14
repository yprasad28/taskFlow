"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationMeta } from "@/types/admin";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  totalLabel?: string;
}

export function Pagination({ pagination, onPageChange, totalLabel }: PaginationProps) {
  const { page, total, totalPages, hasNext, hasPrev } = pagination;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-white/10">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {totalLabel || `View all ${total} items`}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
              p === page
                ? "bg-[#0b1c30] text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
