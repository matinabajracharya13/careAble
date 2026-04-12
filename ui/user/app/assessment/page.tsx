"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Target, ChevronRight, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, Badge } from "@/components/ui/ui-components";
import { assessmentApi } from "@/lib/api";
import { cn, getLevelBadgeClass } from "@/lib/utils";

export default function AssessmentListPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: assessmentApi.getAssessments,
  });

  const filtered = assessments?.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || a.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-10 space-y-2 animate-fade-in">
          <Badge className="bg-primary/10 text-primary border-primary/20">Skill assessments</Badge>
          <h1 className="text-4xl font-display font-bold">Choose your assessment</h1>
          <p className="text-muted-foreground max-w-xl">
            Each assessment is designed by industry experts. Pass to earn a verified certificate.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Input
            placeholder="Search by title or category…"
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            {["all", "beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  levelFilter === level
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered?.map((a, i) => (
              <Card key={a.id} className={cn("card-hover animate-fade-in")} style={{ animationDelay: `${i * 0.07}s` }}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border capitalize", getLevelBadgeClass(a.level))}>
                      {a.level}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-semibold text-lg">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {a.totalQuestions} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {a.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3.5 w-3.5" />
                      Pass: {a.passingScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">{a.category}</span>
                    <Button size="sm" asChild>
                      <Link href={`/assessment/${a.id}`}>
                        Start assessment
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filtered?.length === 0 && !isLoading && (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-semibold">No assessments found</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
