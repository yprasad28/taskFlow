"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dispatchTaskEvent } from "@/hooks/useTaskEvents";
import { useUsers } from "@/hooks/useUsers";
import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import { toast } from "sonner";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const { users, loading: loadingUsers } = useUsers(isOpen);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignee) return;
    setSubmitting(true);
    try {
      await api.post("/tasks", {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        userId: assignee,
      });
      setTitle("");
      setDescription("");
      setProject("");
      setDueDate("");
      setAssignee("");
      setPriority("MEDIUM");
      dispatchTaskEvent("task-created");
      onClose();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Update API Documentation"
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white dark:placeholder:text-gray-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the task requirements..."
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white dark:placeholder:text-gray-500 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white transition-all appearance-none"
            >
              <option value="">Select project</option>
              <option value="Mobile App UI">Mobile App UI</option>
              <option value="Web Platform">Web Platform</option>
              <option value="Backend API">Backend API</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Assignee
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white transition-all appearance-none"
            required
          >
            <option value="">
              {loadingUsers ? "Loading users..." : "Select assignee"}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  "h-10 rounded-lg border text-sm font-medium transition-all",
                  priority === p
                    ? "border-[#2170e4] bg-[#2170e4]/10 text-[#2170e4] ring-2 ring-[#2170e4]/20"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {p === "LOW" ? "Low" : p === "MEDIUM" ? "Medium" : "High"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !title.trim() || !assignee}
            className="h-10 px-5 rounded-lg bg-[#2170e4] text-sm font-medium text-white hover:bg-[#1a5fc0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
