require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createMockData() {
  try {
    const userId = 8;
    
    console.log('Creating portfolio data...');
    
    // Portfolio data
    const portfolioQuery = `
      INSERT INTO investments (user_id, asset_id, tokens_owned, average_buy_price, total_invested, current_value, profit_loss) VALUES 
      ($1, $2, $3, $4, $5, $6, $7),
      ($1, $8, $9, $10, $11, $12, $13),
      ($1, $14, $15, $16, $17, $18, $19)
    `;
    
    await pool.query(portfolioQuery, [
      userId, 2, 25, 10000.00, 250000.00, 280000.00, 30000.00,
      4, 100, 1000.00, 100000.00, 112000.00, 12000.00,
      6, 15, 10000.00, 150000.00, 168000.00, 18000.00
    ]);
    
    console.log('Creating transaction data...');
    
    // Transaction data
    const transactionQuery = `
      INSERT INTO transactions (user_id, asset_id, transaction_type, amount, price_per_token, total_amount, status) VALUES 
      ($1, $2, $3, $4, $5, $6, $7),
      ($1, $8, $9, $10, $11, $12, $13),
      ($1, $14, $15, $16, $17, $18, $19),
      ($1, $20, $21, $22, $23, $24, $25)
    `;
    
    await pool.query(transactionQuery, [
      userId, 2, 'buy', 25, 10000.00, 250000.00, 'completed',
      4, 'buy', 100, 1000.00, 100000.00, 'completed',
      6, 'buy', 15, 10000.00, 150000.00, 'completed',
      2, 'sell', 5, 11200.00, 56000.00, 'completed'
    ]);
    
    console.log('✅ Mock data created successfully!');
    
    // Verify data
    const portfolio = await pool.query('SELECT COUNT(*) as count FROM investments WHERE user_id = $1', [userId]);
    const transactions = await pool.query('SELECT COUNT(*) as count FROM transactions WHERE user_id = $1', [userId]);
    
    console.log(`📊 Portfolio records: ${portfolio.rows[0].count}`);
    console.log(`💳 Transaction records: ${transactions.rows[0].count}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createMockData();
