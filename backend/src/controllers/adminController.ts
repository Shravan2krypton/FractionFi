import { Request, Response } from 'express';
import { AssetModel } from '../models/Asset';
import { TransactionModel } from '../models/Transaction';
import { InvestmentModel } from '../models/Investment';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get total assets
    const allAssets = await AssetModel.findAll();
    const activeAssets = allAssets.filter(asset => asset.is_active);
    
    // Get total users (this would require a UserModel method)
    // For now, we'll return a placeholder
    const totalUsers = 0; // This would be implemented in UserModel
    
    // Get total investments
    const totalInvestments = await InvestmentModel.getTotalInvestmentStats(0); // This would need to be modified
    
    // Get recent transactions
    const recentTransactions = await TransactionModel.findByUserId(0); // This would need to be modified

    res.json({
      totalAssets: allAssets.length,
      activeAssets: activeAssets.length,
      totalUsers,
      totalInvested: totalInvestments.totalInvested,
      currentValue: totalInvestments.currentValue,
      recentTransactions: recentTransactions.slice(0, 10)
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    // This would require implementing a getAllUsers method in UserModel
    // For now, return placeholder data
    const users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        wallet_address: '0x1234...5678',
        total_invested: 50000,
        created_at: new Date()
      }
    ];
    
    res.json({
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    // This would require implementing a getAllTransactions method
    // For now, return placeholder data
    const transactions = [
      {
        id: 1,
        user_name: 'John Doe',
        asset_name: 'Luxury Apartment Mumbai',
        transaction_type: 'purchase',
        amount: 10,
        total_amount: 10000,
        status: 'completed',
        created_at: new Date()
      }
    ];
    
    res.json({
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const distributeProfits = async (req: AuthRequest, res: Response) => {
  try {
    const { asset_id, total_amount, per_token_amount } = req.body;

    // Validate input
    if (!asset_id || !total_amount || !per_token_amount) {
      return res.status(400).json({ 
        error: 'Asset ID, total amount, and per token amount are required' 
      });
    }

    // Get asset details
    const asset = await AssetModel.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Get all investors for this asset
    const investments = await InvestmentModel.findByUserId(asset_id); // This would need to be modified
    
    // Calculate profit distribution for each investor
    const distributions = investments.map(investment => ({
      user_id: investment.user_id,
      asset_id,
      tokens_owned: investment.tokens_owned,
      profit_amount: investment.tokens_owned * per_token_amount
    }));

    // Create profit distribution records
    // This would require implementing ProfitDistributionModel
    
    res.json({
      message: 'Profit distribution initiated successfully',
      asset_name: asset.name,
      total_amount,
      per_token_amount,
      total_investors: distributions.length,
      distributions: distributions.slice(0, 5) // Show first 5 for preview
    });
  } catch (error) {
    console.error('Distribute profits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAssetStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'is_active must be a boolean' });
    }

    const asset = await AssetModel.findById(parseInt(id as string));
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Update asset status
    const updatedAsset = is_active ? 
      await AssetModel.updateContractAddress(
        parseInt(id as string), 
        asset.contract_address || '', 
        asset.blockchain_asset_id || 0
      ) : 
      await AssetModel.deactivate(parseInt(id as string));

    res.json({
      message: `Asset ${is_active ? 'activated' : 'deactivated'} successfully`,
      asset: updatedAsset
    });
  } catch (error) {
    console.error('Update asset status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
