"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here&apos;s your admin overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Tasks</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Pending Tasks</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Completed Tasks</p>
          <p className="text-2xl font-bold">--</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Admin Panels</h2>
        <p className="text-muted-foreground">
          Admin task oversight, team management, and calendar views will be implemented in Phase 2.
        </p>
      </div>
    </div>
  );
}
