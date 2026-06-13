import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-up" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-sm text-gray-500">
          Join over 10,000 professional teams optimizing their project
          lifecycles.
        </p>
      </div>
      <div className="animate-slide-up delay-100" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <RegisterForm />
      </div>
    </div>
  );
}
