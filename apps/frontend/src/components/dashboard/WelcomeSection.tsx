"use client";

import { useAuth } from "@/hooks/useAuth";

export function WelcomeSection() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {getGreeting()}, {firstName}
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Here's what's happening with your projects today.
      </p>
    </div>
  );
}
