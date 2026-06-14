"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/constants";
import api from "@/lib/api";
import { Task } from "@/types/task";

export function TodaysTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks?status=PENDING&sortBy=dueDate&sortOrder=asc&limit=5");
        setTasks(data.data.items || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleToggle = async (task: Task) => {
    try {
      await api.patch(`/tasks/${task.id}`, {
        status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED",
      });
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch {}
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No date";
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Due ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10">
        <div className="p-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks for Today</h3>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10">
      <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks for Today</h3>
        <button className="text-[#2170e4] text-sm font-medium hover:underline">View All</button>
      </div>
      <div className="p-4 space-y-2">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No pending tasks</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-lg group"
            >
              <input
                type="checkbox"
                checked={task.status === "COMPLETED"}
                onChange={() => handleToggle(task)}
                className="w-5 h-5 rounded border-gray-300 text-[#2170e4] focus:ring-[#2170e4]/20"
              />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium text-gray-900 dark:text-white truncate",
                  task.status === "COMPLETED" && "line-through opacity-50"
                )}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium uppercase",
                    PRIORITY_COLORS[task.priority] || "bg-gray-100 text-gray-600"
                  )}>
                    {PRIORITY_LABELS[task.priority] || task.priority}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    {task.dueDate ? (
                      <>
                        <Calendar className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </>
                    ) : (
                      "No date"
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
