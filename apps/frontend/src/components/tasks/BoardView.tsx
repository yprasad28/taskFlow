"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Calendar, MoreHorizontal, Plus, CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/constants";
import { useTaskEvent } from "@/hooks/useTaskEvents";
import api from "@/lib/api";
import { Task } from "@/types/task";

interface Column {
  id: string;
  title: string;
  status: Task["status"];
  color: string;
  bgColor: string;
  countBg: string;
}

const columns: Column[] = [
  {
    id: "PENDING",
    title: "To Do",
    status: "PENDING",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-white/[0.02]",
    countBg: "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    status: "IN_PROGRESS",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50/50 dark:bg-blue-500/[0.03]",
    countBg: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    id: "IN_REVIEW",
    title: "In Review",
    status: "IN_REVIEW",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50/50 dark:bg-amber-500/[0.03]",
    countBg:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    id: "COMPLETED",
    title: "Completed",
    status: "COMPLETED",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50/50 dark:bg-green-500/[0.03]",
    countBg:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  },
];

interface BoardViewProps {
  onTaskClick: (task: Task) => void;
  search?: string;
  statusFilter?: string;
  priorityFilter?: string;
}

export function BoardView({ onTaskClick, search, statusFilter, priorityFilter }: BoardViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "200",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (priorityFilter) params.set("priority", priorityFilter);
      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data.data.items || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useTaskEvent("task-created", fetchTasks);
  useTaskEvent("task-updated", fetchTasks);

  const getTasksByStatus = (status: Task["status"]) =>
    tasks.filter((t) => t.status === status);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId as Task["status"];

    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await api.patch(`/tasks/${draggableId}`, { status: newStatus });
      window.dispatchEvent(new CustomEvent("task-updated"));
    } catch {
      fetchTasks();
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {columns.map((col) => {
          const colTasks = getTasksByStatus(col.status);
          const isCompleted = col.status === "COMPLETED";

          return (
            <div
              key={col.id}
              className="flex flex-col min-w-0"
            >
              {/* Column Header */}
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white">
                    {col.title}
                  </h3>
                  <span
                    className={cn(
                      "flex items-center justify-center min-w-[18px] h-[18px] rounded-full px-1 text-[10px] font-semibold",
                      col.countBg
                    )}
                  >
                    {colTasks.length}
                  </span>
                </div>
                <button className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-300 transition-colors">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 min-h-[200px] rounded-xl p-2 space-y-2 transition-colors border-2 border-dashed",
                      snapshot.isDraggingOver
                        ? "bg-[#2170e4]/5 border-[#2170e4]/30"
                        : cn("border-transparent", col.bgColor)
                    )}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onTaskClick(task)}
                            className={cn(
                              "group rounded-lg border border-gray-200/80 bg-white p-3 cursor-grab active:cursor-grabbing transition-all duration-200",
                              "hover:shadow-[0_4px_12px_-2px_rgba(15,23,42,0.08)] hover:-translate-y-0.5",
                              "dark:border-white/[0.08] dark:bg-[#111827] dark:hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]",
                              snapshot.isDragging &&
                                "shadow-2xl rotate-[1.5deg] scale-[1.03] z-50",
                              isCompleted && "opacity-70"
                            )}
                          >
                            {/* Top Row: Priority Badge + Status Icon */}
                            <div className="mb-2 flex items-center justify-between">
                              <span
                                className={cn(
                                  "inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                                  PRIORITY_COLORS[task.priority]
                                )}
                              >
                                {PRIORITY_LABELS[task.priority]}
                              </span>
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : task.status === "IN_PROGRESS" ? (
                                <Star className="h-4 w-4 text-blue-400" />
                              ) : null}
                            </div>

                            {/* Title */}
                            <h4
                              className={cn(
                                "mb-1 text-[13px] font-semibold leading-snug text-gray-900 dark:text-white",
                                isCompleted &&
                                  "line-through text-gray-500 dark:text-gray-400"
                              )}
                            >
                              {task.title}
                            </h4>

                            {/* Description */}
                            {task.description && (
                              <p
                                className={cn(
                                  "mb-2 text-[11px] leading-relaxed line-clamp-2",
                                  isCompleted
                                    ? "text-gray-400 dark:text-gray-500"
                                    : "text-gray-500 dark:text-gray-400"
                                )}
                              >
                                {task.description}
                              </p>
                            )}

                            {/* Bottom Row: Date */}
                            <div className="flex items-center">
                              {task.dueDate ? (
                                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span className="text-[10px] font-medium">
                                    {new Date(task.dueDate).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                        <p className="text-[11px]">No tasks</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>

              {/* Add Task Button */}
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-create-task"))
                }
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 py-2 text-[12px] font-medium text-gray-500 hover:border-[#2170e4]/30 hover:bg-[#2170e4]/5 hover:text-[#2170e4] transition-all dark:border-white/10 dark:text-gray-400 dark:hover:border-[#2170e4]/30 dark:hover:bg-[#2170e4]/5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Task
              </button>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
