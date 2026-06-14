"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, isToday: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        isCurrentMonth: true,
        isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
      });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{monthName}</h4>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-xs text-gray-500 dark:text-gray-400 font-medium py-1">
            {d}
          </div>
        ))}
        {calendarDays.map((day, idx) => (
          <button
            key={idx}
            className={cn(
              "p-1 text-sm rounded-full",
              !day.isCurrentMonth && "text-gray-300 dark:text-gray-600",
              day.isCurrentMonth && !day.isToday && "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10",
              day.isToday && "bg-[#2170e4] text-white font-bold"
            )}
          >
            {day.day}
          </button>
        ))}
      </div>
    </div>
  );
}
