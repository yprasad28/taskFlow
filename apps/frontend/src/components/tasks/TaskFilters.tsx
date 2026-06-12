"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { TaskStatus } from "@/types/task";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const sortOptions = [
  { value: "createdAt", label: "Created Date" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
];

const orderOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

export function TaskFilters() {
  const { filters, setStatus, setSearch, setSortBy, setSortOrder } =
    useTaskFilters();
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <Select
        options={statusOptions}
        value={filters.status || ""}
        onChange={(e) =>
          setStatus(e.target.value as TaskStatus | undefined)
        }
      />

      <Select
        options={sortOptions}
        value={filters.sortBy || "createdAt"}
        onChange={(e) => setSortBy(e.target.value as "createdAt" | "dueDate" | "priority" | "title")}
      />

      <Select
        options={orderOptions}
        value={filters.sortOrder || "desc"}
        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
      />
    </div>
  );
}
