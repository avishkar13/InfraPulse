"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    try {
      setError(null);
      await login(data);
      router.push("/");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string; non_field_errors?: string[] } } };
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          className="h-9 text-xs sm:text-sm"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="h-9 text-xs sm:text-sm"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-md text-xs sm:text-sm text-red-500">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full mt-3 h-9 text-xs sm:text-sm" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
