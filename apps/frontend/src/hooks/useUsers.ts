import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { UserItem } from "@/types/admin";

export function useUsers(enabled = true) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      const { data } = await api.get("/admin/users?limit=50");
      setUsers(data.data.items);
    } catch {} finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading };
}
