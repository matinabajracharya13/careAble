import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    // Simulate API call — replace with: post<AuthResponse>("/auth/login", values)
    await new Promise((r) => setTimeout(r, 800));

    if (values.email && values.password) {
      setAuth(
        {
          id: "demo-user",
          name: "Admin User",
          email: values.email,
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        "demo-token-xxxx",
        "demo-refresh-xxxx"
      );
      addToast({ title: "Welcome back!", variant: "success" });
      navigate("/");
    } else {
      addToast({ title: "Invalid credentials", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />

      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-xl p-8 space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/25">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold font-display tracking-tight">AdminOS</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email" error={errors.email?.message} required>
              <Input
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                {...register("email")}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message} required>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Use any email + 8+ char password to demo login.
          </p>
        </div>
      </div>
    </div>
  );
}
