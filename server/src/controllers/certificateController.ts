import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { findCertificateById } from '../repositories/certificateRepository';

export const getCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certId = Number(req.params.id);

    if (isNaN(certId)) return next(new AppError('Invalid certificate ID', 400));

    const cert = await findCertificateById(certId);

    if (!cert) return next(new AppError('Certificate not found', 404));

    const topAreas = cert.domainScores
      .filter((d: any) => d.score >= 4.0)
      .map((d: any) => ({ name: d.domain_name, score: d.score }));

    const response: ApiResponse = {
      success: true,
      message: 'Certificate fetched successfully',
      data: {
        id: cert.certificate_id,
        verificationCode: cert.certificate_code,
        issuedAt: cert.issued_at,
        userName: cert.full_name,
        email: cert.email,
        assessmentTitle: cert.assessment_title,
        category: cert.domain,
        issuerName: 'CareAble Academy',
        domains: cert.domainScores.map((d: any) => ({
          name: d.domain_name,
          score: d.score,
          capabilityLevel: d.capability_level
        })),
        topAreas
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(new AppError('Failed to fetch certificate', 500));
  }
};
