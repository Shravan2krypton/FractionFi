import { Router } from 'express';
import { 
  getUserInvestments,
  getPortfolioStats,
  purchaseTokens,
  getUserTransactions,
  sellTokens
} from '../controllers/investmentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All investment routes require authentication
router.use(authenticateToken);

// User investment routes
router.get('/', getUserInvestments);
router.get('/stats', getPortfolioStats);
router.get('/transactions', getUserTransactions);
router.post('/purchase', purchaseTokens);
router.post('/sell', sellTokens);

export default router;
