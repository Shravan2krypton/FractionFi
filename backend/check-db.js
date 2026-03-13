const { pool } = require('./dist/config/database');

async function checkDatabase() {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    console.log('Current time:', result.rows[0].now);
    
    // Check if assets table exists and has data
    const assetsResult = await pool.query('SELECT COUNT(*) FROM assets');
    console.log('✅ Assets table exists with', assetsResult.rows[0].count, 'records');
    
    // Check if users table exists and has data
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    console.log('✅ Users table exists with', usersResult.rows[0].count, 'records');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await pool.end();
  }
}

checkDatabase();
