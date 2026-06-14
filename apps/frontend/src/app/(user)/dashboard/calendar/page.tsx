"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  AlertTriangle,
  FolderOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";
import { useTaskEvent } from "@/hooks/useTaskEvents";
import api from "@/lib/api";
import { Task } from "@/types/task";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Task;
}

export default function UserCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/tasks?limit=50&sortBy=dueDate&sortOrder=asc");
      setTasks(data.data.items || []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useTaskEvent("task-created", fetchTasks);
  useTaskEvent("task-updated", fetchTasks);

  const events: CalendarEvent[] = useMemo(() => {
    const result: CalendarEvent[] = [];
    for (const task of tasks) {
      if (!task.dueDate) continue;
      const dateStr = task.dueDate.split("T")[0];
      const parts = dateStr.split("-").map(Number);
      const start = new Date(parts[0], parts[1] - 1, parts[2]);
      const end = new Date(parts[0], parts[1] - 1, parts[2] + 1);
      result.push({
        id: task.id,
        title: task.title,
        start,
        end,
        allDay: true,
        resource: task,
      });
    }
    return result;
  }, [tasks]);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      overdue: tasks.filter((t) => t.dueDate && t.status !== "COMPLETED" && new Date(t.dueDate) < now).length,
      open: tasks.filter((t) => t.status === "PENDING").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      completed: tasks.filter((t) => t.status === "COMPLETED").length,
    };
  }, [tasks]);

  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    const key = moment(selectedDate).format("YYYY-MM-DD");
    return tasks.filter((t) => t.dueDate && t.dueDate.startsWith(key));
  }, [tasks, selectedDate]);

  const miniCalendarDays = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [currentDate]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedDate(event.start);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const colorMap: Record<string, string> = {
      LOW: "#eab308",
      MEDIUM: "#2170e4",
      HIGH: "#ef4444",
      URGENT: "#b91c1c",
    };
    return {
      style: {
        backgroundColor: colorMap[event.resource.priority] || "#6b7280",
        color: "white",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 500,
        padding: "1px 6px",
        border: "none",
      },
    };
  };

  return (
    <div className="relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Calendar</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View and manage your task deadlines.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Overdue</p>
              <p className="text-xl font-bold text-red-600">{stats.overdue}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2170e4]/10">
              <FolderOpen className="h-4 w-4 text-[#2170e4]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Open</p>
              <p className="text-xl font-bold text-[#2170e4]">{stats.open}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111827]">
          <div className="h-[400px] sm:h-[500px] lg:h-[650px] relative">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
              </div>
            ) : (
              <Calendar
                key={`${currentDate.toISOString()}-${events.length}`}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={currentView}
                date={currentDate}
                onView={(v) => setCurrentView(v as View)}
                onNavigate={(date) => setCurrentDate(date)}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                eventPropGetter={eventStyleGetter}
                style={{ height: "100%" }}
              />
            )}
          </div>
        </div>

        <div className="w-full lg:w-[280px] shrink-0 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {moment(currentDate).format("MMMM YYYY")}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="py-1 text-center text-[10px] font-semibold text-gray-400">
                  {d}
                </div>
              ))}
              {miniCalendarDays.map((day, idx) => {
                if (day === null) return <div key={`e-${idx}`} />;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const todayStr = new Date().toISOString().split("T")[0];
                const dateStr = date.toISOString().split("T")[0];
                const isToday = dateStr === todayStr;
                const isSelected = selectedDate && dateStr === selectedDate.toISOString().split("T")[0];
                const hasTasks = tasks.some((t) => t.dueDate && t.dueDate.startsWith(dateStr));
                return (
                  <button
                    key={day}
                    onClick={() => { setSelectedDate(date); setCurrentDate(date); }}
                    className={cn(
                      "relative flex h-7 w-7 items-center justify-center rounded-full text-xs",
                      isSelected && !isToday && "bg-[#0b1c30] text-white",
                      isToday && "font-bold text-[#2170e4]",
                      !isSelected && !isToday && "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                    )}
                  >
                    {day}
                    {hasTasks && !isSelected && (
                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#2170e4]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Tasks: {selectedDate ? moment(selectedDate).format("MMM D") : "Select a date"}
            </h3>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="cursor-pointer rounded-lg border border-gray-100 p-3 hover:border-[#2170e4]/30 hover:shadow-sm dark:border-white/10 dark:hover:border-[#2170e4]/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", STATUS_COLORS[task.status])}>
                        {STATUS_LABELS[task.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                    {task.description && (
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{task.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={cn("ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-semibold bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400")}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-xs text-gray-500">No tasks on this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
