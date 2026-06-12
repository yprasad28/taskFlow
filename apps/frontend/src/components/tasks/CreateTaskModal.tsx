"use client";

import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "./TaskForm";
import { useCreateTask } from "@/hooks/useTasks";
import { CreateTaskInput } from "@/validations/task";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask();

  const handleSubmit = async (data: CreateTaskInput) => {
    await createTask.mutateAsync({
      ...data,
      description: data.description || null,
      dueDate: data.dueDate || null,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task">
      <div className="mt-4">
        <TaskForm
          onSubmit={handleSubmit}
          isLoading={createTask.isPending}
        />
      </div>
    </Modal>
  );
}
