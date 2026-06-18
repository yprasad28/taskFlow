"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { TaskKPIs } from "@/types/task";
import { toast } from "sonner";

interface RingSegment {
  label: string;
  value: number;
  color: string;
  stroke: string;
}

export function TotalProgress() {
  const [kpis, setKpis] = useState<TaskKPIs | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const { data } = await api.get("/tasks/kpis");
        setKpis(data.data.kpis);
      } catch {
        toast.error("Failed to load progress data");
      }
    };
    const timer = setTimeout(fetchKPIs, 800);
    return () => clearTimeout(timer);
  }, []);

  const total = kpis?.total || 0;
  const completed = kpis?.completed || 0;
  const inProgress = kpis?.inProgress || 0;
  const pending = kpis?.pending || 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const segments: RingSegment[] = [
    { label: "Completed", value: completed, color: "#22c55e", stroke: "#22c55e" },
    { label: "In Progress", value: inProgress, color: "#f97316", stroke: "#f97316" },
    { label: "To Do", value: pending, color: "#6b7280", stroke: "#6b7280" },
  ];

  let cumulativeOffset = 0;
  const rings = segments.map((seg) => {
    const length = total > 0 ? (seg.value / total) * circumference : 0;
    const dashArray = `${length} ${circumference - length}`;
    const dashOffset = -cumulativeOffset;
    cumulativeOffset += length;
    return { ...seg, dashArray, dashOffset };
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#111827]">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Total Work Report
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative">
          <svg
            width={radius * 2}
            height={radius * 2}
            className="transform -rotate-90"
          >
            {rings.map((ring, i) => (
              <circle
                key={i}
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                fill="none"
                stroke={ring.stroke}
                strokeWidth={stroke}
                strokeDasharray={ring.dashArray}
                strokeDashoffset={ring.dashOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {percent}%
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Done
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {completed} of {total} tasks completed
        </p>

        <div className="mt-4 flex w-full flex-col gap-2">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {seg.label}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                {seg.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
