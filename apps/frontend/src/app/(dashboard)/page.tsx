"use client";

import { Suspense } from "react";
import { TaskKPIs } from "@/components/tasks/TaskKPIs";
import { TaskList } from "@/components/tasks/TaskList";
import { Skeleton } from "@/components/ui/Skeleton";

function TaskListFallback() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your tasks and productivity
        </p>
      </div>

      <TaskKPIs />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Tasks</h2>
        <Suspense fallback={<TaskListFallback />}>
          <TaskList />
        </Suspense>
      </div>
    </div>
  );
}
