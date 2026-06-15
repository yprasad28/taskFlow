"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "./TaskForm";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { CreateTaskInput } from "@/validations/task";
import { dispatchTaskEvent } from "@/hooks/useTaskEvents";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (data: CreateTaskInput) => {
    if (!task) return;
    await updateTask.mutateAsync({
      id: task.id,
      ...data,
      description: data.description || null,
      dueDate: data.dueDate || null,
    });
    onClose();
  };

  const handleDelete = async () => {
    if (!task) return;
    await deleteTask.mutateAsync(task.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
        <div className="mt-4">
          {task && (
            <TaskForm
              task={task}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isLoading={updateTask.isPending}
              onDelete={() => setShowDeleteConfirm(true)}
            />
          )}
        </div>
      </Modal>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => { if (!deleteTask.isPending) setShowDeleteConfirm(false); }}>
          <div className="w-full max-w-[440px] mx-4 rounded-2xl bg-white shadow-2xl dark:bg-[#1a2332] dark:border dark:border-white/10 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Task?</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete &quot;{task?.title}&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/10">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteTask.isPending}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteTask.isPending}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteTask.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
