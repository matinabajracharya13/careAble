import { AppError } from '@/middleware/errorHandler';
import { findCertificateByCode, findCertificatesByUserId, verifyCertificate } from '@/repositories/certificateRepository';
import { ApiResponse } from '@/types';
import { Certificate } from '@/types';
import { NextFunction, Request, Response } from 'express';

export const getCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;
    const certificates = await findCertificatesByUserId(userId);

    const response: ApiResponse<Certificate[]> = {
      success: true,
      message: 'Certificate fetched successfully',
      data: certificates || []
    };
    res.json(response);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    next(new AppError('Failed to fetch certificates', 500));
  }
};

export const getCertificateByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;
    const code = req.params.code as string;
    const certificates = await findCertificateByCode(code, userId);

    const response: ApiResponse<Certificate> = {
      success: true,
      message: 'Certificate fetched successfully',
      data: certificates || null
    };
    res.json(response);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    next(new AppError('Failed to fetch certificates', 500));
  }
};

export const checkCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.params.code as string;

    const certificate = await verifyCertificate(code);
    console.log(certificate);

    const response: ApiResponse<any> = {
      success: true,
      message: certificate ? 'Certificate fetched successfully' : 'Invalid certificate',
      data: certificate
        ? {
            valid: true,
            ...certificate
          }
        : {
            valid: false
          }
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching certificates:', err);

    next(new AppError('Failed to fetch certificates', 500));
  }
};
