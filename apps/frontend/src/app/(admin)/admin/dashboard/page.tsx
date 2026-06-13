"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Moon,
  Bell,
  Filter,
  Download,
  MoreVertical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Activity,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

const statsCards = [
  {
    label: "Total Active Tasks",
    value: "1,284",
    change: "+12%",
    changeType: "up" as const,
    subtitle: "Active across 24 projects",
    icon: CheckCircle2,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Overdue Alerts",
    value: "42",
    change: "+5%",
    changeType: "up" as const,
    subtitle: "Needs immediate attention",
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    label: "Active Users",
    value: "156",
    badge: "Live now",
    subtitle: "88% peak concurrency",
    icon: Users,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

const userActivity = [
  {
    name: "James Sterling",
    initials: "JS",
    role: "Lead Architect",
    avatar: null,
    task: "Database Migration v2.1",
    status: "IN PROGRESS",
    statusColor: "bg-blue-100 text-blue-700",
    progress: 65,
    progressColor: "bg-blue-500",
  },
  {
    name: "Elena Rossi",
    initials: "ER",
    role: "UI Designer",
    avatar: null,
    task: "Design System Audit",
    status: "PENDING REVIEW",
    statusColor: "bg-yellow-100 text-yellow-700",
    progress: 40,
    progressColor: "bg-orange-500",
  },
  {
    name: "Marcus Kane",
    initials: "MK",
    role: "Backend Dev",
    avatar: null,
    task: "API Endpoint Optimization",
    status: "BLOCKED",
    statusColor: "bg-red-100 text-red-700",
    progress: 20,
    progressColor: "bg-red-500",
  },
  {
    name: "David Chen",
    initials: "DC",
    role: "Product Manager",
    avatar: null,
    task: "Stakeholder Alignment Sync",
    status: "COMPLETED",
    statusColor: "bg-green-100 text-green-700",
    progress: 100,
    progressColor: "bg-green-500",
  },
];

const activityLog = [
  {
    user: "Sarah Miller",
    action: "completed",
    target: "Q4 Security Audit",
    time: "2 minutes ago",
    team: "Security Team",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    user: "System Admin",
    action: "created",
    target: "Infrastructure Upgrade",
    time: "15 minutes ago",
    assignee: "Kevin Hart",
    icon: Plus,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    user: "",
    action: "Task reassigned:",
    target: "Client Onboarding",
    time: "45 minutes ago",
    detail: "From Leo K. to Elena R.",
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    user: "Marcus Kane",
    action: "updated status on",
    target: "API Patch v4",
    time: "1 hour ago",
    icon: Activity,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Global task search..."
                  className="h-10 w-72 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-[#0b1c30] hover:bg-[#131b2e] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Task
              </Button>
              <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                <Moon className="h-5 w-5" />
              </button>
              <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1c30] text-sm font-medium text-white">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">Admin Oversight</h1>
              <p className="text-sm text-gray-500">
                Real-time operational metrics and team performance tracking.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {statsCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {card.label}
                      </p>
                    </div>
                    <div className={cn("rounded-lg p-2", card.iconBg)}>
                      <card.icon className={cn("h-5 w-5", card.iconColor)} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {card.value}
                    </span>
                    {card.change && (
                      <span
                        className={cn(
                          "flex items-center text-xs font-semibold",
                          card.changeType === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                        {card.change}
                      </span>
                    )}
                    {card.badge && (
                      <span className="text-xs font-semibold text-green-600">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{card.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    User Activity & Assignment
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                      <Filter className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          User
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Current Task
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Comp. Rate
                        </th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {userActivity.map((row) => (
                        <tr
                          key={row.name}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b1c30] text-sm font-medium text-white">
                                {row.initials}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {row.name}
                                </p>
                                <p className="text-xs text-gray-500">{row.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-700">{row.task}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                row.statusColor
                              )}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className={cn("h-full rounded-full", row.progressColor)}
                                  style={{ width: `${row.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    View all 156 users
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 rounded-lg bg-[#0b1c30] text-sm font-medium text-white">
                      1
                    </button>
                    <button className="h-8 w-8 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                      2
                    </button>
                    <button className="h-8 w-8 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                      3
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Global Activity Log
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {activityLog.map((item, i) => (
                      <div key={i} className="px-5 py-4">
                        <div className="flex gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              item.iconBg
                            )}
                          >
                            <item.icon
                              className={cn("h-4 w-4", item.iconColor)}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-700">
                              {item.user && (
                                <span className="font-semibold">{item.user} </span>
                              )}
                              {item.action}{" "}
                              <span className="font-semibold text-blue-600">
                                {item.target}
                              </span>
                            </p>
                            {item.assignee && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                <Users className="h-3 w-3" />
                                Assigned to: {item.assignee}
                              </div>
                            )}
                            {item.detail && (
                              <p className="mt-0.5 text-xs text-gray-500">
                                {item.detail}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">{item.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 px-5 py-3">
                    <button className="text-sm font-medium text-gray-600 hover:underline">
                      View Full History
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-[#0b1c30] p-5 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <h3 className="font-semibold">Optimization Tip</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    3 users have been blocked for over 24h. Consider reassigning
                    their tasks to the DevOps queue.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
