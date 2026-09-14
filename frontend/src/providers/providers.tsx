import { AuthProvider } from "./auth-provider";
import { OrganizationProvider } from "./org-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OrganizationProvider>
        {children}
      </OrganizationProvider>
    </AuthProvider>
  );
}
