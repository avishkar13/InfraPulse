import { AuthCard } from "@/components/auth/auth-card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Start managing your infrastructure with InfraPulse."
    >
      <OAuthButtons />
      <div className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link 
          href="/auth/sign-in" 
          className="text-white hover:text-emerald-400 transition-colors font-medium underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
