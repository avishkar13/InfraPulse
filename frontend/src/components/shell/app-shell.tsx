"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !pathname.startsWith("/auth")) {
        router.push("/auth/sign-in");
      } else if (isAuthenticated && pathname.startsWith("/auth")) {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prevent flash of content before redirect
  if (!isAuthenticated && !pathname.startsWith("/auth")) return null;
  if (isAuthenticated && pathname.startsWith("/auth")) return null;
  
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
