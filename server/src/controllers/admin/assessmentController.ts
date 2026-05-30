// controllers/admin/assessment.controller.ts

import {
  findAllAssessments,
  findQuestionsByTopicId,
  findQuestionsByTopicIds,
  findTopicsByAssessment,
  inserAssessmentTopic,
  insertAssessment,
  saveAssessmentQuestions
} from '@/repositories/assessmentRepository';
import { normalizeQuestions } from '@/utils/assessment';
import { NextFunction, Request, Response } from 'express';

export const getAllAssessments = async (req: Request, res: Response) => {
  try {
    const assessments = await findAllAssessments();

    return res.status(200).json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment topics'
    });
  }
};

export const createAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, domain, description, version } = req.body;

    const [assessmentId] = await insertAssessment({ title, domain, description, version });

    res.status(201).json({ success: true, message: 'Assessment created successfully', data: { assessment_id: assessmentId } });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// GET ASSESSMENT TOPICS
// ======================================================

export const getAssessmentTopics = async (req: Request, res: Response) => {
  try {
    const assessmentId = Number(req.params.assessmentId);

    const topics = await findTopicsByAssessment(assessmentId);

    return res.status(200).json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment topics'
    });
  }
};

export const getAssessmentQuestionTopicByID = async (req: Request, res: Response) => {
  try {
    const topicId = Number(req.params.topicId);

    const questions = await findQuestionsByTopicId(Number(topicId));
    console.log(questions, 'question');
    return res.status(200).json({
      success: true,
      data: normalizeQuestions(questions)
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment topics'
    });
  }
};

export const createAssessmentTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assessmentId = Number(req.params.assessmentId);
    const { title, code } = req.body;

    const topicId = await inserAssessmentTopic({ title, assessment_id: assessmentId, code });

    res.status(201).json({ success: true, message: 'Assessment Topic created successfully', data: { topic_id: topicId } });
  } catch (err) {
    next(err);
  }
};

// ======================================================
// SAVE QUESTIONS
// ======================================================

export const saveQuestionsController = async (req: Request, res: Response) => {
  try {
    const { assessment_topic_id, questions, assessment_id } = req.body;

    if (!assessment_topic_id) {
      return res.status(400).json({
        success: false,
        message: 'assessment_topic_id is required'
      });
    }

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'questions must be an array'
      });
    }

    await saveAssessmentQuestions(Number(assessment_topic_id), questions, Number(assessment_id));

    return res.status(200).json({
      success: true,
      message: 'Questions saved successfully'
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to save questions'
    });
  }
};
