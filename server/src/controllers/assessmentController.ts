import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

import {
  findAllAssessments,
  findAssessmentById,
  findOptionsByQuestionIds,
  findQuestionsByTopicIds,
  findTopicsByAssessment,
  getAllProgress,
  getProgressByID,
  saveProgress,
  createAttempt,
  saveResponses,
  saveDomainScores,
  completeAttempt
} from '../repositories/assessmentRepository';
import { createCertificate } from '../repositories/certificateRepository';

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

// SUBMIT ASSESSMENT
export const submitAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assessmentId = Number(req.params.id);

    // ⚠️ Replace with authenticated user later
    const userId = 1;

    const { answers } = req.body as { answers: Record<string, string> };

    if (!answers || typeof answers !== 'object') {
      return next(new AppError('Answers are required', 400));
    }

    // 1. Create attempt
    const attemptId = await createAttempt(userId, assessmentId);

    // 2. Save raw responses
    const responsePayload = Object.entries(answers).map(([questionId, value]) => ({
      questionId: Number(questionId),
      numericValue: Number(value)
    }));
    await saveResponses(attemptId, responsePayload);

    // 3. Calculate domain scores
    const topics = await findTopicsByAssessment(assessmentId);
    const questions = await findQuestionsByTopicIds(topics.map((t) => t.assessment_topic_id));

    const domainScores = topics.map((topic) => {
      const topicQuestions = questions.filter(
        (q) => q.assessment_topic_id === topic.assessment_topic_id
      );
      const values = topicQuestions.map((q) => Number(answers[q.assessment_question_id]) || 3);
      const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
      const rounded = Math.round(mean * 10) / 10;

      let capabilityLevel: string;
      if (rounded >= 4.0) capabilityLevel = 'Strength area';
      else if (rounded >= 3.0) capabilityLevel = 'Growth area';
      else capabilityLevel = 'Support area';

      return { attemptId, assessmentId, topicId: topic.assessment_topic_id, score: rounded, capabilityLevel };
    });

    await saveDomainScores(domainScores);

    // 4. Mark attempt complete
    await completeAttempt(attemptId);

    // 5. Generate certificate
    const { certificate_id, certificate_code } = await createCertificate(attemptId);

    const response: ApiResponse = {
      success: true,
      message: 'Assessment submitted successfully',
      data: { certificateId: certificate_id, certificateCode: certificate_code }
    };

    res.status(201).json(response);
  } catch (err) {
    next(new AppError('Failed to submit assessment', 500));
  }
};
