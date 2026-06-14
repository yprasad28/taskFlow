"use client";

import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "./TaskForm";
import { useUpdateTask } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { CreateTaskInput } from "@/validations/task";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const updateTask = useUpdateTask();

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <div className="mt-4">
        {task && (
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={updateTask.isPending}
          />
        )}
      </div>
    </Modal>
  );
}
