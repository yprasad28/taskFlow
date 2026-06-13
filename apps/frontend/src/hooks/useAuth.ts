"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api, { setAccessToken } from "@/lib/api";
import { User, AuthData } from "@/types/user";
import { Role } from "@/types/roles";
import { ApiResponse } from "@/types/api";
import { LoginInput, RegisterInput } from "@/validations/auth";
import { toast } from "sonner";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      setAccessToken(token);
      const { data } = await api.get("/auth/me");
      setUser(data.data.user);
    } catch {
      localStorage.removeItem("accessToken");
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const getRedirectPath = (role: Role): string => {
    return role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
  };

  const login = async (input: LoginInput) => {
    try {
      const { data } = await api.post<ApiResponse<AuthData>>("/auth/login", input);
      const { user, token, refreshToken } = data.data;

      localStorage.setItem("accessToken", token);
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
      setAccessToken(token);
      setUser(user);

      toast.success("Welcome back!");
      router.push(getRedirectPath(user.role));
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = apiError.response?.data?.error?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const { data } = await api.post<ApiResponse<AuthData>>("/auth/register", input);
      const { user, token, refreshToken } = data.data;

      localStorage.setItem("accessToken", token);
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
      setAccessToken(token);
      setUser(user);

      toast.success("Account created successfully!");
      router.push(getRedirectPath(user.role));
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = apiError.response?.data?.error?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    document.cookie = "refreshToken=; path=/; max-age=0";
    setAccessToken(null);
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
  };
}
