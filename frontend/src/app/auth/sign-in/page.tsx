import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import Link from "next/link";

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your InfraPulse account."
    >
      <SignInForm />
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <OAuthButtons />
      <div className="mt-5 text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link 
          href="/auth/sign-up" 
          className="text-white hover:text-emerald-400 transition-colors font-medium underline underline-offset-4"
        >
          Sign up
        </Link>
      </div>
    </AuthCard>
  );
}
