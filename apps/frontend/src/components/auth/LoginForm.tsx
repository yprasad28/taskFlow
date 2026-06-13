"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export function LoginForm() {
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

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

      <div className="animate-slide-up delay-250 flex items-center justify-between" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#0058be] focus:ring-[#0058be]/20"
          />
          <label htmlFor="remember" className="text-sm text-gray-500">
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-[#0058be] hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <div className="animate-slide-up delay-300" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <Button
          type="submit"
          className="w-full h-12 bg-[#0b1c30] hover:bg-[#131b2e] text-white font-semibold text-base rounded-lg shadow-lg shadow-[#0b1c30]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </div>

      <p className="animate-slide-up delay-400 text-center text-sm text-gray-500 pt-4" style={{ opacity: 0, animationFillMode: "forwards" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#0058be] font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
