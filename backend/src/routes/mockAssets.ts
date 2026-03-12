import { Router } from 'express';

const router = Router();

// Mock assets for testing without database
const mockAssets = [
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
    image_url: "/images/luxury-apartment.jpg",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Gold Reserve - 24K",
    asset_type: "gold",
    total_value: 5000000,
    total_supply: 5000,
    token_price: 1000,
    available_tokens: 3200,
    roi_estimate: 8.2,
    description: "Physically stored 24K gold bullion with secure vault storage and insurance.",
    image_url: "/images/gold-reserve.jpg",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Tech Startup - AI Innovation",
    asset_type: "startup",
    total_value: 20000000,
    total_supply: 20000,
    token_price: 1000,
    available_tokens: 15000,
    roi_estimate: 25.8,
    description: "Early-stage AI startup with breakthrough technology and strong market potential.",
    image_url: "/images/tech-startup.jpg",
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Get all assets
router.get('/', (req, res) => {
  res.json({
    assets: mockAssets,
    count: mockAssets.length
  });
});

// Get asset by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const asset = mockAssets.find(a => a.id === parseInt(id));
  
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }
  
  res.json({ asset });
});

export default router;
