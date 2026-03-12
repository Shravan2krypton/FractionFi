import { Router } from 'express';
import { 
  getUserInvestments,
  getPortfolioStats,
  purchaseTokens,
  getUserTransactions,
  sellTokens
} from '../controllers/mockInvestmentController';

const router = Router();

// All investment routes require authentication
router.get('/', getUserInvestments);
router.get('/stats', getPortfolioStats);
router.get('/transactions', getUserTransactions);
router.post('/purchase', purchaseTokens);
router.post('/sell', sellTokens);

export default router;
