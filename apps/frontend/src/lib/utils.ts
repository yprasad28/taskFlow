import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const ACTIVITY_STYLES: Record<string, { icon: string; bg: string; text: string; label: string }> = {
  created: { icon: "📝", bg: "bg-blue-100 dark:bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", label: "Created" },
  updated: { icon: "✏️", bg: "bg-purple-100 dark:bg-purple-500/15", text: "text-purple-600 dark:text-purple-400", label: "Updated" },
  deleted: { icon: "🗑️", bg: "bg-red-100 dark:bg-red-500/15", text: "text-red-600 dark:text-red-400", label: "Deleted" },
  assigned: { icon: "👤", bg: "bg-[#2170e4]/10 dark:bg-[#2170e4]/15", text: "text-[#2170e4]", label: "Assigned to you" },
  status_changed: { icon: "🔄", bg: "bg-amber-100 dark:bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", label: "Status changed" },
};
