"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useDeleteTask } from "@/hooks/useTasks";
import { Task } from "@/types/task";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  task,
}: DeleteConfirmModalProps) {
  const deleteTask = useDeleteTask();

  const handleDelete = async () => {
    if (!task) return;
    await deleteTask.mutateAsync(task.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task">
      <div className="mt-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{task?.title}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={deleteTask.isPending}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
