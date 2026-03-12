import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FractionFi API is running' });
});

app.get('/api/assets', (req, res) => {
  res.json({
    assets: [
      {
        id: 1,
        name: "Luxury Apartment Mumbai",
        asset_type: "real_estate",
        total_value: 10000000,
        total_supply: 10000,
        token_price: 1000,
        available_tokens: 7500,
        roi_estimate: 12.5,
        description: "Premium 3BHK apartment in South Mumbai with sea view and modern amenities.",
        is_active: true,
        created_at: new Date().toISOString()
      }
    ],
    count: 1
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
});
