"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Clock,
  AlertCircle,
  Settings,
  LogOut,
  Plus,
  Star,
  Shield,
  Users,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

const userNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "All Tasks", icon: CheckSquare },
  { href: "/tasks?view=today", label: "Today", icon: Clock },
  { href: "/tasks?status=PENDING", label: "Upcoming", icon: Calendar },
  { href: "/tasks?status=COMPLETED", label: "Completed", icon: CheckSquare },
  { href: "/tasks?priority=HIGH", label: "High Priority", icon: AlertCircle },
];

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tasks", label: "Task Oversight", icon: BarChart3 },
  { href: "/admin/team", label: "Team Management", icon: Users },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
];

const adminTools = [
  { href: "/admin/tasks", label: "Task Oversight", icon: BarChart3 },
  { href: "/admin/team", label: "Team Management", icon: Users },
];

const projects = [
  { name: "Personal", color: "bg-primary" },
  { name: "Work", color: "bg-success" },
  { name: "Learning", color: "bg-warning" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  if (isAdmin) {
    return (
      <aside className="hidden w-64 flex-col bg-[#0b1c30] text-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2170e4]">
            <CheckSquare className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">TaskFlow</span>
            <p className="text-[10px] text-[#7c839b]">Enterprise Edition</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {adminNavItems.map((item) => {
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#2170e4] text-white"
                    : "text-[#9ca3b8] hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#5a6078]">
              Admin Tools
            </p>
            {adminTools.map((item) => {
              const isActive = pathname.startsWith(item.href.split("?")[0]);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#2170e4] text-white"
                      : "text-[#9ca3b8] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4 space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#9ca3b8] hover:bg-white/5 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href="/support"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#9ca3b8] hover:bg-white/5 hover:text-white transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Support
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#9ca3b8] hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <CheckSquare className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {userNavItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href.split("?")[0]);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Projects
            </span>
            <button className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Plus className="h-3 w-3" />
            </button>
          </div>
          {projects.map((project) => (
            <button
              key={project.name}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <div className={cn("h-2 w-2 rounded-full", project.color)} />
              {project.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg bg-accent p-3">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium">
            <Star className="h-4 w-4 text-yellow-500" />
            Upgrade to Pro
          </div>
          <p className="mb-2 text-xs text-muted-foreground">
            Unlock advanced features
          </p>
          <Button size="sm" className="w-full">
            Upgrade Now
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <span className="text-sm">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
