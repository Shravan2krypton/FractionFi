import { pool } from '../config/database';

export interface Investment {
  id?: number;
  user_id: number;
  asset_id: number;
  tokens_owned: number;
  average_buy_price: number;
  total_invested: number;
  current_value: number;
  profit_loss: number;
  created_at?: Date;
  updated_at?: Date;
}

export class InvestmentModel {
  static async createOrUpdate(userId: number, assetId: number, tokensBought: number, pricePerToken: number): Promise<Investment> {
    // First, try to find existing investment
    const existingQuery = 'SELECT * FROM investments WHERE user_id = $1 AND asset_id = $2';
    const existingResult = await pool.query(existingQuery, [userId, assetId]);
    
    if (existingResult.rows.length > 0) {
      // Update existing investment
      const existing = existingResult.rows[0];
      const newTotalTokens = existing.tokens_owned + tokensBought;
      const newTotalInvested = existing.total_invested + (tokensBought * pricePerToken);
      const newAveragePrice = newTotalInvested / newTotalTokens;
      
      const updateQuery = `
        UPDATE investments 
        SET tokens_owned = $1, average_buy_price = $2, total_invested = $3, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $4 AND asset_id = $5
        RETURNING *
      `;
      
      const result = await pool.query(updateQuery, [
        newTotalTokens, newAveragePrice, newTotalInvested, userId, assetId
      ]);
      
      return result.rows[0];
    } else {
      // Create new investment
      const totalInvested = tokensBought * pricePerToken;
      
      const createQuery = `
        INSERT INTO investments (
          user_id, asset_id, tokens_owned, average_buy_price, total_invested
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const result = await pool.query(createQuery, [
        userId, assetId, tokensBought, pricePerToken, totalInvested
      ]);
      
      return result.rows[0];
    }
  }

  static async findByUserId(userId: number): Promise<Investment[]> {
    const query = `
      SELECT i.*, a.name as asset_name, a.asset_type, a.token_price as current_token_price
      FROM investments i
      JOIN assets a ON i.asset_id = a.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findByUserAndAsset(userId: number, assetId: number): Promise<Investment | null> {
    const query = `
      SELECT i.*, a.name as asset_name, a.asset_type, a.token_price as current_token_price
      FROM investments i
      JOIN assets a ON i.asset_id = a.id
      WHERE i.user_id = $1 AND i.asset_id = $2
    `;
    
    const result = await pool.query(query, [userId, assetId]);
    return result.rows[0] || null;
  }

  static async updateCurrentValue(assetId: number, currentTokenPrice: number): Promise<void> {
    const query = `
      UPDATE investments 
      SET current_value = tokens_owned * $1,
          profit_loss = (tokens_owned * $1) - total_invested,
          updated_at = CURRENT_TIMESTAMP
      WHERE asset_id = $2
    `;
    
    await pool.query(query, [currentTokenPrice, assetId]);
  }

  static async getTotalInvestmentStats(userId: number): Promise<{
    totalInvested: number;
    currentValue: number;
    totalProfitLoss: number;
    totalAssets: number;
  }> {
    const query = `
      SELECT 
        COALESCE(SUM(total_invested), 0) as total_invested,
        COALESCE(SUM(current_value), 0) as current_value,
        COALESCE(SUM(profit_loss), 0) as total_profit_loss,
        COUNT(*) as total_assets
      FROM investments 
      WHERE user_id = $1 AND tokens_owned > 0
    `;
    
    const result = await pool.query(query, [userId]);
    const stats = result.rows[0];
    
    return {
      totalInvested: parseFloat(stats.total_invested) || 0,
      currentValue: parseFloat(stats.current_value) || 0,
      totalProfitLoss: parseFloat(stats.total_profit_loss) || 0,
      totalAssets: parseInt(stats.total_assets) || 0
    };
  }

  static async sellTokens(userId: number, assetId: number, tokensToSell: number, sellPrice: number): Promise<Investment | null> {
    const investment = await this.findByUserAndAsset(userId, assetId);
    
    if (!investment || investment.tokens_owned < tokensToSell) {
      return null;
    }
    
    const remainingTokens = investment.tokens_owned - tokensToSell;
    const sellValue = tokensToSell * sellPrice;
    
    if (remainingTokens === 0) {
      // Remove investment completely
      const deleteQuery = 'DELETE FROM investments WHERE user_id = $1 AND asset_id = $2 RETURNING *';
      const result = await pool.query(deleteQuery, [userId, assetId]);
      return result.rows[0] || null;
    } else {
      // Update investment
      const newTotalInvested = investment.total_invested - (investment.average_buy_price * tokensToSell);
      const newAveragePrice = newTotalInvested / remainingTokens;
      
      const updateQuery = `
        UPDATE investments 
        SET tokens_owned = $1, average_buy_price = $2, total_invested = $3, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $4 AND asset_id = $5
        RETURNING *
      `;
      
      const result = await pool.query(updateQuery, [
        remainingTokens, newAveragePrice, newTotalInvested, userId, assetId
      ]);
      
      return result.rows[0];
    }
  }
}
