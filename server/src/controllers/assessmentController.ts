import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";
import { ApiResponse } from "../types";

import {
  findAllAssessments,
  findAssessmentById,
  insertAssessment,
  updateAssessmentById,
  deleteAssessmentById,
  findTopicsByAssessment,
  findQuestionsByTopicIds,
  findOptionsByQuestionIds,
} from "../repositories/assessmentRepository";

// GET ALL
export const getAssessments = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await findAllAssessments();

    const response: ApiResponse = {
      success: true,
      message: "Assessments fetched successfully",
      data,
    };

    res.json(response);
  } catch (error){
    console.log(error)
    next(new AppError("Failed to fetch assessments", 500));
  }
};

// GET ONE (NESTED)
export const getAssessmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const assessment = await findAssessmentById(id);
    if (!assessment) return next(new AppError("Assessment not found", 404));

    const topics = await findTopicsByAssessment(id);
    const questions = await findQuestionsByTopicIds(
      topics.map((t) => t.assessment_topic_id)
    );
    const options = await findOptionsByQuestionIds(
      questions.map((q) => q.assessment_question_id)
    );

    const formattedTopics = topics.map((topic) => ({
      id: topic.code,
      title: topic.title,
      questions: questions
        .filter((q) => q.assessment_topic_id === topic.assessment_topic_id)
        .map((q) => ({
          id: q.assessment_question_id,
          text: q.question_text,
          type: q.question_type,
          options: options
            .filter((o) => o.assessment_question_id === q.assessment_question_id)
            .map((o) => ({
              id: o.assessment_question_options_id,
              label: o.option_label,
              value: o.numeric_value ?? o.option_value,
            })),
        })),
    }));

    const response: ApiResponse = {
      success: true,
      message: "Assessment fetched successfully",
      data: {
        id: assessment.assessment_id,
        title: assessment.title,
        category: assessment.domain,
        description: assessment.description,
        totalQuestions: questions.length,
        topics: formattedTopics,
      },
    };

    res.json(response);
  } catch {
    next(new AppError("Failed to fetch assessment", 500));
  }
};