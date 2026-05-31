import { AppError } from '@/middleware/errorHandler';
import { ApiResponse } from '@/types';
import { NextFunction, Request, Response } from 'express';

import {
  createAssessmentAttempt,
  deleteAssessmentProgress,
  findAllAssessments,
  findAssessmentById,
  findOptionsByQuestionIds,
  findQuestionsByTopicIds,
  findTopicsByAssessment,
  getAllAttempt,
  getProgressByID,
  saveAssessmentResponses,
  saveProgress
} from '@/repositories/assessmentRepository';
import { generateCertificate } from '@/repositories/certificateRepository';
import { addDomainScore } from '@/repositories/domainRepository';
import { generateDomainScores } from '@/services/domain';
import { calculateOverallMean } from '@/utils/capability';
import { generateCompetencyScoresFromTopics, saveCompetencyScores } from '@/repositories/competancy';
import { activityService } from '@/services/activities';

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
      id: topic.assessment_topic_id,
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

    const assessment = await findAssessmentById(assessmentId);
    if (!assessment) {
      return next(new AppError('Assessment Not found', 404));
    }
    if (!answers || typeof answers !== 'object') {
      return next(new AppError('Invalid payload', 400));
    }

    const formattedResponses = Object.entries(answers).map(([questionId, answer]: any) => ({
      question_id: Number(questionId),
      selected_option_id: answer.optionId,
      numeric_value: answer.value,
      topic_id: Number(answer.topicId)
    }));

    // -------------------------------------------------
    // 1. Save responses
    // -------------------------------------------------
    await saveAssessmentResponses(attemptId, userId, assessmentId, formattedResponses);

    // -------------------------------------------------
    // 2. Build question -> topic map
    // -------------------------------------------------
    const questionTopicMap: Record<number, number> = {};

    Object.entries(answers).forEach(([questionId, answer]: [string, any]) => {
      questionTopicMap[Number(questionId)] = Number(answer.topicId);
    });

    // -------------------------------------------------
    // 3. Calculate topic scores
    // -------------------------------------------------
    const topicScores = generateDomainScores(answers, questionTopicMap);

    await addDomainScore(attemptId, topicScores);

    // -------------------------------------------------
    // 4. Calculate competency scores
    // -------------------------------------------------
    const competencyScores = await generateCompetencyScoresFromTopics(topicScores);

    // -------------------------------------------------
    // 5. Save competency scores
    // -------------------------------------------------
    await saveCompetencyScores(attemptId, competencyScores);

    // -------------------------------------------------
    // 6. Generate certificate
    // -------------------------------------------------
    const overallScore = calculateOverallMean(competencyScores);

    const certificate = await generateCertificate(attemptId, assessmentId, userId);

    certificate.overall_mean_score = overallScore;

    // -------------------------------------------------
    // 7. Cleanup progress
    // -------------------------------------------------
    await deleteAssessmentProgress(userId, assessmentId, attemptId);
    await activityService.assessment.completed({
      userId,
      assessmentId,
      attemptId,
      score: overallScore
    });
    await activityService.certificate.issued({
      userId,
      assessmentTitle: assessment.title,
      certificateId: certificate.certificate_id
    });

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
    console.log(error);
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
