import React from "react";
import WebThreads from "@/components/WebThreads";

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center bg-black overflow-hidden selection:bg-emerald-500/30">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <WebThreads />
        {/* Dark overlay to ensure card readability over intense lines */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
