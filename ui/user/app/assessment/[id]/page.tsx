"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/ui-components";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { assessmentApi } from "@/lib/api";
import { Assessment, AssessmentTopic } from "@/types";

const QUESTIONS_PER_PAGE = 5;

const scaleLabels = {
  1: "Never / Not at all true",
  2: "Rarely true",
  3: "Sometimes true",
  4: "Often true",
  5: "Always / Consistently true",
};

export default function TopicStepperAssessment() {
  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", 1],
    queryFn: () => assessmentApi.getAssessment("1"),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      assessmentApi.saveProgress("1", {
        answers,
        currentTopicIndex,
        currentPage,
      }),
    onSuccess: () => {
      toast({
        title: "Progress saved",
        description: "You can continue later.",
      });
    },
  });

  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentTopic = assessment?.topics[currentTopicIndex];

  // total pages in current topic
  const totalPages = Math.ceil(
    (currentTopic?.questions?.length ?? 0) / QUESTIONS_PER_PAGE,
  );
  // slice questions for current page
  const visibleQuestions = currentTopic?.questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE,
  );

  // default answers = 3
  useEffect(() => {
    const defaults: Record<string, string> = {};
    assessment?.topics.forEach((t) => {
      t.questions.forEach((q) => {
        defaults[q.id] = "3";
      });
    });
    setAnswers(defaults);
  }, []);

  const handleChange = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  // ── Navigation ─────────────────────────────────────────

  const next = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    } else if (
      currentTopicIndex <
      (assessment as Assessment)?.topics?.length - 1
    ) {
      setCurrentTopicIndex((t) => t + 1);
      setCurrentPage(0);
    }
  };

  const prev = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else if (currentTopicIndex > 0) {
      const prevTopicIndex = currentTopicIndex - 1;
      const prevTopic = assessment?.topics[prevTopicIndex];
      const questionCount = prevTopic?.questions?.length ?? 0;
      const lastPage = Math.ceil(questionCount / QUESTIONS_PER_PAGE) - 1;

      setCurrentTopicIndex(prevTopicIndex);
      setCurrentPage(lastPage);
    }
  };

  const isLastStep =
    currentTopicIndex === (assessment as Assessment)?.topics?.length - 1 &&
    currentPage === totalPages - 1;

  const handleSubmit = () => {
    console.log("Answers:", answers);
    toast({
      title: "Assessment submitted",
      description: "Your responses have been saved.",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <Badge>{assessment?.category}</Badge>
          <h1 className="text-3xl font-bold">{assessment?.title}</h1>
          <p className="text-muted-foreground">{assessment?.description}</p>
        </div>

        {/* PROGRESS */}
        <div className="text-sm text-muted-foreground text-center">
          Topic {currentTopicIndex + 1} of {assessment?.topics.length} · Page{" "}
          {currentPage + 1} of {totalPages}
        </div>

        {/* CARD */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">{currentTopic?.title}</h2>

            {visibleQuestions?.map((q, idx) => {
              const selected = answers[q.id];

              return (
                <div key={q.id} className="space-y-3">
                  <p className="font-medium">
                    {idx + 1 + currentPage * QUESTIONS_PER_PAGE}. {q.text}
                  </p>

                  {/* SLIDER */}
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={selected}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-full accent-primary"
                  />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>

                  <div className="grid grid-cols-5 text-[10px] text-center text-muted-foreground">
                    <span>Never</span>
                    <span>Rarely</span>
                    <span>Sometimes</span>
                    <span>Often</span>
                    <span>Always</span>
                  </div>

                  <div className="text-sm text-primary text-center">
                    {
                      scaleLabels[
                        selected as unknown as keyof typeof scaleLabels
                      ]
                    }
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* NAV */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {!isLastStep ? (
            <Button onClick={next}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4" />
              Submit
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving..." : "Save Progress"}
          </Button>
        </div>
      </div>
    </div>
  );
}
