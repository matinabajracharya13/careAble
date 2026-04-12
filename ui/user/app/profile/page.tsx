"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  User, Lock, Award, BookOpen, Camera, Save, Eye, EyeOff,
  CheckCircle, XCircle, Clock, ChevronRight, Shield, Loader2,
  Pencil, X, Trophy, AlertTriangle, BarChart2, Star,
  MapPin, Briefcase, Mail, Phone, Globe, Plus, Trash2,
  TrendingUp, Calendar, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Badge, Progress, Separator, Textarea,
} from "@/components/ui/ui-components";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import { assessmentApi, certificateApi } from "@/lib/api";
import { cn, formatDate, getLevelBadgeClass, formatScore } from "@/lib/utils";

// ── Validation schemas ────────────────────────────────────────────────────────

const infoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
  skills: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type InfoFormData = z.infer<typeof infoSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ── Mock profile data ─────────────────────────────────────────────────────────

const MOCK_ACTIVITY = [
  { id: "a1", type: "certificate", text: "Earned JavaScript Fundamentals certificate", date: "2026-03-28", score: 87 },
  { id: "a2", type: "assessment", text: "Completed Project Management Essentials", date: "2026-03-15", score: 62 },
  { id: "a3", type: "assessment", text: "Started JavaScript Fundamentals assessment", date: "2026-03-28", score: null },
  { id: "a4", type: "profile", text: "Completed profile onboarding", date: "2026-03-10", score: null },
];

const MOCK_CERTIFICATES = [
  {
    id: "cert-abc123",
    title: "JavaScript Fundamentals",
    category: "Technology",
    level: "intermediate",
    score: 87,
    issuedAt: "2026-03-28",
    verificationCode: "SB-ABC123",
  },
];

const MOCK_ASSESSMENTS = [
  {
    id: "assess1",
    title: "JavaScript Fundamentals",
    level: "intermediate",
    score: 87,
    passed: true,
    completedAt: "2026-03-28",
    status: "completed",
  },
  {
    id: "assess2",
    title: "Project Management Essentials",
    level: "beginner",
    score: 62,
    passed: false,
    completedAt: "2026-03-15",
    status: "completed",
  },
  {
    id: "assess3",
    title: "Python Fundamentals",
    level: "beginner",
    score: null,
    passed: null,
    completedAt: null,
    status: "available",
  },
];

// ── Tab list ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "info", label: "Personal Info", icon: Pencil },
  { id: "password", label: "Password", icon: Lock },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "assessments", label: "Assessments", icon: BookOpen },
  { id: "activity", label: "Activity", icon: Clock },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Avatar uploader ───────────────────────────────────────────────────────────

