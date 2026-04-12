"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Separator } from "@/components/ui/ui-components";
import { toast } from "@/components/ui/toast";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { token, user } = await authApi.login(data.email, data.password);
      login(token, user);
      toast({ variant: "success", title: `Welcome back, ${user.name}!` });
      if (!user.onboardingCompleted) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: "career" | "employer") => {
    setValue("email", `${role}@demo.com`);
    setValue("password", "demo123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/3 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="w-full max-w-md px-4 relative z-10 animate-fade-in">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <Card variant="elevated">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your CareAble account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Demo quick-fill */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => fillDemo("career")} className="text-xs">
                Demo: Career
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={() => fillDemo("employer")} className="text-xs">
                Demo: Employer
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                or enter manually
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  suffix={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...register("password")}
                  error={errors.password?.message}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Create one free
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
