import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express, { Request, Response } from 'express';
import { initDatabase } from '../src/models/database';
import { apiLimiter } from '../src/middleware/rateLimiter';

// Import routes
import authRoutes from '../src/routes/auth';
import investmentRoutes from '../src/routes/investments';
import adminRoutes from '../src/routes/admin';
import assetRoutes from '../src/routes/assets';

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://fraction-grzcd6ohm-vrushank.vercel.app',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use('/api/', apiLimiter);

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'FractionFi API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/admin', adminRoutes);

// Initialize database
let dbInitialized = false;

const ensureDb = async () => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDb();
  app(req, res);
}
