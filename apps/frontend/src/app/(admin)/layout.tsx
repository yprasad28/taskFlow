"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (!isAdmin) {
        router.replace("/dashboard");
      }
    }
  }, [mounted, isLoading, isAuthenticated, isAdmin, router]);

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
          <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <Skeleton className="h-10 w-72" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
          <main className="flex-1 p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
