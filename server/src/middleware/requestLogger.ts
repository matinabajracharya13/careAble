import morgan from 'morgan'
import { Request, Response } from 'express'

const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev'

export const requestLogger = morgan(format, {
  skip: (_req: Request, res: Response) =>
    process.env.NODE_ENV === 'test' || res.statusCode < 400,
})

export const requestLoggerAll = morgan(format)
