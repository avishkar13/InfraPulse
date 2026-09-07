"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  
  if (pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[256px_1fr]">
      <Sidebar />
      <div className="flex flex-col lg:pl-0">
        <Header />
        <main className="flex-1 bg-muted/20">
          <div className="h-full p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
