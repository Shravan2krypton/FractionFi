import { pool } from '../config/database';

export interface Transaction {
  id?: number;
  user_id: number;
  asset_id: number;
  transaction_type: 'purchase' | 'sale' | 'profit_distribution';
  amount: number;
  price_per_token: number;
  total_amount: number;
  transaction_hash?: string;
  blockchain_tx_hash?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at?: Date;
}

export interface CreateTransactionRequest {
  user_id: number;
  asset_id: number;
  transaction_type: 'purchase' | 'sale' | 'profit_distribution';
  amount: number;
  price_per_token: number;
  total_amount: number;
  transaction_hash?: string;
  blockchain_tx_hash?: string;
}

export class TransactionModel {
  static async create(transactionData: CreateTransactionRequest): Promise<Transaction> {
    const query = `
      INSERT INTO transactions (
        user_id, asset_id, transaction_type, amount, 
        price_per_token, total_amount, transaction_hash, 
        blockchain_tx_hash, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      transactionData.user_id,
      transactionData.asset_id,
      transactionData.transaction_type,
      transactionData.amount,
      transactionData.price_per_token,
      transactionData.total_amount,
      transactionData.transaction_hash || null,
      transactionData.blockchain_tx_hash || null,
      'pending'
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId: number): Promise<Transaction[]> {
    const query = `
      SELECT t.*, a.name as asset_name, a.asset_type
      FROM transactions t
      JOIN assets a ON t.asset_id = a.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id: number): Promise<Transaction | null> {
    const query = 'SELECT * FROM transactions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async updateStatus(id: number, status: 'pending' | 'completed' | 'failed', blockchainTxHash?: string): Promise<Transaction | null> {
    const query = `
      UPDATE transactions 
      SET status = $1, blockchain_tx_hash = $2
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, blockchainTxHash || null, id]);
    return result.rows[0] || null;
  }

  static async findByAssetId(assetId: number): Promise<Transaction[]> {
    const query = `
      SELECT t.*, u.name as user_name, u.email
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.asset_id = $1
      ORDER BY t.created_at DESC
    `;
    
    const result = await pool.query(query, [assetId]);
    return result.rows;
  }
}
