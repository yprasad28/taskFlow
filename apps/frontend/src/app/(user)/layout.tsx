"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { Skeleton } from "@/components/ui/Skeleton";
import { MobileMenuContext } from "@/context/MobileMenuContext";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isAdmin, user, authError, retryAuth } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleOpen = () => setCreateModalOpen(true);
    window.addEventListener("open-create-task", handleOpen);
    return () => window.removeEventListener("open-create-task", handleOpen);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !authError) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (isAdmin) {
        router.replace("/admin/dashboard");
      }
    }
  }, [mounted, isLoading, isAuthenticated, isAdmin, authError, router]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen">
        <aside className="hidden w-64 bg-[#0b1c30] lg:block">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-white/10 px-6">
              <Skeleton className="h-6 w-20 bg-white/10" />
            </div>
            <div className="flex-1 space-y-2 p-4">
              <Skeleton className="h-10 w-full bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10" />
            </div>
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
            <Skeleton className="h-10 w-40 sm:w-72" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
          <main className="flex-1 p-4 sm:p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0f1a]">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Server Unavailable
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            {authError}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={retryAuth}
              className="px-6 py-2.5 bg-[#2170e4] text-white rounded-lg font-medium hover:bg-[#1a5bc4] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                router.replace("/login");
              }}
              className="px-6 py-2.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isAdmin) {
    return (
      <div className="flex h-screen">
        <aside className="hidden w-64 bg-[#0b1c30] lg:block">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-white/10 px-6">
              <Skeleton className="h-6 w-20 bg-white/10" />
            </div>
            <div className="flex-1 space-y-2 p-4">
              <Skeleton className="h-10 w-full bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10" />
            </div>
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
            <Skeleton className="h-10 w-40 sm:w-72" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
          <main className="flex-1 p-4 sm:p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <MobileMenuContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0f1a]">
        <UserSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-white/10 dark:bg-[#111827]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
              <div className="relative hidden sm:block">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks, projects..."
                  className="h-10 w-48 lg:w-72 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  const html = document.documentElement;
                  if (html.classList.contains("dark")) {
                    html.classList.remove("dark");
                    localStorage.setItem("theme", "light");
                  } else {
                    html.classList.add("dark");
                    localStorage.setItem("theme", "dark");
                  }
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block dark:hidden">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:block">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              </button>
              <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1c30] text-sm font-medium text-white">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#111827] bg-green-500" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Active</p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 dark:bg-[#0a0f1a]">{children}</main>
        </div>
      </div>
      <CreateTaskModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </MobileMenuContext.Provider>
  );
}
