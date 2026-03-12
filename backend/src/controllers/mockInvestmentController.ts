import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

// Mock data for testing
const mockInvestments = [
  {
    id: 1,
    user_id: 1,
    asset_name: "Luxury Apartment Mumbai",
    asset_type: "real_estate",
    tokens_owned: 100,
    average_buy_price: 1000,
    total_invested: 100000,
    current_value: 112500,
    profit_loss: 12500
  }
];

const mockTransactions = [
  {
    id: 1,
    user_id: 1,
    asset_name: "Luxury Apartment Mumbai",
    asset_type: "real_estate",
    transaction_type: "purchase",
    amount: 100,
    price_per_token: 1000,
    total_amount: 100000,
    transaction_hash: "TXN_001",
    blockchain_tx_hash: "0x123...abc",
    status: "completed",
    created_at: new Date().toISOString()
  }
];

export const getUserInvestments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    res.json({
      investments: mockInvestments,
      count: mockInvestments.length
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

    const stats = {
      totalInvested: 100000,
      currentValue: 112500,
      totalProfitLoss: 12500,
      totalAssets: 1
    };
    
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

    // Mock successful purchase
    res.status(201).json({
      message: 'Token purchase successful',
      transaction: {
        id: 1,
        asset_name: "Luxury Apartment Mumbai",
        token_amount,
        price_per_token: 1000,
        total_amount: token_amount * 1000,
        transaction_hash: `TXN_${Date.now()}_MOCK`
      },
      investment: {
        id: 1,
        tokens_owned: mockInvestments[0].tokens_owned + token_amount,
        total_invested: mockInvestments[0].total_invested + (token_amount * 1000)
      }
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

    res.json({
      transactions: mockTransactions,
      count: mockTransactions.length
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

    // Mock successful sale
    res.status(201).json({
      message: 'Token sale successful',
      transaction: {
        id: 2,
        token_amount,
        price_per_token: sell_price,
        total_amount: token_amount * sell_price,
        transaction_hash: `TXN_${Date.now()}_SALE`
      }
    });
  } catch (error) {
    console.error('Sell tokens error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
