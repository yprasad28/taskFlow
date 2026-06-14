"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogoutModal } from "@/components/layout/LogoutModal";
import { MobileMenuContext } from "@/context/MobileMenuContext";

const userNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
];

export function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const { mobileOpen, setMobileOpen } = useContext(MobileMenuContext);

  const navContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2170e4]">
            <CheckSquare className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">TaskFlow</span>
            <p className="text-[10px] text-[#7c839b]">Enterprise Edition</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {userNavItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href.split("?")[0]);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2170e4] text-white"
                  : "text-[#9ca3b8] hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => setShowLogout(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#9ca3b8] hover:bg-[#2170e4] hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Log out
        </button>
      </div>
      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={() => { setShowLogout(false); setMobileOpen(false); logout(); }}
      />
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0b1c30] text-white shrink-0">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#0b1c30] text-white">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
