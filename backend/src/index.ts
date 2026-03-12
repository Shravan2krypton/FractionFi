import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDatabase } from './models/database';

// Import routes
import authRoutes from './routes/auth';
import mockAssetRoutes from './routes/mockAssets';
import mockInvestmentRoutes from './routes/mockInvestments';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FractionFi API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/assets', mockAssetRoutes);
app.use('/api/investments', mockInvestmentRoutes);
app.use('/api/admin', adminRoutes);

// Initialize database and start server
const startServer = async () => {
  try {
    // await initDatabase(); // Temporarily disabled
    console.log('Database initialization skipped for testing');
    
    app.listen(PORT, () => {
      console.log(`🚀 FractionFi API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
