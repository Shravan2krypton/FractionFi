import { Request, Response } from 'express';
import { InvestmentModel } from '../models/Investment';
import { TransactionModel } from '../models/Transaction';
import { AssetModel } from '../models/Asset';
import { AuthRequest } from '../middleware/auth';

export const getUserInvestments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const investments = await InvestmentModel.findByUserId(userId);
    
    res.json({
      investments,
      count: investments.length
    });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPortfolioStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const stats = await InvestmentModel.getTotalInvestmentStats(userId);
    
    res.json(stats);
  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const purchaseTokens = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { asset_id, token_amount, wallet_address } = req.body;

    // Validate input
    if (!asset_id || !token_amount || !wallet_address) {
      return res.status(400).json({ 
        error: 'Asset ID, token amount, and wallet address are required' 
      });
    }

    if (token_amount <= 0) {
      return res.status(400).json({ error: 'Token amount must be greater than 0' });
    }

    // Get asset details
    const asset = await AssetModel.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    if (!asset.is_active) {
      return res.status(400).json({ error: 'Asset is not active for investment' });
    }

    if (asset.available_tokens < token_amount) {
      return res.status(400).json({ 
        error: 'Insufficient tokens available' 
      });
    }

    const totalAmount = asset.token_price * token_amount;

    // Create transaction record
    const transaction = await TransactionModel.create({
      user_id: userId,
      asset_id,
      transaction_type: 'purchase',
      amount: token_amount,
      price_per_token: asset.token_price,
      total_amount: totalAmount,
      transaction_hash: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Update investment record
    const investment = await InvestmentModel.createOrUpdate(
      userId,
      asset_id,
      token_amount,
      asset.token_price
    );

    // Update available tokens
    await AssetModel.updateAvailableTokens(asset_id, token_amount);

    // Update transaction status to completed
    await TransactionModel.updateStatus(transaction.id!, 'completed');

    res.status(201).json({
      message: 'Token purchase successful',
      transaction: {
        id: transaction.id,
        asset_name: asset.name,
        token_amount,
        price_per_token: asset.token_price,
        total_amount: totalAmount,
        transaction_hash: transaction.transaction_hash
      },
      investment
    });
  } catch (error) {
    console.error('Purchase tokens error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const transactions = await TransactionModel.findByUserId(userId);
    
    res.json({
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sellTokens = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { asset_id, token_amount, sell_price } = req.body;

    // Validate input
    if (!asset_id || !token_amount || !sell_price) {
      return res.status(400).json({ 
        error: 'Asset ID, token amount, and sell price are required' 
      });
    }

    if (token_amount <= 0) {
      return res.status(400).json({ error: 'Token amount must be greater than 0' });
    }

    // Get user's investment
    const investment = await InvestmentModel.findByUserAndAsset(userId, asset_id);
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    if (investment.tokens_owned < token_amount) {
      return res.status(400).json({ 
        error: 'Insufficient tokens owned' 
      });
    }

    const totalAmount = sell_price * token_amount;

    // Create transaction record
    const transaction = await TransactionModel.create({
      user_id: userId,
      asset_id,
      transaction_type: 'sale',
      amount: token_amount,
      price_per_token: sell_price,
      total_amount: totalAmount,
      transaction_hash: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Update investment record
    const updatedInvestment = await InvestmentModel.sellTokens(
      userId,
      asset_id,
      token_amount,
      sell_price
    );

    // Update transaction status to completed
    await TransactionModel.updateStatus(transaction.id!, 'completed');

    res.status(201).json({
      message: 'Token sale successful',
      transaction: {
        id: transaction.id,
        token_amount,
        price_per_token: sell_price,
        total_amount: totalAmount,
        transaction_hash: transaction.transaction_hash
      },
      investment: updatedInvestment
    });
  } catch (error) {
    console.error('Sell tokens error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
