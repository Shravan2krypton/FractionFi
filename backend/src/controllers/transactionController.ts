import { Request, Response } from 'express';
import { TransactionModel } from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';

export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const transactions = await TransactionModel.findByUserId(userId);
    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { asset_id, transaction_type, amount, price_per_token, total_amount } = req.body;

    // Validate input
    if (!asset_id || !transaction_type || !amount || !price_per_token || !total_amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const transaction = await TransactionModel.create({
      user_id: userId,
      asset_id,
      transaction_type,
      amount,
      price_per_token,
      total_amount
    });

    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, blockchain_tx_hash } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Transaction ID and status are required' });
    }

    const transactionId = Array.isArray(id) ? id[0] : id;
    const transaction = await TransactionModel.updateStatus(
      parseInt(transactionId),
      status,
      blockchain_tx_hash
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const transactionId = Array.isArray(id) ? id[0] : id;
    const transaction = await TransactionModel.findById(parseInt(transactionId));
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if user owns this transaction
    if (transaction.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
