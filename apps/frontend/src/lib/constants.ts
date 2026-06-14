export const ITEMS_PER_PAGE = 8;

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  IN_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
};

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  COMPLETED: "Completed",
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};
