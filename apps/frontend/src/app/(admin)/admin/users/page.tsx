"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  taskCount: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (page: number, searchQuery: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (searchQuery) params.set("search", searchQuery);
      const { data } = await api.get(`/admin/users?${params.toString()}`);
      setUsers(data.data.items);
      setPagination(data.data.pagination);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage, fetchUsers, search]);

  const totalPages = pagination?.totalPages || 1;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-xl font-bold text-gray-900">All Users</h1>
        <p className="text-sm text-gray-500">
          Manage and view all registered users.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <span className="text-sm text-gray-500">
            {pagination?.total || 0} total users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tasks
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                        <div>
                          <div className="h-4 w-28 animate-pulse rounded bg-gray-200 mb-1" />
                          <div className="h-3 w-36 animate-pulse rounded bg-gray-100" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-8 animate-pulse rounded bg-gray-200" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-200" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-4 animate-pulse rounded bg-gray-200" /></td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b1c30] text-sm font-medium text-white">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {user.taskCount}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, pagination.total)} of{" "}
              {pagination.total} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                    page === currentPage
                      ? "bg-[#0b1c30] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={!pagination.hasNext}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
