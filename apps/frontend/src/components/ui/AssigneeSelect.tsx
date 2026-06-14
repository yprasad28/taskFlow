import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";

interface AssigneeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AssigneeSelect({ value, onChange, className }: AssigneeSelectProps) {
  const { users, loading } = useUsers();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white transition-all appearance-none",
        className
      )}
    >
      <option value="">
        {loading ? "Loading users..." : "Select assignee"}
      </option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name} ({user.role})
        </option>
      ))}
    </select>
  );
}