function AvatarUploader({ name, avatar }: { name: string; avatar?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatar ?? null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    toast({ variant: "success", title: "Avatar updated!" });
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative group w-fit">
      <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg shadow-primary/20">
        {preview ? (
          <img src={preview} alt={name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Camera className="h-5 w-5 text-white" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────

function OverviewTab({ user }: { user: any }) {
  const completionItems = [
    { label: "Profile photo", done: !!user.avatar },
    { label: "Personal info", done: true },
    { label: "Bio added", done: false },
    { label: "First assessment", done: true },
    { label: "Certificate earned", done: true },
    { label: "Skills listed", done: false },
  ];
  const completion = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Certificates", value: MOCK_CERTIFICATES.length, icon: Award, color: "text-primary", bg: "bg-primary/10" },
          { label: "Assessments taken", value: MOCK_ASSESSMENTS.filter((a) => a.status === "completed").length, icon: BookOpen, color: "text-accent", bg: "bg-accent/10" },
          { label: "Best score", value: "87%", icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
          { label: "Member since", value: "Mar '26", icon: Calendar, color: "text-warning", bg: "bg-warning/10" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", s.bg)}>
                <s.icon className={cn("h-5 w-5", s.color)} />
              </div>
              <div>
                <p className="text-xl font-display font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile completion</CardTitle>
            <CardDescription>Complete your profile to get discovered by employers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-display font-bold gradient-text">{completion}%</span>
              <span className="text-sm text-muted-foreground">
                {completionItems.filter((i) => i.done).length}/{completionItems.length} complete
              </span>
            </div>
            <Progress value={completion} className="h-2" />
            <ul className="space-y-2">
              {completionItems.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  {item.done ? (
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                  )}
                  <span className={item.done ? "text-muted-foreground line-through opacity-60" : ""}>{item.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent certs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent certificates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_CERTIFICATES.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Award className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No certificates yet</p>
                <Button size="sm" variant="outline" className="mt-3" asChild>
                  <Link href="/assessment">Take an assessment</Link>
                </Button>
              </div>
            ) : (
              MOCK_CERTIFICATES.map((cert) => (
                <div key={cert.id} className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20">
                  <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                    <Trophy className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(cert.issuedAt)} · Score: {cert.score}%</p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/certificate/${cert.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Score performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessment performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_ASSESSMENTS.filter((a) => a.status === "completed").map((a) => (
              <div key={a.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{a.title}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold", a.passed ? "text-success" : "text-destructive")}>
                      {a.score}%
                    </span>
                    {a.passed ? (
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                    )}
                  </div>
                </div>
                <Progress value={a.score ?? 0} className={cn("h-1.5", a.passed ? "" : "[&>div]:bg-destructive")} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Personal info tab ─────────────────────────────────────────────────────────

function InfoTab({ user, updateUser }: { user: any; updateUser: (u: any) => void }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle ?? "",
      location: "",
      phone: "",
      website: "",
      bio: "",
      skills: (user.skills ?? []).join(", "),
    },
  });

  const bio = watch("bio") ?? "";

  const onSubmit = async (data: InfoFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({
      name: data.name,
      email: data.email,
      jobTitle: data.jobTitle,
      skills: data.skills?.split(",").map((s) => s.trim()).filter(Boolean),
    });
    toast({ variant: "success", title: "Profile updated!", description: "Your information has been saved." });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic information</CardTitle>
          <CardDescription>Your name and contact details visible to employers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full name <span className="text-destructive">*</span></label>
              <Input placeholder="Jane Smith" {...register("name")} error={errors.name?.message} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email address <span className="text-destructive">*</span></label>
              <Input type="email" placeholder="jane@example.com" icon={<Mail className="h-4 w-4" />} {...register("email")} error={errors.email?.message} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Job title</label>
              <Input placeholder="e.g. Software Engineer" icon={<Briefcase className="h-4 w-4" />} {...register("jobTitle")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="e.g. Sydney, NSW" icon={<MapPin className="h-4 w-4" />} {...register("location")} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone number</label>
              <Input type="tel" placeholder="+61 4xx xxx xxx" icon={<Phone className="h-4 w-4" />} {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Website / LinkedIn</label>
              <Input placeholder="https://linkedin.com/in/..." icon={<Globe className="h-4 w-4" />} {...register("website")} error={errors.website?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About you</CardTitle>
          <CardDescription>A short bio shown on your public profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Bio</label>
              <span className={cn("text-xs", bio.length > 280 ? "text-destructive" : "text-muted-foreground")}>
                {bio.length}/300
              </span>
            </div>
            <Textarea
              placeholder="Tell employers about yourself, your experience, and what you're looking for..."
              rows={4}
              {...register("bio")}
              error={errors.bio?.message}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Skills</label>
            <Input placeholder="JavaScript, React, Python, SQL, ..." {...register("skills")} />
            <p className="text-xs text-muted-foreground">Separate skills with commas.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={loading} disabled={!isDirty}>
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </div>
    </form>
  );
}

// ── Password tab ──────────────────────────────────────────────────────────────

function PasswordTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const newPw = watch("newPassword") ?? "";

  const strength = (() => {
    let score = 0;
    if (newPw.length >= 8) score++;
    if (/[A-Z]/.test(newPw)) score++;
    if (/[0-9]/.test(newPw)) score++;
    if (/[^A-Za-z0-9]/.test(newPw)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-destructive", "bg-warning", "bg-accent", "bg-success"][strength];

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    // In real app: await authApi.changePassword(data.currentPassword, data.newPassword)
    toast({ variant: "success", title: "Password updated!", description: "Your new password is active." });
    reset();
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Change password
          </CardTitle>
          <CardDescription>Choose a strong password you don't use elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Current password</label>
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter your current password"
                suffix={
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...register("currentPassword")}
                error={errors.currentPassword?.message}
              />
            </div>

            <Separator />

            <div className="space-y-1.5">
              <label className="text-sm font-medium">New password</label>
              <Input
                type={showNew ? "text" : "password"}
                placeholder="8+ characters"
                suffix={
                  <button type="button" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...register("newPassword")}
                error={errors.newPassword?.message}
              />
              {newPw.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn("h-1 flex-1 rounded-full transition-all duration-300", i <= strength ? strengthColor : "bg-border")}
                      />
                    ))}
                  </div>
                  <p className={cn("text-xs font-medium", strengthColor.replace("bg-", "text-"))}>
                    {strengthLabel} password
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirm new password</label>
              <Input
                type="password"
                placeholder="Repeat new password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </div>

            {/* Requirements */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground mb-2">PASSWORD REQUIREMENTS</p>
              {[
                { label: "At least 8 characters", met: newPw.length >= 8 },
                { label: "One uppercase letter", met: /[A-Z]/.test(newPw) },
                { label: "One number", met: /[0-9]/.test(newPw) },
                { label: "One special character", met: /[^A-Za-z0-9]/.test(newPw) },
              ].map((req) => (
                <div key={req.label} className="flex items-center gap-2 text-xs">
                  {req.met ? (
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40" />
                  )}
                  <span className={req.met ? "text-foreground" : "text-muted-foreground"}>{req.label}</span>
                </div>
              ))}
            </div>

            <Button type="submit" loading={loading} className="w-full">
              <Lock className="h-4 w-4" />
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex gap-3">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary">Security tip</p>
            <p className="text-xs text-muted-foreground">
              Use a password manager to generate and store unique passwords. Never reuse passwords across sites.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Certificates tab ──────────────────────────────────────────────────────────

function CertificatesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg">Your certificates</h3>
          <p className="text-sm text-muted-foreground">{MOCK_CERTIFICATES.length} certificate{MOCK_CERTIFICATES.length !== 1 ? "s" : ""} earned</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/assessment">
            <Plus className="h-4 w-4" />
            Earn more
          </Link>
        </Button>
      </div>

      {MOCK_CERTIFICATES.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground space-y-3">
            <Award className="h-14 w-14 mx-auto opacity-20" />
            <p className="font-semibold">No certificates yet</p>
            <p className="text-sm">Pass an assessment to earn your first certificate.</p>
            <Button asChild>
              <Link href="/assessment">Browse assessments</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {MOCK_CERTIFICATES.map((cert) => (
            <Card key={cert.id} className="card-hover overflow-hidden">
              {/* Top accent strip */}
              <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                    <Trophy className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-base leading-tight">{cert.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize", getLevelBadgeClass(cert.level))}>
                        {cert.level}
                      </span>
                      <span className="text-xs text-muted-foreground">{cert.category}</span>
                    </div>
                  </div>
                </div>

                {/* Score visual */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Score achieved</span>
                    <span className="font-bold text-success">{cert.score}%</span>
                  </div>
                  <Progress value={cert.score} className="h-1.5" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < Math.round(cert.score / 20) ? "fill-warning text-warning" : "text-muted-foreground/20")} />
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Issued</p>
                    <p className="font-semibold">{formatDate(cert.issuedAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Code</p>
                    <p className="font-mono font-semibold text-primary">{cert.verificationCode}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/certificate/${cert.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + `/certificate/${cert.id}`);
                    toast({ variant: "success", title: "Link copied!" });
                  }}>
                    <Download className="h-3.5 w-3.5" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty upcoming slots */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended next</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: "Python Fundamentals", level: "beginner", category: "Technology" },
            { title: "Data Analysis Essentials", level: "intermediate", category: "Analytics" },
          ].map((r) => (
            <div key={r.title} className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border hover:border-primary/40 transition-colors group">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{r.level} · {r.category}</p>
              </div>
              <Button size="sm" variant="ghost" asChild className="shrink-0">
                <Link href="/assessment">Start <ChevronRight className="h-3.5 w-3.5 ml-1" /></Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Assessments tab ───────────────────────────────────────────────────────────

function AssessmentsTab() {
  const completed = MOCK_ASSESSMENTS.filter((a) => a.status === "completed");
  const available = MOCK_ASSESSMENTS.filter((a) => a.status === "available");

  return (
    <div className="space-y-6">
      {/* Completed */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">
          Completed assessments
          <span className="ml-2 text-sm text-muted-foreground font-sans font-normal">({completed.length})</span>
        </h3>
        <div className="space-y-3">
          {completed.map((a) => (
            <Card key={a.id} className={cn("border-l-4", a.passed ? "border-l-success" : "border-l-destructive")}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", a.passed ? "bg-success/10" : "bg-destructive/10")}>
                    {a.passed ? (
                      <Trophy className="h-5 w-5 text-success" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{a.title}</p>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize", getLevelBadgeClass(a.level))}>
                        {a.level}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Completed {a.completedAt ? formatDate(a.completedAt) : "–"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn("text-xl font-display font-bold", a.passed ? "text-success" : "text-destructive")}>
                      {a.score}%
                    </div>
                    <div className={cn("text-[10px] font-semibold", a.passed ? "text-success" : "text-destructive")}>
                      {a.passed ? "PASSED" : "FAILED"}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <Progress
                    value={a.score ?? 0}
                    className={cn("h-1.5", !a.passed && "[&>div]:bg-destructive")}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0%</span>
                    <span>Pass: 70%</span>
                    <span>100%</span>
                  </div>
                </div>

                {a.passed && (
                  <div className="mt-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/certificate/${a.id}`}>
                        <Award className="h-3.5 w-3.5" />
                        View certificate
                      </Link>
                    </Button>
                  </div>
                )}
                {!a.passed && (
                  <div className="mt-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/assessment/${a.id}`}>
                        <BarChart2 className="h-3.5 w-3.5" />
                        Retry assessment
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">
          Available to take
          <span className="ml-2 text-sm text-muted-foreground font-sans font-normal">({available.length})</span>
        </h3>
        <div className="space-y-3">
          {available.map((a) => (
            <Card key={a.id} className="card-hover border-dashed">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{a.title}</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize", getLevelBadgeClass(a.level))}>
                      {a.level}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Not started</p>
                </div>
                <Button size="sm" asChild className="shrink-0">
                  <Link href={`/assessment/${a.id}`}>
                    Start <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Activity tab ──────────────────────────────────────────────────────────────

function ActivityTab() {
  const iconMap: Record<string, React.ElementType> = {
    certificate: Trophy,
    assessment: BookOpen,
    profile: User,
  };
  const colorMap: Record<string, string> = {
    certificate: "bg-success/10 text-success",
    assessment: "bg-primary/10 text-primary",
    profile: "bg-accent/10 text-accent",
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display font-semibold text-lg">Activity timeline</h3>
        <p className="text-sm text-muted-foreground">Your recent actions on CareAble.</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-6">
          {MOCK_ACTIVITY.map((item) => {
            const Icon = iconMap[item.type] ?? Clock;
            return (
              <div key={item.id} className="flex gap-4 pl-0">
                <div className={cn("relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 border-background", colorMap[item.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 pb-2 pt-1.5">
                  <p className="text-sm font-medium">{item.text}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                    {item.score !== null && (
                      <span className={cn("text-xs font-semibold", item.score >= 70 ? "text-success" : "text-destructive")}>
                        Score: {item.score}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main profile page ─────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* ── Profile header ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-10 animate-fade-in">
          <div className="relative mb-4">
            <AvatarUploader name={user.name} avatar={user.avatar} />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-background" />
          </div>
          <h1 className="text-2xl font-display font-bold">{user.name}</h1>
          <p className="text-muted-foreground mt-1">{user.jobTitle ?? "Career seeker"}</p>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] capitalize">
              {user.role}
            </Badge>
            <Badge className="bg-success/10 text-success border-success/20 text-[10px]">
              ● Active
            </Badge>
          </div>
        </div>

        {/* ── Tab layout ──────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <aside className="lg:w-52 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all w-full text-left",
                    activeTab === id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tab content */}
          <div className="flex-1 min-w-0 animate-fade-in" key={activeTab}>
            {activeTab === "overview" && <OverviewTab user={user} />}
            {activeTab === "info" && <InfoTab user={user} updateUser={updateUser} />}
            {activeTab === "password" && <PasswordTab />}
            {activeTab === "certificates" && <CertificatesTab />}
            {activeTab === "assessments" && <AssessmentsTab />}
            {activeTab === "activity" && <ActivityTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
