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

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    try {
      setError(null);
      const { ...submitData } = data;
      await registerUser(submitData);
      router.push("/");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { email?: string[]; detail?: string } } };
      if (err.response?.data?.email) {
        setError(`Email: ${err.response.data.email[0]}`);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to create account. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full">
      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            className="h-8 sm:h-9 text-xs sm:text-sm"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="h-8 sm:h-9 text-xs sm:text-sm"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-8 sm:h-9 text-xs sm:text-sm"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-8 sm:h-9 text-xs sm:text-sm"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-md text-xs sm:text-sm text-red-500">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full mt-3 h-8 sm:h-9 text-xs sm:text-sm" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Sign up"
        )}
      </Button>
    </form>
  );
}
