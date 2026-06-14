"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "mb-1.5 block text-xs font-semibold uppercase tracking-wider transition-colors duration-200",
              isFocused ? "text-[#0058be]" : "text-muted-foreground"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "flex h-12 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-muted-foreground transition-all duration-200",
              "focus:border-[#0058be] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:shadow-[0_0_0_3px_rgba(0,88,190,0.1)]",
              "hover:border-gray-300",
              isPassword && "pr-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-destructive animate-slide-down" style={{ opacity: 0, animationFillMode: "forwards" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
