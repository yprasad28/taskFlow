"use client";

import { MoreVertical, Pencil, Trash2, Calendar } from "lucide-react";
import { Task, STATUS_LABELS, PRIORITY_LABELS, STATUS_COLORS, PRIORITY_COLORS } from "@/types/task";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium leading-none line-clamp-1">{task.title}</h3>
          {task.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-md p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-accent-foreground transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border bg-popover py-1 shadow-md">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className={STATUS_COLORS[task.status]}>
          {STATUS_LABELS[task.status]}
        </Badge>
        <Badge className={PRIORITY_COLORS[task.priority]}>
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
