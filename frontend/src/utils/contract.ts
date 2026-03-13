import { ethers, formatEther, parseEther } from 'ethers';

// Contract ABI for the AssetToken contract
export const CONTRACT_ABI = [
  "function createAssetToken(string name, string assetType, uint256 totalValue, uint256 totalSupply) external",
  "function buyTokens(uint256 assetId, uint256 amount) payable",
  "function getAsset(uint256 assetId) view returns (tuple(string name, string assetType, uint256 totalValue, uint256 totalSupply, uint256 tokenPrice, bool isActive))",
  "function getOwnership(uint256 assetId, address owner) view returns (uint256)",
  "function getAllAssets() view returns (tuple(string name, string assetType, uint256 totalValue, uint256 totalSupply, uint256 tokenPrice, bool isActive)[])",
  "function getAvailableTokens(uint256 assetId) view returns (uint256)",
  "function distributeProfits(uint256 assetId) payable",
  "event AssetCreated(uint256 indexed assetId, string name, string assetType, uint256 totalValue, uint256 totalSupply, uint256 tokenPrice)",
  "event TokensPurchased(uint256 indexed assetId, address indexed buyer, uint256 amount, uint256 cost)",
  "event ProfitDistributed(uint256 indexed assetId, uint256 totalAmount, uint256 totalSupply)"
];

// Contract address (update this after deployment)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000000';

export const getContract = (signer: ethers.Signer | null) => {
  if (!signer) {
    throw new Error('Signer not available');
  }
  
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === 'your-contract-address-here' || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000000') {
    throw new Error('Contract address not configured. Please deploy the contract and update NEXT_PUBLIC_CONTRACT_ADDRESS');
  }
  
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Mock contract for testing without real blockchain
export const mockContract = {
  createAssetToken: async (name: string, assetType: string, totalValue: string, totalSupply: string) => {
    console.log('Mock: Creating asset token', { name, assetType, totalValue, totalSupply });
    return { hash: 'mock-asset-creation' };
  },
  
  buyTokens: async (assetId: number, amount: number, value: string) => {
    console.log('Mock: Buying tokens', { assetId, amount, value });
    return { hash: 'mock-token-purchase' };
  },
  
  getAsset: async (assetId: number) => {
    console.log('Mock: Getting asset', assetId);
    return {
      name: "Luxury Apartment Mumbai",
      assetType: "real_estate",
      totalValue: parseEther("100"),
      totalSupply: 10000,
      tokenPrice: parseEther("0.01"),
      isActive: true
    };
  },
  
  getOwnership: async (assetId: number, owner: string) => {
    console.log('Mock: Getting ownership for asset', assetId, 'owner', owner);
    return 1000; // Mock ownership
  },
  
  getAllAssets: async () => {
    console.log('Mock: Getting all assets');
    return [
      {
        name: "Luxury Apartment Mumbai",
        assetType: "real_estate",
        totalValue: parseEther("100"),
        totalSupply: 10000,
        tokenPrice: parseEther("0.01"),
        isActive: true
      },
      {
        name: "Gold Reserve",
        assetType: "gold",
        totalValue: parseEther("50"),
        totalSupply: 5000,
        tokenPrice: parseEther("0.01"),
        isActive: true
      },
      {
        name: "Tech Startup",
        assetType: "startup",
        totalValue: parseEther("200"),
        totalSupply: 20000,
        tokenPrice: parseEther("0.01"),
        isActive: true
      }
    ];
  },
  
  getAvailableTokens: async (assetId: number) => {
    console.log('Mock: Getting available tokens for asset', assetId);
    return 7500; // Mock available tokens
  },
  
  distributeProfits: async (assetId: number, value: string) => {
    console.log('Mock: Distributing profits for asset', assetId, 'value', value);
    return { hash: 'mock-profit-distribution' };
  }
};
