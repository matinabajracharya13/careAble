"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus, ArrowLeft, Briefcase, GraduationCap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Separator } from "@/components/ui/ui-components";
import { toast } from "@/components/ui/toast";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["employer", "career"]),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const ROLE_OPTIONS: { value: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: "career",
    label: "Career Seeker",
    description: "I want to validate my skills and grow my career",
    icon: GraduationCap,
  },
  {
    value: "employer",
    label: "Employer",
    description: "I want to hire verified talent for my team",
    icon: Briefcase,
  },
];

const PERKS = [
  "Free skill assessments",
  "Verified certificates",
  "Trusted by 340+ companies",
  "No credit card required",
];

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("career");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "career" },
  });

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { token, user } = await authApi.signup(data);
      login(token, user);
      toast({ variant: "success", title: `Welcome to CareAble, ${user.name}!` });
      router.push("/onboarding");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Signup failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-16 py-10">
      <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="w-full max-w-4xl px-4 relative z-10 animate-fade-in">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left panel */}
          <div className="md:col-span-2 space-y-8 pt-4">
            <div>
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/20">
                <span className="text-primary-foreground font-display font-bold text-sm">SB</span>
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground text-sm">Join thousands of professionals and companies on CareAble.</p>
            </div>
            <ul className="space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">Sign in here</Link>
            </p>
          </div>

          {/* Form */}
          <Card variant="elevated" className="md:col-span-3">
            <CardContent className="p-8 space-y-5">
              {/* Role selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">I am a…</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => selectRole(opt.value)}
                      className={cn(
                        "flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all",
                        selectedRole === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", selectedRole === opt.value ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                        <opt.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <input type="hidden" {...register("role")} />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full name</label>
                  <Input placeholder="Jane Smith" {...register("name")} error={errors.name?.message} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email address</label>
                  <Input type="email" placeholder="jane@company.com" {...register("email")} error={errors.email?.message} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="8+ characters"
                      suffix={
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                      {...register("password")}
                      error={errors.password?.message}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Confirm password</label>
                    <Input
                      type="password"
                      placeholder="Repeat password"
                      {...register("confirmPassword")}
                      error={errors.confirmPassword?.message}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  <UserPlus className="h-4 w-4" />
                  Create account
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By signing up you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
