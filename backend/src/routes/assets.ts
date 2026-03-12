import { Router } from 'express';
import { 
  getAllAssets, 
  getAssetById, 
  createAsset, 
  updateAssetContract, 
  deactivateAsset 
} from '../controllers/assetController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllAssets);
router.get('/:id', getAssetById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, createAsset);
router.put('/:id/contract', authenticateToken, requireAdmin, updateAssetContract);
router.delete('/:id', authenticateToken, requireAdmin, deactivateAsset);

export default router;
