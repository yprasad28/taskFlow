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
          <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm p-6">
            <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <rect x="20" y="20" width="110" height="180" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
              <text x="75" y="48" textAnchor="middle" fill="#7c839b" fontSize="11" fontWeight="600">TO DO</text>
              <rect x="32" y="60" width="86" height="36" rx="8" fill="rgba(33,112,228,0.15)" stroke="rgba(33,112,228,0.3)" strokeWidth="1"/>
              <rect x="42" y="70" width="50" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
              <rect x="42" y="82" width="30" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
              <rect x="32" y="104" width="86" height="36" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <rect x="42" y="114" width="60" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
              <rect x="42" y="126" width="40" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
              <rect x="32" y="148" width="86" height="36" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <rect x="42" y="158" width="45" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
              <rect x="42" y="170" width="55" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>

              <rect x="145" y="20" width="110" height="180" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
              <text x="200" y="48" textAnchor="middle" fill="#7c839b" fontSize="11" fontWeight="600">IN PROGRESS</text>
              <rect x="157" y="60" width="86" height="36" rx="8" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.3)" strokeWidth="1"/>
              <rect x="167" y="70" width="55" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
              <rect x="167" y="82" width="35" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
              <rect x="157" y="104" width="86" height="36" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <rect x="167" y="114" width="48" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
              <rect x="167" y="126" width="60" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>

              <rect x="270" y="20" width="110" height="180" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
              <text x="325" y="48" textAnchor="middle" fill="#7c839b" fontSize="11" fontWeight="600">DONE</text>
              <rect x="282" y="60" width="86" height="36" rx="8" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.3)" strokeWidth="1"/>
              <rect x="292" y="70" width="40" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
              <rect x="292" y="82" width="50" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
              <circle cx="350" cy="78" r="8" fill="rgba(34,197,94,0.3)"/>
              <path d="M347 78l2 2 4-4" stroke="rgba(34,197,94,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="282" y="104" width="86" height="36" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <rect x="292" y="114" width="55" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
              <rect x="292" y="126" width="35" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
              <circle cx="350" cy="122" r="8" fill="rgba(34,197,94,0.3)"/>
              <path d="M347 122l2 2 4-4" stroke="rgba(34,197,94,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-[#f7f9fb]">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </section>
    </div>
  );
}
