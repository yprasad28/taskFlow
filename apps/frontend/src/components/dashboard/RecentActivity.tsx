"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useTaskEvent } from "@/hooks/useTaskEvents";
import { timeAgo, getInitials, ACTIVITY_STYLES } from "@/lib/utils";

interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  taskTitle: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks/activity?limit=8");
      setActivities(data.data.activities || []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useTaskEvent("task-created", fetchActivities);
  useTaskEvent("task-updated", fetchActivities);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10">
        <div className="p-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10">
      <div className="p-4 border-b border-gray-100 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      <div className="p-4 space-y-1">
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">No recent activity</p>
        ) : (
          activities.map((item) => {
            const style = ACTIVITY_STYLES[item.action] || ACTIVITY_STYLES.updated;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${style.bg}`}
                >
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-snug">
                    <span className={`font-medium ${style.text}`}>
                      {style.label}
                    </span>
                    {item.taskTitle && (
                      <>
                        {" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.taskTitle}
                        </span>
                      </>
                    )}
                    {item.action === "assigned" && item.user && (
                      <>
                        {" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          by {item.user.name}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
