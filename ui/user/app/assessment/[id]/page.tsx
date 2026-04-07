"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Clock, ChevronLeft, ChevronRight, Send, CheckCircle,
  XCircle, AlertTriangle, Trophy, Loader2, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Progress, Badge } from "@/components/ui/ui-components";
import { toast } from "@/components/ui/toast";
import { assessmentApi } from "@/lib/api";
import { cn, formatScore } from "@/lib/utils";
import type { AssessmentResult } from "@/types";
import Link from "next/link";

// ── Timer ─────────────────────────────────────────────────────────────────────
function useTimer(durationMinutes: number) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, timeLeft]);

  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);

  const format = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return { timeLeft, running, start, stop, format };
}

// ── Intro screen ──────────────────────────────────────────────────────────────
function AssessmentIntro({ assessment, onStart }: { assessment: any; onStart: () => void }) {
  return (
    <div className="max-w-xl mx-auto text-center space-y-6 animate-fade-in">
      <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
        <Trophy className="h-10 w-10 text-primary" />
      </div>
      <div>
        <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">{assessment.category}</Badge>
        <h1 className="text-3xl font-display font-bold mb-2">{assessment.title}</h1>
        <p className="text-muted-foreground">{assessment.description}</p>
      </div>

      <Card>
        <CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Questions", value: assessment.totalQuestions },
            { label: "Time limit", value: `${assessment.duration} min` },
            { label: "Pass score", value: `${assessment.passingScore}%` },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-display font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground space-y-1 text-left bg-secondary/50 rounded-xl p-4">
        <p className="font-semibold text-foreground mb-2">Before you begin:</p>
        <p>• Find a quiet place with no distractions</p>
        <p>• Answers cannot be changed after submission</p>
        <p>• The timer starts when you click "Begin"</p>
        <p>• You'll see detailed results immediately after</p>
      </div>

      <Button size="xl" onClick={onStart} className="w-full">
        Begin assessment
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────
function AssessmentResults({ result, assessment }: { result: AssessmentResult; assessment: any }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
      {/* Score card */}
      <Card className={cn("border-2", result.passed ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5")}>
        <CardContent className="p-8 text-center space-y-4">
          <div className={cn("h-20 w-20 rounded-full mx-auto flex items-center justify-center", result.passed ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground")}>
            {result.passed
              ? <Trophy className="h-10 w-10" />
              : <AlertTriangle className="h-10 w-10" />
            }
          </div>
          <div>
            <h2 className="text-4xl font-display font-bold mb-1">{formatScore(result.score)}</h2>
            <p className={cn("text-lg font-semibold", result.passed ? "text-success" : "text-destructive")}>
              {result.passed ? "Congratulations! You passed! 🎉" : "You didn't pass this time"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Required: {assessment.passingScore}% · Your score: {result.score}%
            </p>
          </div>
          {result.passed && (
            <Button asChild variant="success">
              <Link href={`/certificate/${result.certificateId}`}>
                <Trophy className="h-4 w-4" />
                View your certificate
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Answer review */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">Review your answers</h3>
        <div className="space-y-4">
          {assessment.questions.map((q: any, i: number) => {
            const ans = result.answers.find((a: any) => a.questionId === q.id);
            const selectedOpt = q.options.find((o: any) => o.value === ans?.selectedAnswer);
            const correctOpt = q.options.find((o: any) => o.value === q.correctAnswer);
            return (
              <Card key={q.id} className={cn("border-l-4", ans?.correct ? "border-l-success" : "border-l-destructive")}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start gap-2">
                    {ans?.correct
                      ? <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      : <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    }
                    <p className="text-sm font-medium">{q.text}</p>
                  </div>
                  <div className="ml-7 space-y-1 text-xs">
                    <p className="text-muted-foreground">
                      Your answer: <span className={ans?.correct ? "text-success font-medium" : "text-destructive font-medium"}>
                        {selectedOpt?.label ?? "Not answered"}
                      </span>
                    </p>
                    {!ans?.correct && (
                      <p className="text-muted-foreground">
                        Correct answer: <span className="text-success font-medium">{correctOpt?.label}</span>
                      </p>
                    )}
                    {q.explanation && (
                      <p className="mt-2 bg-secondary/50 rounded-lg p-2 text-muted-foreground italic">{q.explanation}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild className="flex-1">
          <Link href="/assessment">
            <RotateCcw className="h-4 w-4" />
            Try another
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const params = useParams();
  const assessmentId = params.id as string;

  const [phase, setPhase] = useState<"intro" | "taking" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => assessmentApi.getAssessment(assessmentId),
  });

  const { timeLeft, running, start, stop, format } = useTimer(assessment?.duration ?? 30);

  const submitMutation = useMutation({
    mutationFn: () => assessmentApi.submitAssessment(assessmentId, answers),
    onSuccess: (data) => {
      stop();
      setResult(data);
      setPhase("results");
      toast({
        variant: data.passed ? "success" : "destructive",
        title: data.passed ? "Assessment passed!" : "Assessment completed",
        description: `You scored ${data.score}%`,
      });
    },
  });

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && phase === "taking") {
      toast({ variant: "destructive", title: "Time's up!", description: "Submitting your answers…" });
      submitMutation.mutate();
    }
  }, [timeLeft, phase]);

  const handleStart = () => {
    setPhase("taking");
    start();
  };

  const selectAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment) return null;

  const progress = ((currentQ + 1) / assessment.questions.length) * 100;
  const currentQuestion = assessment.questions[currentQ];
  const selectedAnswer = answers[currentQuestion?.id];
  const allAnswered = assessment.questions.every((q) => answers[q.id]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Taking phase: timer bar */}
        {phase === "taking" && (
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Question {currentQ + 1} of {assessment.questions.length}
              </span>
              <span className={cn("flex items-center gap-1.5 text-sm font-mono font-semibold", timeLeft < 120 ? "text-destructive" : "text-foreground")}>
                <Clock className="h-4 w-4" />
                {format(timeLeft)}
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {phase === "intro" && <AssessmentIntro assessment={assessment} onStart={handleStart} />}

        {phase === "taking" && currentQuestion && (
          <div className="animate-fade-in">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {currentQ + 1}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                      {currentQuestion.type.replace("_", " ")} · {currentQuestion.points} pts
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{currentQuestion.text}</h3>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectAnswer(currentQuestion.id, opt.value)}
                      className={cn(
                        "w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all text-sm",
                        selectedAnswer === opt.value
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-muted-foreground/40"
                      )}
                    >
                      <span className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold", selectedAnswer === opt.value ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 text-muted-foreground")}>
                        {["A", "B", "C", "D"][currentQuestion.options.indexOf(opt)]}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Nav */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Button variant="outline" onClick={() => setCurrentQ((q) => q - 1)} disabled={currentQ === 0}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {currentQ < assessment.questions.length - 1 ? (
                      <Button onClick={() => setCurrentQ((q) => q + 1)} disabled={!selectedAnswer}>
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="gradient"
                        onClick={() => submitMutation.mutate()}
                        loading={submitMutation.isPending}
                        disabled={!allAnswered}
                      >
                        <Send className="h-4 w-4" />
                        Submit assessment
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question navigation dots */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {assessment.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={cn(
                    "h-7 w-7 rounded-full text-xs font-semibold transition-all",
                    i === currentQ ? "bg-primary text-primary-foreground" :
                    answers[q.id] ? "bg-success/20 text-success border border-success/30" :
                    "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "results" && result && (
          <AssessmentResults result={result} assessment={assessment} />
        )}
      </div>
    </div>
  );
}
