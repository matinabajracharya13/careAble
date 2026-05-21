import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { requestLoggerAll } from '@/middleware/requestLogger';
import { errorHandler, notFound } from '@/middleware/errorHandler';
import healthRoutes from '@/routes/healthRoutes';
import userRoutes from '@/routes/userRoutes';
import assessmentRoutes from '@/routes/assessmentRoutes';
import authRoutes from '@/routes/authRoutes';
import roleRoutes from '@/routes/roleRoutes';
import onboardingRoutes from '@/routes/onboardingRoutes';
import certificateRoutes from '@/routes/certificateRoutes';
import statRoutes from '@/routes/statRoutes';
import adminRoutes from '@/routes/adminRoutes';
import contactRoutes from './routes/contactRoutes';
import candidateRoutes from './routes/candidateRoutes';

const app: Application = express();
const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL
];
// ─── Security ─────────────────────────────────────────────
app.use(helmet());
app.disable('etag');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // mobile apps / postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' }
  })
);

// ─── Body parsing ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────
app.use(requestLoggerAll);

// ─── Routes ────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/candidates', candidateRoutes);

// ─── Error handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
