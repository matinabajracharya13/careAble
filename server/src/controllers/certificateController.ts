import { AppError } from '@/middleware/errorHandler';
import { findCertificateByCode, findCertificatesByUserId } from '@/repositories/certificateRepository';
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
    console.log(certificates);
    res.json(response);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    next(new AppError('Failed to fetch certificates', 500));
  }
};
