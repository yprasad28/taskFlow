"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN">("USER");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "USER",
    },
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
      <div className="animate-slide-up delay-75 p-1 bg-gray-100 rounded-lg flex gap-1" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <button
          type="button"
          onClick={() => handleRoleChange("USER")}
          className={cn(
            "flex-1 py-2.5 rounded-md text-sm font-semibold transition-all duration-200",
            selectedRole === "USER"
              ? "bg-white text-[#2170e4] shadow-sm scale-[1.02]"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          User
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("ADMIN")}
          className={cn(
            "flex-1 py-2.5 rounded-md text-sm font-semibold transition-all duration-200",
            selectedRole === "ADMIN"
              ? "bg-white text-[#2170e4] shadow-sm scale-[1.02]"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          Admin
        </button>
      </div>

      <div className="animate-slide-up delay-100" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Input
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register("name")}
        />
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
      <div className="animate-slide-up delay-200 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ opacity: 0, animationFillMode: "forwards" }}>
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

      <div className="animate-slide-up delay-250 flex items-start gap-3 py-2" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <input
          id="terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2170e4] focus:ring-[#2170e4]/20"
        />
        <label htmlFor="terms" className="text-sm text-gray-500">
          By signing up, you agree to our{" "}
          <a href="#" className="text-[#2170e4] hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#2170e4] hover:underline">
            Privacy Policy
          </a>
          .
        </label>
      </div>

      <div className="animate-slide-up delay-300" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Button
          type="submit"
          className="w-full h-12 bg-[#0b1c30] hover:bg-[#131b2e] text-white font-semibold text-base rounded-lg shadow-lg shadow-[#0b1c30]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          isLoading={isSubmitting}
        >
          Get Started
        </Button>
      </div>

      <p className="animate-slide-up delay-400 text-center text-sm text-gray-500 pt-4" style={{ opacity: 0, animationFillMode: "forwards" }}>
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
