import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch-tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { profileSchema, changePasswordSchema } from "@/lib/validations";
import type { ProfileFormValues, ChangePasswordFormValues } from "@/lib/validations";
import type { ColorTheme, Mode } from "@/types";
import { cn } from "@/lib/utils";

const COLOR_THEMES: { value: ColorTheme; label: string; color: string }[] = [
  { value: "indigo", label: "Indigo", color: "bg-[hsl(243,75%,59%)]" },
  { value: "rose", label: "Rose", color: "bg-[hsl(346,77%,50%)]" },
  { value: "emerald", label: "Emerald", color: "bg-[hsl(152,69%,36%)]" },
  { value: "amber", label: "Amber", color: "bg-[hsl(32,95%,44%)]" },
  { value: "cyan", label: "Cyan", color: "bg-[hsl(189,94%,36%)]" },
];

const MODES: { value: Mode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function SettingsPage() {
  const { mode, colorTheme, setMode, setColorTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", bio: "" },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onProfileSave(values: ProfileFormValues) {
    await new Promise((r) => setTimeout(r, 600));
    addToast({ title: "Profile updated", description: "Your changes have been saved.", variant: "success" });
    console.log(values);
  }

  async function onPasswordChange(values: ChangePasswordFormValues) {
    await new Promise((r) => setTimeout(r, 600));
    addToast({ title: "Password changed", description: "Your password has been updated.", variant: "success" });
    passwordForm.reset();
    console.log(values);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences.</p>
      </div>

      {/* ── Appearance ── */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customise how the admin panel looks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color mode */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color mode</Label>
            <div className="flex gap-2">
              {MODES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                    mode === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Color theme */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Accent color</Label>
            <div className="flex gap-3">
              {COLOR_THEMES.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setColorTheme(value)}
                  title={label}
                  className={cn(
                    "relative flex items-center justify-center w-9 h-9 rounded-full transition-all ring-2 ring-offset-2 ring-offset-background",
                    color,
                    colorTheme === value ? "ring-foreground scale-110" : "ring-transparent hover:scale-105"
                  )}
                >
                  {colorTheme === value && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently using: <span className="font-medium capitalize">{colorTheme}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Profile ── */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-4">
            <FormField label="Full name" error={profileForm.formState.errors.name?.message} required>
              <Input {...profileForm.register("name")} />
            </FormField>
            <FormField label="Email" error={profileForm.formState.errors.email?.message} required>
              <Input type="email" {...profileForm.register("email")} />
            </FormField>
            <FormField label="Bio" error={profileForm.formState.errors.bio?.message}>
              <Input placeholder="A short bio about yourself" {...profileForm.register("bio")} />
            </FormField>
            <div className="flex justify-end">
              <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                {profileForm.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Password ── */}
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Choose a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-4">
            <FormField label="Current password" error={passwordForm.formState.errors.currentPassword?.message} required>
              <Input type="password" {...passwordForm.register("currentPassword")} />
            </FormField>
            <FormField label="New password" error={passwordForm.formState.errors.newPassword?.message} required>
              <Input type="password" {...passwordForm.register("newPassword")} />
            </FormField>
            <FormField label="Confirm new password" error={passwordForm.formState.errors.confirmPassword?.message} required>
              <Input type="password" {...passwordForm.register("confirmPassword")} />
            </FormField>
            <div className="flex justify-end">
              <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                {passwordForm.formState.isSubmitting ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Notifications preferences ── */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "New user sign-ups", description: "Get notified when someone joins your team." },
            { label: "Security alerts", description: "Receive alerts for suspicious activity." },
            { label: "Weekly reports", description: "A weekly digest of key metrics." },
            { label: "Product updates", description: "Learn about new features and improvements." },
          ].map(({ label, description }) => (
            <div key={label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Switch defaultChecked={label !== "Product updates"} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
