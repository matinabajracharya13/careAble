import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { requestLoggerAll } from './middleware/requestLogger';
import { errorHandler, notFound } from './middleware/errorHandler';
import healthRoutes from './routes/healthRoutes';
import userRoutes from './routes/userRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import certificateRoutes from './routes/certificateRoutes';

const app: Application = express();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', process.env.CLIENT_URL];
// ─── Security ─────────────────────────────────────────────
app.use(helmet());

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
app.use('/api/certificates', certificateRoutes);

// ─── Error handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
