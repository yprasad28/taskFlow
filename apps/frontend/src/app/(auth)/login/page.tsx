import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-up" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-sm text-gray-500">
          Sign in to your account to continue
        </p>
      </div>
      <div className="animate-slide-up delay-100" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <LoginForm />
      </div>
    </div>
  );
}
