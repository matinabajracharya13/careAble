import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/middleware/errorHandler';
import { ApiResponse } from '@/types';

import {
  createAssessmentAttempt,
  findAllAssessments,
  findAssessmentById,
  findOptionsByQuestionIds,
  findQuestionsByTopicIds,
  findTopicsByAssessment,
  getAllAttempt,
  getProgressByID,
  processAssessmentResult,
  saveAssessmentResponses,
  saveProgress
} from '@/repositories/assessmentRepository';
import { getCertificateByAttemptId } from '@/repositories/certificateRepository';

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
    const attemptId = Number(req.params.attemptId);
    const userId = (req as any).user?.user_id;

    const { answers, currentTopicIndex, currentPage } = req.body;

    await saveProgress(userId, assessmentId, attemptId, {
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
    console.log(err);
    next(new AppError('Failed to save progress', 500));
  }
};

export const getUserAssessmentAttempt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // replace later with req.user.userId
    const userId = (req as any).user?.user_id;

    const progress = await getAllAttempt(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Assessment progress fetched successfully',
      data: progress
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    next(new AppError('Failed to fetch assessment progress', 500));
  }
};

export const getUserAssessmentAttemptID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;
    const attemptId = Number(req.params.attemptId);
    const assessmentId = Number(req.params.id);

    const progress = await getProgressByID(userId, assessmentId, attemptId);
    if (!progress) {
      return res.status(200).json({
        success: true,
        message: 'No progress found',
        data: null
      });
    }
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

export const submitAssessmentResponses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;
    const attemptId = Number(req.params.attemptId);
    const assessmentId = Number(req.params.id);

    const { answers } = req.body;

    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!answers || typeof answers !== 'object') {
      return next(new AppError('Invalid payload', 400));
    }

    const formattedResponses = Object.entries(answers).map(([questionId, answer]: any) => ({
      question_id: Number(questionId),
      selected_option_id: answer.optionId,
      numeric_value: answer.value
    }));

    await saveAssessmentResponses(attemptId, userId, assessmentId, formattedResponses);
    const result = await processAssessmentResult(attemptId, assessmentId,userId);

    // 4. fetch certificate (if generated)
    const certificate = await getCertificateByAttemptId(attemptId);

    return res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        attemptId,
        assessmentId,
        certificate: certificate || null
      }
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const startAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assessmentId = Number(req.params.id);
    const assessment = await findAssessmentById(assessmentId);
    if (!assessment) return next(new AppError('Assessment not found', 404));

    const userId = (req as any).user?.user_id;

    const attempt = await createAssessmentAttempt(assessmentId, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Assessment started successfully',
      data: attempt
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    next(new AppError('Failed to start assessment', 500));
  }
};
