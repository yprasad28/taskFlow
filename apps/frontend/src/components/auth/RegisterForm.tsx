"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export function RegisterForm() {
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    await registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          Get Started
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
