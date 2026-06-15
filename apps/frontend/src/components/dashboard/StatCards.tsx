"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import api from "@/lib/api";
import { TaskKPIs } from "@/types/task";
import { toast } from "sonner";

export function StatCards() {
  const [kpis, setKpis] = useState<TaskKPIs | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const { data } = await api.get("/tasks/kpis");
        setKpis(data.data.kpis);
      } catch {
        toast.error("Failed to load task statistics");
      }
    };
    fetchKPIs();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#2170e4]/10 flex items-center justify-center text-[#2170e4]">
          <CheckCircle className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed this Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpis?.completed ?? 0}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">To Do Tasks</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpis?.pending ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
