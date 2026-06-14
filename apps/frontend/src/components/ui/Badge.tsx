import { cn } from "@/lib/utils";
import { STATUS_COLORS, PRIORITY_COLORS, STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";

interface BadgeProps {
  value?: string;
  type?: "status" | "priority";
  variant?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ value, type, variant, className, children }: BadgeProps) {
  if (value && type) {
    const colors = type === "status" ? STATUS_COLORS : PRIORITY_COLORS;
    const labels = type === "status" ? STATUS_LABELS : PRIORITY_LABELS;
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
          colors[value] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
          className
        )}
      >
        {labels[value] || value}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>
      {children}
    </span>
  );
}

export function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
