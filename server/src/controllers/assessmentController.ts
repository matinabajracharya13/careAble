import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/middleware/errorHandler';
import { ApiResponse } from '@/types';

import {
  findAllAssessments,
  findAssessmentById,
  findOptionsByQuestionIds,
  findQuestionsByTopicIds,
  findTopicsByAssessment,
  getAllProgress,
  getProgressByID,
  saveAssessmentResponses,
  saveProgress
} from '@/repositories/assessmentRepository';

// GET ALL
export const getAssessments = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await findAllAssessments();

    const response: ApiResponse = {
      success: true,
      message: 'Assessments fetched successfully',
      data
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    next(new AppError('Failed to fetch assessments', 500));
  }
};

// GET ONE (NESTED)
export const getAssessmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const assessment = await findAssessmentById(id);
    if (!assessment) return next(new AppError('Assessment not found', 404));

    const topics = await findTopicsByAssessment(id);
    const questions = await findQuestionsByTopicIds(topics.map((t) => t.assessment_topic_id));
    const options = await findOptionsByQuestionIds(questions.map((q) => q.assessment_question_id));

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
              value: o.numeric_value ?? o.option_value
            }))
        }))
    }));

    const response: ApiResponse = {
      success: true,
      message: 'Assessment fetched successfully',
      data: {
        id: assessment.assessment_id,
        title: assessment.title,
        category: assessment.domain,
        description: assessment.description,
        totalQuestions: questions.length,
        topics: formattedTopics
      }
    };

    res.json(response);
  } catch {
    next(new AppError('Failed to fetch assessment', 500));
  }
};

export const saveAssessmentProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assessmentId = Number(req.params.id);

    // ⚠️ Replace with authenticated user later
    const userId = 1;

    const { answers, currentTopicIndex, currentPage } = req.body;

    await saveProgress(userId, assessmentId, {
      answers,
      currentTopicIndex,
      currentPage
    });

    const response: ApiResponse = {
      success: true,
      message: 'Progress saved successfully'
    };

    res.status(200).json(response);
  } catch (err) {
    next(new AppError('Failed to save progress', 500));
  }
};

export const getUserAssessmentProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // replace later with req.user.userId
    const userId = 1;

    const progress = await getAllProgress(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Assessment progress fetched successfully',
      data: progress
    };

    res.status(200).json(response);
  } catch (err) {
    next(new AppError('Failed to fetch assessment progress', 500));
  }
};

export const getUserAssessmentProgressByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // replace later with req.user.userId
    const userId = 1;
    const progressId = Number(req.params.id);

    const progress = await getProgressByID(userId, progressId);

    const response: ApiResponse = {
      success: true,
      message: 'Assessment progress fetched successfully',
      data: progress
    };

    res.status(200).json(response);
  } catch (err) {
    next(new AppError('Failed to fetch assessment progress', 500));
  }
};

export const submitAssessmentResponses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.user_id;
    const { attempt_id, responses } = req.body;

    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }
    console.log(req.body)
    res.status(400).json({})

    if ( !responses || !Array.isArray(responses)) {
      return next(
        new AppError('Attempt ID and assessment responses are required', 400)
      );
    }


    /*
      Expected format:
      {
        attempt_id: 1,
        responses: {
          "1": 3,
          "2": 4,
          "3": 2
        }
      }
    */

    const formattedResponses = Object.entries(responses).map(
      ([questionId, answer]) => ({
        question_id: Number(questionId),
        answer: Number(answer)
      })
    );

    await saveAssessmentResponses(attempt_id, formattedResponses);

    res.status(201).json({
      success: true,
      message: 'Assessment responses submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};
