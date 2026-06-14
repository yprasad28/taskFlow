"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { TaskFilters, TaskStatus, TaskPriority } from "@/types/task";

export function useTaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: TaskFilters = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      status: (searchParams.get("status") as TaskStatus) || undefined,
      priority: (searchParams.get("priority") as TaskPriority) || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as TaskFilters["sortBy"]) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as TaskFilters["sortOrder"]) || "desc",
    }),
    [searchParams]
  );

  const setFilter = useCallback(
    (key: keyof TaskFilters, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === "" || value === null) {
        params.delete(key as string);
      } else {
        params.set(key as string, String(value));
      }

      if (key !== "page") {
        params.set("page", "1");
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const setPage = useCallback(
    (page: number) => setFilter("page", page),
    [setFilter]
  );

  const setStatus = useCallback(
    (status: TaskStatus | undefined) => setFilter("status", status),
    [setFilter]
  );

  const setSearch = useCallback(
    (search: string) => setFilter("search", search || undefined),
    [setFilter]
  );

  const setSortBy = useCallback(
    (sortBy: TaskFilters["sortBy"]) => setFilter("sortBy", sortBy),
    [setFilter]
  );

  const setSortOrder = useCallback(
    (sortOrder: TaskFilters["sortOrder"]) => setFilter("sortOrder", sortOrder),
    [setFilter]
  );

  return {
    filters,
    setFilter,
    setPage,
    setStatus,
    setSearch,
    setSortBy,
    setSortOrder,
  };
}
