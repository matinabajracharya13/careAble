import { Request, Response } from 'express'
import { ApiResponse } from '../types'

export const healthCheck = (_req: Request, res: Response): void => {
  const response: ApiResponse<{ uptime: number; timestamp: string }> = {
    success: true,
    message: 'Server is running',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  }
  res.status(200).json(response)
}
