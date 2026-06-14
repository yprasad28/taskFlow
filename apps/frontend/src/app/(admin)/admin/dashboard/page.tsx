"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Users,
  Activity,
  TrendingUp,
  Zap,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { PaginationMeta } from "@/types/admin";
import { useTaskEvent, dispatchTaskEvent } from "@/hooks/useTaskEvents";
import api from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";
import { getInitials } from "@/components/ui/Badge";

interface StatsData {
  totalUsers: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

interface UserActivity {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  taskCount: number;
  completedTasks: number;
}

interface ActivityLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string };
}

function getStatusForUser(user: UserActivity) {
  if (user.taskCount === 0) {
    return { label: "IDLE", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", progress: 0, progressColor: "bg-gray-400" };
  }
  if (user.completedTasks === user.taskCount) {
    return { label: "ALL DONE", color: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400", progress: 100, progressColor: "bg-green-500" };
  }
  if (user.completedTasks > 0) {
    return { label: "IN PROGRESS", color: "bg-[#2170e4]/10 text-[#2170e4]", progress: Math.round((user.completedTasks / user.taskCount) * 100), progressColor: "bg-[#2170e4]" };
  }
  if (user.taskCount > 3) {
    return { label: "BUSY", color: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400", progress: 0, progressColor: "bg-orange-500" };
  }
  return { label: "PENDING", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400", progress: 0, progressColor: "bg-yellow-500" };
}

function getActionIcon(action: string) {
  switch (action) {
    case "created":
      return { icon: CheckCircle2, iconBg: "bg-[#2170e4]/10", iconColor: "text-[#2170e4]" };
    case "updated":
      return { icon: Activity, iconBg: "bg-purple-100 dark:bg-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400" };
    case "deleted":
      return { icon: AlertTriangle, iconBg: "bg-red-100 dark:bg-red-500/10", iconColor: "text-red-600 dark:text-red-400" };
    default:
      return { icon: CheckCircle2, iconBg: "bg-green-100 dark:bg-green-500/10", iconColor: "text-green-600 dark:text-green-400" };
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<UserActivity[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data.data.stats);
    } catch {}
  }, []);

  const fetchUsers = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/users?page=${page}&limit=${ITEMS_PER_PAGE}`);
      setUsers(data.data.items);
      setPagination(data.data.pagination);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/activity?limit=10");
      setActivityLogs(data.data);
    } catch {}
  }, []);

  const refresh = useCallback(() => {
    fetchStats();
    fetchUsers(currentPage);
    fetchActivityLogs();
  }, [currentPage, fetchStats, fetchUsers, fetchActivityLogs]);

  useTaskEvent("task-created", refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const statsCards = [
    {
      label: "Total Active Tasks",
      value: stats?.totalTasks ?? 0,
      subtitle: `${stats?.pendingTasks ?? 0} pending, ${stats?.inProgressTasks ?? 0} in progress`,
      icon: CheckCircle2,
      iconBg: "bg-[#2170e4]/10",
      iconColor: "text-[#2170e4]",
    },
    {
      label: "Overdue Alerts",
      value: stats?.overdueTasks ?? 0,
      subtitle: "Needs immediate attention",
      icon: AlertTriangle,
      iconBg: "bg-red-100 dark:bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      label: "Active Users",
      value: stats?.totalUsers ?? 0,
      subtitle: `${stats?.completedTasks ?? 0} tasks completed`,
      icon: Users,
      iconBg: "bg-green-100 dark:bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Oversight</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time operational metrics and team performance tracking.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#111827]"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
              <div className={cn("rounded-lg p-2", card.iconBg)}>
                <card.icon className={cn("h-5 w-5", card.iconColor)} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{card.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111827]">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              User Activity & Assignment
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left dark:border-white/10">
                  {["User", "Role", "Tasks", "Status", "Comp. Rate"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-5 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-200" /></td>
                      <td className="px-5 py-4"><div className="h-4 w-16 animate-pulse rounded bg-gray-200" /></td>
                      <td className="px-5 py-4"><div className="h-4 w-8 animate-pulse rounded bg-gray-200" /></td>
                      <td className="px-5 py-4"><div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" /></td>
                      <td className="px-5 py-4"><div className="h-2 w-24 animate-pulse rounded-full bg-gray-200" /></td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((row) => {
                    const status = getStatusForUser(row);
                    const compRate = row.taskCount > 0 ? Math.round((row.completedTasks / row.taskCount) * 100) : 0;
                    return (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{row.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            row.role === "ADMIN" ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
                          )}>
                            {row.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.taskCount}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", status.color)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                              <div className={cn("h-full rounded-full", status.progressColor)} style={{ width: `${compRate}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{compRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.total > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={(p) => { setCurrentPage(p); }}
              totalLabel={`View all ${pagination.total} users`}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111827]">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Global Activity Log
              </h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-white/5 max-h-[460px] overflow-y-auto">
              {activityLogs.length > 0 ? (
                activityLogs.map((item) => {
                  const { icon: Icon, iconBg, iconColor } = getActionIcon(item.action);
                  return (
                    <div key={item.id} className="px-5 py-4">
                      <div className="flex gap-3">
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", iconBg)}>
                          <Icon className={cn("h-4 w-4", iconColor)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold dark:text-white">{item.user.name} </span>
                            {item.action}{" "}
                            <span className="font-semibold text-[#2170e4]">{item.entity}</span>
                          </p>
                          {item.details && (
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.details}</p>
                          )}
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                            <Clock className="h-3 w-3" />
                            {timeAgo(item.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-8 text-center">
                  <Activity className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No activity yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-[#0b1c30] p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <h3 className="font-semibold">Optimization Tip</h3>
            </div>
            <p className="text-sm text-gray-300">
              {stats?.pendingTasks
                ? `${stats.pendingTasks} pending tasks need attention. Consider assigning them to active users.`
                : "All tasks are on track. Great job!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
