import { pool } from '../config/database';

// Initialize database tables
export const initDatabase = async () => {
  try {
    console.log('Initializing database with connection...');
    
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        wallet_address VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Assets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        asset_type VARCHAR(100) NOT NULL,
        total_value DECIMAL(20, 2) NOT NULL,
        total_supply INTEGER NOT NULL,
        token_price DECIMAL(20, 2) NOT NULL,
        available_tokens INTEGER NOT NULL,
        roi_estimate DECIMAL(5, 2),
        description TEXT,
        image_url VARCHAR(500),
        contract_address VARCHAR(255),
        blockchain_asset_id INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        asset_id INTEGER REFERENCES assets(id),
        transaction_type VARCHAR(50) NOT NULL,
        amount INTEGER NOT NULL,
        price_per_token DECIMAL(20, 2) NOT NULL,
        total_amount DECIMAL(20, 2) NOT NULL,
        transaction_hash VARCHAR(255),
        blockchain_tx_hash VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Investments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS investments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        asset_id INTEGER REFERENCES assets(id),
        tokens_owned INTEGER NOT NULL,
        average_buy_price DECIMAL(20, 2) NOT NULL,
        total_invested DECIMAL(20, 2) NOT NULL,
        current_value DECIMAL(20, 2) DEFAULT 0,
        profit_loss DECIMAL(20, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Profit distributions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profit_distributions (
        id SERIAL PRIMARY KEY,
        asset_id INTEGER REFERENCES assets(id),
        total_amount DECIMAL(20, 2) NOT NULL,
        per_token_amount DECIMAL(20, 2) NOT NULL,
        distributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        blockchain_tx_hash VARCHAR(255),
        status VARCHAR(50) DEFAULT 'completed'
      )
    `);

    // User profit records
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        distribution_id INTEGER REFERENCES profit_distributions(id),
        asset_id INTEGER REFERENCES assets(id),
        tokens_owned INTEGER NOT NULL,
        profit_amount DECIMAL(20, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default pool;
