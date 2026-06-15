"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  ClipboardList,
  AlertTriangle,
  Eye,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { useTaskEvent } from "@/hooks/useTaskEvents";
import api from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { BoardView } from "@/components/tasks/BoardView";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";
import { Task } from "@/types/task";
import { toast } from "sonner";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function UserTasksPage() {
  const [view, setView] = useState<"board" | "list">("board");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(ITEMS_PER_PAGE),
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        if (search) params.set("search", search);
        if (statusFilter) params.set("status", statusFilter);
        if (priorityFilter) params.set("priority", priorityFilter);
        const { data } = await api.get(`/tasks?${params.toString()}`);
        setTasks(data.data.items);
        setPagination(data.data.pagination);
      } catch {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, priorityFilter]
  );

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks/kpis");
      const kpis = data.data?.kpis || data.data;
      setTaskStats({
        total: kpis.total || 0,
        completed: kpis.completed || 0,
        pending: kpis.pending || 0,
      });
    } catch {
      toast.error("Failed to load task statistics");
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter]);
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, fetchTasks]);

  const refresh = useCallback(() => {
    fetchTasks(currentPage);
    fetchStats();
  }, [currentPage, fetchTasks, fetchStats]);

  useTaskEvent("task-updated", refresh);
  useTaskEvent("task-created", refresh);

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const clearAll = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
  };
  const hasFilters = search || statusFilter || priorityFilter;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Tasks
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage your personal tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] p-0.5">
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                view === "list"
                  ? "bg-[#2170e4] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setView("board")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                view === "board"
                  ? "bg-[#2170e4] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Board
            </button>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-create-task"))}
            className="flex items-center gap-1.5 rounded-lg bg-[#2170e4] px-3 py-2 text-sm font-medium text-white hover:bg-[#1a5fc0] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Tasks",
            value: taskStats.total,
            icon: ClipboardList,
            iconBg: "bg-[#2170e4]/10",
            iconColor: "text-[#2170e4]",
          },
          {
            label: "Completed",
            value: taskStats.completed,
            icon: Eye,
            iconBg: "bg-green-50 dark:bg-green-500/10",
            iconColor: "text-green-600",
            valueColor: "text-green-600",
          },
          {
            label: "To Do",
            value: taskStats.pending,
            icon: AlertTriangle,
            iconBg: "bg-amber-50 dark:bg-amber-500/10",
            iconColor: "text-amber-600",
            valueColor: "text-amber-600",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-bold",
                    card.valueColor || "text-gray-900 dark:text-white"
                  )}
                >
                  {card.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  card.iconBg
                )}
              >
                <card.icon className={cn("h-5 w-5", card.iconColor)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {view === "list" ? (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111827]">
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 sm:px-5 py-3 sm:py-4 dark:border-white/10">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white"
            >
              <option value="">All Status</option>
              <option value="PENDING">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Clear All
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left dark:border-white/10">
                  {["Task", "Status", "Priority", "Due Date"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-5 py-4">
                        <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                      </td>
                    </tr>
                  ))
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => handleRowClick(task)}
                      className="border-b border-gray-50 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[280px]">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge value={task.status} type="status" />
                      </td>
                      <td className="px-5 py-4">
                        <Badge value={task.priority} type="priority" />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "No date"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.total > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={setCurrentPage}
              totalLabel={`View all ${pagination.total} tasks`}
            />
          )}
        </div>
      ) : (
        <BoardView
          onTaskClick={handleRowClick}
          search={search}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
        />
      )}

      <EditTaskModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}
