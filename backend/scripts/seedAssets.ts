import { pool } from '../src/config/database';
import dotenv from 'dotenv';

dotenv.config();

const seedAssets = async () => {
  try {
    console.log('Seeding assets...');

    // Clear existing assets
    await pool.query('DELETE FROM assets');
    
    // Insert sample assets
    const assets = [
      {
        name: "Luxury Apartment Mumbai",
        asset_type: "real_estate",
        total_value: 10000000,
        total_supply: 10000,
        token_price: 1000,
        available_tokens: 7500,
        roi_estimate: 12.5,
        description: "Premium 3BHK apartment in South Mumbai with sea view and modern amenities.",
        image_url: "/images/luxury-apartment.jpg"
      },
      {
        name: "Gold Reserve - 24K",
        asset_type: "gold",
        total_value: 5000000,
        total_supply: 5000,
        token_price: 1000,
        available_tokens: 3200,
        roi_estimate: 8.2,
        description: "Physically stored 24K gold bullion with secure vault storage and insurance.",
        image_url: "/images/gold-reserve.jpg"
      },
      {
        name: "Tech Startup - AI Innovation",
        asset_type: "startup",
        total_value: 20000000,
        total_supply: 20000,
        token_price: 1000,
        available_tokens: 15000,
        roi_estimate: 25.8,
        description: "Early-stage AI startup with breakthrough technology and strong market potential.",
        image_url: "/images/tech-startup.jpg"
      }
    ];

    for (const asset of assets) {
      await pool.query(`
        INSERT INTO assets (name, asset_type, total_value, total_supply, token_price, available_tokens, roi_estimate, description, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        asset.name,
        asset.asset_type,
        asset.total_value,
        asset.total_supply,
        asset.token_price,
        asset.available_tokens,
        asset.roi_estimate,
        asset.description,
        asset.image_url
      ]);
    }

    console.log('✅ Assets seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding assets:', error);
  } finally {
    await pool.end();
  }
};

seedAssets();
