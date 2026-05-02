import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { requestLoggerAll } from './middleware/requestLogger'
import { errorHandler, notFound } from './middleware/errorHandler'
import healthRoutes from './routes/healthRoutes'
import userRoutes from './routes/userRoutes'
import assessmentRoutes from './routes/assessmentRoutes'

const app: Application = express()

// ─── Security ─────────────────────────────────────────────
app.use(helmet())

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
  })
)

// ─── Body parsing ──────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Logging ───────────────────────────────────────────────
app.use(requestLoggerAll)

// ─── Routes ────────────────────────────────────────────────
app.use('/api/health', healthRoutes)
app.use('/api/users', userRoutes)
app.use('/api/assessments', assessmentRoutes)

// ─── Error handling ────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
