"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ChevronLeft, ChevronRight, CheckCircle, Loader2,
  Briefcase, Zap, Target, Users, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea, Card, CardContent, CardHeader, CardTitle, CardDescription, Progress, Badge } from "@/components/ui/ui-components";
import { toast } from "@/components/ui/toast";
import { onboardingApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { OnboardingCategory, OnboardingQuestion, OnboardingResponse } from "@/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase, Zap, Target, Users, Building2,
};

// ── Question renderers ────────────────────────────────────────────────────────
function QuestionField({
  question,
  value,
  onChange,
}: {
  question: OnboardingQuestion;
  value: string | string[] | number | undefined;
  onChange: (val: string | string[] | number) => void;
}) {
  switch (question.type) {
    case "text":
      return (
        <Input
          placeholder={question.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "textarea":
      return (
        <Textarea
          placeholder={question.placeholder}
          rows={4}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "radio":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options?.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all text-sm",
                value === opt.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:border-muted-foreground/40 text-muted-foreground"
              )}
            >
              <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", value === opt.value ? "border-primary" : "border-muted-foreground/40")}>
                {value === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
      );

    case "multiselect":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {question.options?.map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const current = Array.isArray(value) ? value : [];
                  onChange(selected ? current.filter((v) => v !== opt.value) : [...current, opt.value]);
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all text-sm",
                  selected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:border-muted-foreground/40 text-muted-foreground"
                )}
              >
                <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center shrink-0", selected ? "border-primary bg-primary" : "border-muted-foreground/40")}>
                  {selected && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                </div>
                {opt.label}
              </button>
            );
          })}
        </div>
      );

    case "select":
      return (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          <option value="" disabled>Select an option…</option>
          {question.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );

    case "range":
      const numVal = typeof value === "number" ? value : (question.min ?? 1);
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{question.min ?? 1}</span>
            <span className="font-bold text-primary text-base">{numVal}</span>
            <span>{question.max ?? 10}</span>
          </div>
          <input
            type="range"
            min={question.min ?? 1}
            max={question.max ?? 10}
            value={numVal}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 rounded-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({});

  const { data: categories, isLoading } = useQuery({
    queryKey: ["onboarding-categories", user?.role],
    queryFn: () => onboardingApi.getCategories(user?.role ?? "career"),
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: onboardingApi.submitResponses,
    onSuccess: () => {
      updateUser({ onboardingCompleted: true });
      toast({ variant: "success", title: "Profile complete!", description: "Taking you to your dashboard..." });
      setTimeout(() => router.push("/dashboard"), 1000);
    },
    onError: () => {
      toast({ variant: "destructive", title: "Failed to save", description: "Please try again." });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your personalised questionnaire…</p>
        </div>
      </div>
    );
  }

  if (!categories?.length) return null;

  const totalCategories = categories.length;
  const currentCategory = categories[currentCategoryIndex];
  const Icon = ICON_MAP[currentCategory.icon] ?? Briefcase;
  const progress = ((currentCategoryIndex) / totalCategories) * 100;

  const isLastCategory = currentCategoryIndex === totalCategories - 1;

  const allQuestionsAnswered = currentCategory.questions
    .filter((q) => q.required)
    .every((q) => {
      const val = responses[q.id];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== "";
    });

  const handleNext = () => {
    if (!allQuestionsAnswered) {
      toast({ variant: "destructive", title: "Please answer all required questions" });
      return;
    }
    if (isLastCategory) {
      submitMutation.mutate(responses);
    } else {
      setCurrentCategoryIndex((i) => i + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20 pb-10">
      <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />

      <div className="container max-w-2xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center space-y-2 animate-fade-in">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Step {currentCategoryIndex + 1} of {totalCategories}
          </Badge>
          <h1 className="text-3xl font-display font-bold">Let's set up your profile</h1>
          <p className="text-muted-foreground text-sm">
            Help us personalise your experience. This takes about 3 minutes.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {categories.map((cat, i) => (
              <div key={cat.id} className={cn("text-[10px] font-medium transition-colors", i <= currentCategoryIndex ? "text-primary" : "text-muted-foreground/50")}>
                {i < currentCategoryIndex ? <CheckCircle className="h-3 w-3 text-success inline" /> : `${i + 1}`}
              </div>
            ))}
          </div>
        </div>

        {/* Category card */}
        <Card variant="elevated" className="animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{currentCategory.title}</CardTitle>
                <CardDescription>{currentCategory.description}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {currentCategory.questions.map((question, qi) => (
              <div key={question.id} className="space-y-3 animate-fade-in" style={{ animationDelay: `${qi * 0.05}s` }}>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                    {qi + 1}
                  </span>
                  <label className="text-sm font-medium">
                    {question.question}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                </div>
                <QuestionField
                  question={question}
                  value={responses[question.id]}
                  onChange={(val) => setResponses((prev) => ({ ...prev, [question.id]: val }))}
                />
              </div>
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setCurrentCategoryIndex((i) => i - 1)}
                disabled={currentCategoryIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                loading={submitMutation.isPending}
                disabled={!allQuestionsAnswered}
              >
                {isLastCategory ? "Complete setup" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          You can update these details anytime from your profile settings.
        </p>
      </div>
    </div>
  );
}
