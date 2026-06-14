"use client";

import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatCards } from "@/components/dashboard/StatCards";
import { TodaysTasks } from "@/components/dashboard/TodaysTasks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TotalProgress } from "@/components/dashboard/TotalProgress";
import { QuickCreate } from "@/components/dashboard/QuickCreate";
import { DailySchedule } from "@/components/dashboard/DailySchedule";

export default function DashboardPage() {
  return (
    <div>
      <WelcomeSection />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Main Content */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <StatCards />
          <TodaysTasks />
          <RecentActivity />
        </section>

        {/* Right Column - Sidebar Widgets */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <TotalProgress />
          <QuickCreate />
          <DailySchedule />
        </aside>
      </div>
    </div>
  );
}
