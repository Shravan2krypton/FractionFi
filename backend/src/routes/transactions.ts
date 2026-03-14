import { Router } from 'express';
import { 
  getUserTransactions, 
  createTransaction, 
  updateTransactionStatus, 
  getTransactionById 
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's transactions
router.get('/', getUserTransactions);

// Create new transaction
router.post('/', createTransaction);

// Get specific transaction by ID
router.get('/:id', getTransactionById);

// Update transaction status (for blockchain verification)
router.put('/:id/status', updateTransactionStatus);

export default router;
