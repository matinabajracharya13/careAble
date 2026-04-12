"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen, Award, TrendingUp, Clock, ChevronRight,
  ArrowRight, Zap, BarChart3, Users, Building2, Target,
  CheckCircle, AlertCircle, Star, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Progress, Separator } from "@/components/ui/ui-components";
import { assessmentApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn, getLevelBadgeClass } from "@/lib/utils";
import RadarHeatmap from '@/components/heatmap/RadarHeatmap';
import { MOCK_HEATMAP_DATA } from '@/constants/mockData';

// ── Career Dashboard ──────────────────────────────────────────────────────────
function CareerDashboard({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const { data: assessments, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: assessmentApi.getAssessments,
  });

  const stats = [
    { label: "Assessments taken", value: "2", icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
    { label: "Certificates earned", value: "1", icon: Award, color: "text-success", bg: "bg-success/10" },
    { label: "Avg. score", value: "87%", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: "Hours studied", value: "4.5", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  ];


  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span> 👋</h1>
          <p className="text-muted-foreground mt-1">Ready to prove your skills today?</p>
        </div>
        <Button asChild>
          <Link href="/assessment">
            <Zap className="h-4 w-4" />
            Take an assessment
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="card-hover">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", s.bg)}>
                <s.icon className={cn("h-5 w-5", s.color)} />
              </div>
              <div>
                <div className="text-2xl font-display font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">

          {/* Heatmap container*/}
          <div className=" mb-6">
            <RadarHeatmap data={MOCK_HEATMAP_DATA} />
          </div>

        {/* Available assessments */}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Available Assessments</h2>
            <Link href="/assessment" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-3">
              {assessments?.map((a) => (
                <Card key={a.id} className="card-hover">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm truncate">{a.title}</p>
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", getLevelBadgeClass(a.level))}>
                          {a.level}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.totalQuestions} questions · {a.duration} min · Pass: {a.passingScore}%</p>
                    </div>
                    <Button size="sm" variant="outline" asChild className="shrink-0">
                      <Link href={`/assessment/${a.id}`}>Start</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Profile completion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profile strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">65% complete</span>
                <span className="font-semibold text-primary">Good</span>
              </div>
              <Progress value={65} className="h-2" />
              <div className="space-y-2 text-xs text-muted-foreground">
                {[
                  { label: "Basic info", done: true },
                  { label: "Skills survey", done: true },
                  { label: "First assessment", done: false },
                  { label: "Profile photo", done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.done
                      ? <CheckCircle className="h-3 w-3 text-success" />
                      : <AlertCircle className="h-3 w-3 text-muted-foreground/50" />
                    }
                    <span className={item.done ? "line-through opacity-50" : ""}>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick tip */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-primary">Pro tip</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Candidates with 3+ certificates receive 4x more employer views. Take your next assessment now!
              </p>
              <Button size="sm" variant="default" asChild className="w-full mt-2">
                <Link href="/assessment">Browse assessments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Employer Dashboard ────────────────────────────────────────────────────────
function EmployerDashboard({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const stats = [
    { label: "Active job posts", value: "5", icon: Target, color: "text-primary", bg: "bg-primary/10" },
    { label: "Candidates reviewed", value: "48", icon: Users, color: "text-accent", bg: "bg-accent/10" },
    { label: "Assessments sent", value: "23", icon: BookOpen, color: "text-success", bg: "bg-success/10" },
    { label: "Hires this month", value: "3", icon: CheckCircle, color: "text-warning", bg: "bg-warning/10" },
  ];

  const pipeline = [
    { name: "Alex Johnson", role: "Frontend Dev", score: 92, status: "Pending interview" },
    { name: "Maria Santos", role: "Data Analyst", score: 88, status: "Assessment sent" },
    { name: "David Kim", role: "Product Manager", score: 76, status: "Under review" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">
            <span className="gradient-text">{user.company ?? "Your company"}</span> hub 🏢
          </h1>
          <p className="text-muted-foreground mt-1">Manage your talent pipeline.</p>
        </div>
        <Button asChild>
          <Link href="/employer">
            <Users className="h-4 w-4" />
            View talent pool
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="card-hover">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", s.bg)}>
                <s.icon className={cn("h-5 w-5", s.color)} />
              </div>
              <div>
                <div className="text-2xl font-display font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Candidate pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Candidate Pipeline</h2>
            <Link href="/employer" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {pipeline.map((c) => (
              <Card key={c.name} className="card-hover">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{c.score}%</div>
                    <div className="text-[10px] text-muted-foreground">{c.status}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Send assessment", href: "/assessment", icon: BookOpen },
                { label: "View talent pool", href: "/employer", icon: Users },
                { label: "Post a job", href: "#", icon: Building2 },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <a.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{a.label}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                <p className="text-sm font-semibold text-accent">Insight</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Candidates with CareAble certificates have a 40% higher retention rate at 12 months.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Router ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
    if (!isLoading && isAuthenticated && user && !user.onboardingCompleted) router.push("/onboarding");
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {user.role === "employer" ? (
          <EmployerDashboard user={user} />
        ) : (
          <CareerDashboard user={user} />
        )}
      </div>
    </div>
  );
}
