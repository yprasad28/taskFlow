"use client";

import { useState, useEffect } from "react";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { CreateTaskModal } from "./CreateTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Task } from "@/types/task";
import { TaskStatus, TaskPriority } from "@/types/task";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

const priorityColors: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive",
  MEDIUM: "bg-warning/10 text-warning",
  LOW: "bg-success/10 text-success",
  URGENT: "bg-destructive/15 text-destructive",
};

const statusColors: Record<string, string> = {
  COMPLETED: "bg-success/10 text-success",
  IN_PROGRESS: "bg-primary/10 text-primary",
  PENDING: "bg-muted text-muted-foreground",
};

function ColumnSearch({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [input, setInput] = useState(value);
  const debounced = useDebounce(input);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded border border-border bg-background pl-7 pr-6 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      {input && (
        <button
          onClick={() => setInput("")}
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
        >
          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
}

function ColumnSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

const priorityOptions = [
  { value: "", label: "All" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const statusOptions = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export function TaskList() {
  const { filters, setFilter } = useTaskFilters();
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const currentPage = filters.page || 1;

  const { data, isLoading } = useTasks({
    page: currentPage,
    limit: 5,
    search: filters.search || undefined,
    status: (filters.status as TaskStatus) || undefined,
    sortBy: filters.sortBy || "dueDate",
    sortOrder: "asc",
  });

  const updateMutation = useUpdateTask();

  const handleToggleComplete = (task: Task) => {
    updateMutation.mutate({
      id: task.id,
      status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED",
    });
  };

  const totalPages = data?.pagination ? Math.ceil(data.pagination.total / 5) : 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-semibold">My Tasks</CardTitle>
        <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border">
          {/* Header Row */}
          <div className="grid grid-cols-[40px_1fr_100px_120px_90px_80px] items-center gap-3 border-b border-border bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <div />
            <div>
              <div className="mb-1">Task</div>
              <ColumnSearch
                value={filters.search || ""}
                onChange={(v) => setFilter("search", v || undefined)}
                placeholder="Search tasks..."
              />
            </div>
            <div>
              <div className="mb-1 text-center">Priority</div>
              <ColumnSelect
                value={filters.priority || ""}
                onChange={(v) => setFilter("priority", v || undefined)}
                options={priorityOptions}
              />
            </div>
            <div>
              <div className="mb-1 text-center">Status</div>
              <ColumnSelect
                value={filters.status || ""}
                onChange={(v) => setFilter("status", v || undefined)}
                options={statusOptions}
              />
            </div>
            <div className="text-center">Due Date</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="space-y-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[40px_1fr_100px_120px_90px_80px] items-center gap-3 border-b border-border px-4 py-4 last:border-0"
                >
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : data?.items && data.items.length > 0 ? (
            data.items.map((task: Task) => (
              <div
                key={task.id}
                className="grid grid-cols-[40px_1fr_100px_120px_90px_80px] items-center gap-3 border-b border-border px-4 py-4 last:border-0 hover:bg-muted/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={task.status === "COMPLETED"}
                  onChange={() => handleToggleComplete(task)}
                  className="h-5 w-5 rounded border-border cursor-pointer accent-primary justify-self-center"
                />

                <div className="min-w-0">
                  <p
                    className={`font-medium truncate ${
                      task.status === "COMPLETED"
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground truncate">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className={`text-xs font-medium ${priorityColors[task.priority] || ""}`}
                  >
                    {task.priority === "HIGH"
                      ? "High"
                      : task.priority === "MEDIUM"
                      ? "Medium"
                      : task.priority === "URGENT"
                      ? "Urgent"
                      : "Low"}
                  </Badge>
                </div>

                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className={`text-xs font-medium ${statusColors[task.status] || ""}`}
                  >
                    {task.status === "COMPLETED"
                      ? "Done"
                      : task.status === "IN_PROGRESS"
                      ? "In Progress"
                      : "Pending"}
                  </Badge>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "No date"}
                </div>

                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditTask(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTask(task)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No tasks found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a new task to get started
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.total > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * 5) + 1} to {Math.min(currentPage * 5, data.pagination.total)} of{" "}
              {data.pagination.total} tasks
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("page", Math.max(1, currentPage - 1))}
                disabled={!data.pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <Button
                    key={p}
                    variant={p === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("page", p)}
                    className="w-9"
                  >
                    {p}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("page", Math.min(totalPages, currentPage + 1))}
                disabled={!data.pagination.hasNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <CreateTaskModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />

        {editTask && (
          <EditTaskModal
            task={editTask}
            isOpen={!!editTask}
            onClose={() => setEditTask(null)}
          />
        )}

        {deleteTask && (
          <DeleteConfirmModal
            task={deleteTask}
            isOpen={!!deleteTask}
            onClose={() => setDeleteTask(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}
