"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export function QuickCreate() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await api.post("/tasks", {
        title: title.trim(),
        priority,
        dueDate: dueDate || undefined,
      });
      setTitle("");
      setPriority("MEDIUM");
      setDueDate("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      toast.error("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10 p-4">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Create</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Task Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="I need to..."
            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 focus:border-[#2170e4] transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 focus:border-[#2170e4]"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 focus:border-[#2170e4]"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg py-2 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {success ? (
            <>✓ Added!</>
          ) : submitting ? (
            <>Adding...</>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
}
