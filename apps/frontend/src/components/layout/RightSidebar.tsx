"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";

function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthName = today.toLocaleString("en-US", { month: "long" });

  return (
    <div className="w-full">
      <div className="mb-2 text-center text-sm font-medium">
        {monthName} {year}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {days.map((day) => (
          <div key={day} className="py-1 font-medium">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full py-1 ${
              i + 1 === today.getDate()
                ? "bg-primary text-primary-foreground font-medium"
                : "hover:bg-accent"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskProgress() {
  const { data: completedData } = useTasks({ status: "COMPLETED", limit: 1 });
  const { data: totalData } = useTasks({ limit: 1 });

  const completed = completedData?.pagination?.total || 0;
  const total = totalData?.pagination?.total || 1;
  const percentage = Math.round((completed / total) * 100);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Overall Progress</p>
    </div>
  );
}

export function RightSidebar() {
  const { data: upcomingData } = useTasks({
    status: "PENDING",
    limit: 5,
    sortBy: "dueDate",
    sortOrder: "asc",
  });

  return (
    <aside className="hidden w-72 flex-col gap-4 border-l border-border bg-card xl:flex p-4">
      <Card>
        <CardContent className="p-4">
          <MiniCalendar />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {upcomingData?.items && upcomingData.items.length > 0 ? (
            <div className="space-y-3">
              {upcomingData.items.map((task: Task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "No date"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming tasks
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Task Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <TaskProgress />
        </CardContent>
      </Card>
    </aside>
  );
}
