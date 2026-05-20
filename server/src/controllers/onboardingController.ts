import { Request, Response, NextFunction } from "express";
import { AppError } from "@/middleware/errorHandler";
import {
  getAllOnboardingQuestions,
  insertOnboardingAnswers,
  updateOnboardingCompletionStatus,
} from "@/repositories/onboardingRepository";
import { OnboardingAnswer } from "@/types";

export const getOnboardingQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rows = await getAllOnboardingQuestions();

    const categoryMap = new Map<string, any>();

    rows.forEach((row: any) => {
      const categoryId = `cat${row.category_id}`;
      const questionId = row.question_id;

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          id: categoryId,
          title: row.title,
          description: row.description,
          icon: row.icon,
          questions: [],
        });
      }

      const category = categoryMap.get(categoryId);

      if (!row.question_id) return;

      let question = category.questions.find((q: any) => q.id === questionId);

      if (!question) {
        question = {
          id: questionId,
          category: categoryId,
          question: row.question_text,
          type: row.input_type,
          options: [],
          required: Boolean(row.is_required),
        };

        category.questions.push(question);
      }

      if (row.option_text) {
        question.options.push({
          label: row.option_text,
          value: row.option_value,
        });
      }
    });

    res.status(200).json({
      success: true,
      message: "Onboarding questions fetched successfully",
      data: Array.from(categoryMap.values()),
    });
  } catch (error) {
    next(error);
  }
};

export const completeOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.user_id;
    const answers = req.body
  
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const formattedAnswers: OnboardingAnswer[] = Object.entries(answers).map(
      ([questionId, answer]) => ({
        question_id: Number(questionId),
        answer: Array.isArray(answer) ? answer.join(",") : String(answer) as OnboardingAnswer["answer"],
      }),
    );

    const result = await insertOnboardingAnswers(userId, formattedAnswers);
    if (!result) {
      return next(new AppError("Failed to save onboarding answers", 500));
    }
    await updateOnboardingCompletionStatus(userId, true);

    res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    next(error);
  }
};
