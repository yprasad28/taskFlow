"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN">("USER");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" },
  });

  const handleRoleChange = (role: "USER" | "ADMIN") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (data: RegisterInput) => {
    await registerUser({ ...data, role: selectedRole });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="animate-slide-up" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div className="flex rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-1">
          <button
            type="button"
            onClick={() => handleRoleChange("USER")}
            className={cn(
              "flex-1 rounded-md py-2.5 text-sm font-medium transition-all duration-200",
              selectedRole === "USER"
                ? "bg-[#2170e4] text-white shadow-sm"
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
            onClick={() => handleRoleChange("ADMIN")}
            className={cn(
              "flex-1 rounded-md py-2.5 text-sm font-medium transition-all duration-200",
              selectedRole === "ADMIN"
                ? "bg-[#2170e4] text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            Admin
          </button>
        </div>
        <input type="hidden" {...register("role")} value={selectedRole} />
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {selectedRole === "ADMIN"
            ? "Admins can manage users, tasks, and view analytics"
            : "Users can create and manage their own tasks"}
        </p>
      </div>

      <div className="animate-slide-up delay-75" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Input
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register("name")}
        />
      </div>
      <div className="animate-slide-up delay-100" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="animate-slide-up delay-150 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <div className="animate-slide-up delay-250" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Button
          type="submit"
          className="w-full h-12 bg-[#0b1c30] hover:bg-[#131b2e] text-white font-semibold text-base rounded-lg shadow-lg shadow-[#0b1c30]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          isLoading={isSubmitting}
        >
          Get Started as {selectedRole === "ADMIN" ? "Admin" : "User"}
        </Button>
      </div>

      <p className="animate-slide-up delay-300 text-center text-sm text-gray-500 pt-4" style={{ opacity: 0, animationFillMode: "forwards" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#2170e4] font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
