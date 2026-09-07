import { AuthCard } from "@/components/auth/auth-card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import Link from "next/link";

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your InfraPulse account."
    >
      <OAuthButtons />
      <div className="mt-8 text-center text-sm text-gray-400">
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
