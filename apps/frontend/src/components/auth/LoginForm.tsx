"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginForm() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN">("USER");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="animate-slide-up" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div className="flex rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setSelectedRole("USER")}
            className={cn(
              "flex-1 rounded-md py-2.5 text-sm font-medium transition-all duration-200",
              selectedRole === "USER"
                ? "bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            User
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("ADMIN")}
            className={cn(
              "flex-1 rounded-md py-2.5 text-sm font-medium transition-all duration-200",
              selectedRole === "ADMIN"
                ? "bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            Admin
          </button>
        </div>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {selectedRole === "ADMIN"
            ? "Sign in with your admin credentials"
            : "Sign in with your user credentials"}
        </p>
      </div>

      <div className="animate-slide-up delay-150" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="animate-slide-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="animate-slide-up delay-250" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Button
          type="submit"
          className="w-full h-12 bg-[#0b1c30] hover:bg-[#131b2e] text-white font-semibold text-base rounded-lg shadow-lg shadow-[#0b1c30]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </div>

      <p className="animate-slide-up delay-300 text-center text-sm text-gray-500 pt-4" style={{ opacity: 0, animationFillMode: "forwards" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#2170e4] font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
