"use client";

import { LogOut, X, Zap } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] mx-4 rounded-2xl bg-white shadow-2xl dark:bg-[#1a2332] dark:border dark:border-white/10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2170e4]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-gray-900 dark:text-white">TASKFLOW</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
            <LogOut className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sign Out?</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to sign out of your session? Any unsaved changes may be lost.
          </p>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/10">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#2170e4] px-4 py-3 text-sm font-medium text-white hover:bg-[#1a5fc0] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
