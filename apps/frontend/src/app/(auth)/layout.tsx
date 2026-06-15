"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <section className="hidden lg:flex w-1/2 flex-col justify-between bg-[#0b1c30] p-12 text-white relative overflow-hidden">
        <div className="z-10 animate-slide-in-right">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2170e4] animate-scale-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 11l3 3L22 4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              TaskFlow
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight max-w-md mt-16 animate-slide-up delay-100" style={{ opacity: 0, animationFillMode: "forwards" }}>
            Streamline your workflow, empower your team.
          </h1>
          <p className="mt-6 max-w-sm text-[#7c839b] text-base leading-relaxed animate-slide-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
            Manage complex project lifecycles with surgical precision. The next
            evolution in enterprise resource coordination.
          </p>
        </div>

        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2170e4]/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-[#2170e4]/10 rounded-full blur-2xl animate-pulse-soft delay-200" />

        <div className="z-10 mt-auto animate-slide-up delay-300" style={{ opacity: 0, animationFillMode: "forwards" }}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Demo Credentials</h3>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#dae2fd] uppercase tracking-wider">Admin</span>
                  <span className="px-2 py-0.5 bg-[#2170e4] text-xs font-semibold rounded">ADMIN</span>
                </div>
                <div className="space-y-1 text-sm text-[#7c839b] font-mono">
                  <div>admin@taskflow.com</div>
                  <div>password123</div>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#dae2fd] uppercase tracking-wider">User</span>
                  <span className="px-2 py-0.5 bg-gray-500 text-xs font-semibold rounded">USER</span>
                </div>
                <div className="space-y-1 text-sm text-[#7c839b] font-mono">
                  <div>demo@taskflow.com</div>
                  <div>password123</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-[#f7f9fb]">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </section>
    </div>
  );
}
