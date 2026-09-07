import { Activity } from "lucide-react";
import Link from "next/link";

export function AuthBrand() {
  return (
    <Link href="/" className="flex flex-col items-center gap-2 group">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all group-hover:scale-105 group-hover:bg-emerald-500/20">
        <Activity className="h-6 w-6" />
      </div>
      <span className="text-xl font-bold tracking-tight">InfraPulse</span>
    </Link>
  );
}
