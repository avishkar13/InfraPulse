import { AuthBrand } from "./auth-brand";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <AuthBrand />
        <div className="flex flex-col items-center mt-6 mb-8 text-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-sm text-gray-400 max-w-xs">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
