const { pool } = require('../dist/config/database');

async function addSampleAssets() {
  try {
    console.log('Adding sample assets to database...');

    const sampleAssets = [
      {
        name: "Luxury Apartment - South Mumbai",
        asset_type: "real_estate",
        total_value: 50000000, // 5 crore INR
        total_supply: 5000,
        description: "Premium 3BHK apartment in prime South Mumbai location with sea view and modern amenities.",
        image_url: "/images/luxury-apartment.jpg",
        roi_estimate: 12.5
      },
      {
        name: "Commercial Office Space - Bangalore",
        asset_type: "real_estate", 
        total_value: 30000000, // 3 crore INR
        total_supply: 3000,
        description: "Grade A commercial office space in IT hub with high rental yield potential.",
        image_url: "/images/office-space.jpg",
        roi_estimate: 10.8
      },
      {
        name: "Digital Gold Reserve - 24K",
        asset_type: "gold",
        total_value: 10000000, // 1 crore INR
        total_supply: 10000,
        description: "Digitally backed 24K gold reserves with secure storage and insurance.",
        image_url: "/images/gold-reserve.jpg",
        roi_estimate: 8.5
      },
      {
        name: "Silver Bullion - Investment Grade",
        asset_type: "gold",
        total_value: 5000000, // 50 lakh INR
        total_supply: 5000,
        description: "Investment grade silver bullion with purity certification and secure vault storage.",
        image_url: "/images/silver-bullion.jpg",
        roi_estimate: 7.2
      },
      {
        name: "FinTech Startup - Digital Payments",
        asset_type: "startup",
        total_value: 20000000, // 2 crore INR
        total_supply: 2000,
        description: "Innovative fintech startup revolutionizing digital payments with AI-powered fraud detection.",
        image_url: "/images/fintech-startup.jpg",
        roi_estimate: 25.0
      },
      {
        name: "HealthTech AI Platform",
        asset_type: "startup", 
        total_value: 15000000, // 1.5 crore INR
        total_supply: 1500,
        description: "AI-powered healthcare platform for remote patient monitoring and predictive diagnostics.",
        image_url: "/images/healthtech-ai.jpg",
        roi_estimate: 30.0
      },
      {
        name: "Green Energy Solar Farm",
        asset_type: "real_estate",
        total_value: 40000000, // 4 crore INR
        total_supply: 4000,
        description: "Solar energy farm with long-term power purchase agreements and sustainable returns.",
        image_url: "/images/solar-farm.jpg",
        roi_estimate: 15.0
      },
      {
        name: "Blockchain Infrastructure Project",
        asset_type: "startup",
        total_value: 8000000, // 80 lakh INR
        total_supply: 800,
        description: "Next-generation blockchain infrastructure project focusing on scalability and security.",
        image_url: "/images/blockchain-infra.jpg",
        roi_estimate: 35.0
      }
    ];

    for (const asset of sampleAssets) {
      const tokenPrice = asset.total_value / asset.total_supply;
      
      const query = `
        INSERT INTO assets (
          name, asset_type, total_value, total_supply, 
          token_price, available_tokens, description, 
          image_url, roi_estimate
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `;
      
      const values = [
        asset.name,
        asset.asset_type,
        asset.total_value,
        asset.total_supply,
        tokenPrice,
        asset.total_supply, // Initially all tokens are available
        asset.description,
        asset.image_url,
        asset.roi_estimate
      ];
      
      const result = await pool.query(query, values);
      console.log(`✅ Added asset: ${asset.name} (ID: ${result.rows[0].id})`);
    }

    console.log('\n🎉 All sample assets added successfully!');
    
    // Check total assets
    const countResult = await pool.query('SELECT COUNT(*) FROM assets');
    console.log(`\n📊 Total assets in database: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error adding sample assets:', error);
  } finally {
    await pool.end();
  }
}

addSampleAssets();
