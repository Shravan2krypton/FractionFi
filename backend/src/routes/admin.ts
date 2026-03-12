import { Router } from 'express';
import { 
  getDashboardStats,
  getAllUsers,
  getAllTransactions,
  distributeProfits,
  updateAssetStatus
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Admin dashboard routes
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/transactions', getAllTransactions);

// Asset management routes
router.post('/distribute-profits', distributeProfits);
router.put('/assets/:id/status', updateAssetStatus);

export default router;
