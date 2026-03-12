# FractionFi - Blockchain Micro-Investment Platform

A modern full-stack web application that enables fractional ownership of high-value assets such as real estate, gold, and startups using blockchain technology.

## 🚀 Features

### Core Functionality
- **Asset Tokenization**: Convert high-value assets into tradable tokens
- **Micro-Investments**: Invest with as little as ₹100
- **Blockchain Security**: All transactions secured by smart contracts
- **Profit Distribution**: Automated profit sharing to token holders

### User Features
- **Authentication**: Secure JWT-based login system
- **Wallet Integration**: MetaMask wallet connectivity
- **Asset Marketplace**: Browse and filter investment opportunities
- **Portfolio Dashboard**: Real-time investment tracking with charts
- **Transaction History**: Complete transaction records

### Admin Features
- **Asset Management**: Create and manage tokenized assets
- **User Management**: Monitor platform users
- **Transaction Oversight**: View all platform transactions
- **Profit Distribution**: Trigger automated profit sharing

## 🛠 Tech Stack

### Frontend
- **Next.js 14**: React framework with TypeScript
- **TailwindCSS**: Modern utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Recharts**: Data visualization charts
- **Ethers.js**: Blockchain interaction library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **PostgreSQL**: Database (Neon DB compatible)
- **JWT**: Authentication tokens
- **Ethers.js**: Smart contract interaction

### Blockchain
- **Solidity**: Smart contract language
- **Hardhat**: Development framework
- **OpenZeppelin**: Secure contract libraries
- **ERC20**: Token standard implementation

## 📁 Project Structure

```
fractionfi/
├── frontend/                 # Next.js React application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # Reusable components
│   │   └── contexts/       # React contexts
│   ├── package.json
│   └── ...
├── backend/                  # Express API server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── ...
└── blockchain/               # Smart contracts
    ├── contracts/          # Solidity contracts
    ├── scripts/           # Deployment scripts
    └── hardhat.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- PostgreSQL database (or Neon DB)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fractionfi
```

2. **Install dependencies**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd ../frontend
npm install
```

Blockchain:
```bash
cd ../blockchain
npm install
```

3. **Environment Setup**

Create `.env` files in both backend and frontend directories:

Backend `.env`:
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
ETHEREUM_RPC_URL=http://localhost:8545
PRIVATE_KEY=your-private-key
CONTRACT_ADDRESS=your-contract-address
```

Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CONTRACT_ADDRESS=your-contract-address
```

4. **Database Setup**

Ensure PostgreSQL is running and create a database. The application will automatically create tables on startup.

5. **Start Development Servers**

Backend (Port 3001):
```bash
cd backend
npm run dev
```

Frontend (Port 3000):
```bash
cd frontend
npm run dev
```

Blockchain (Hardhat Network):
```bash
cd blockchain
npx hardhat node
```

Deploy smart contracts in another terminal:
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

## 📱 Usage

### For Users
1. **Sign Up**: Create an account with email and password
2. **Connect Wallet**: Link your MetaMask wallet
3. **Browse Assets**: Explore available investment opportunities
4. **Invest**: Purchase fractional tokens of desired assets
5. **Track Portfolio**: Monitor investments and returns
6. **View History**: Access transaction records

### For Admins
1. **Access Admin Panel**: Navigate to `/admin` (requires admin role)
2. **Create Assets**: Add new tokenized investment opportunities
3. **Monitor Users**: View platform activity and user investments
4. **Distribute Profits**: Trigger automated profit sharing
5. **Manage Platform**: Update asset statuses and oversee operations

## 🔧 Smart Contract Features

The AssetToken contract includes:
- **Asset Creation**: Admin-only asset tokenization
- **Token Purchases**: Secure token buying with ETH
- **Ownership Tracking**: Accurate token holder records
- **Profit Distribution**: Automated profit sharing
- **Security**: Reentrancy protection and access controls

## 🎯 Key Concepts

### Fractional Ownership
- High-value assets are divided into thousands of tokens
- Each token represents a small percentage of ownership
- Investors can buy any number of tokens based on their budget

### Blockchain Benefits
- **Transparency**: All transactions visible on blockchain
- **Security**: Smart contracts prevent fraud
- **Automation**: Profit distribution happens automatically
- **Liquidity**: Tokens can be traded on secondary markets

### Investment Types
1. **Real Estate**: Commercial and residential properties
2. **Gold Reserves**: Physically stored precious metals
3. **Startups**: Early-stage company equity

## 🔒 Security Considerations

- **Input Validation**: All user inputs are validated
- **Access Control**: Role-based permissions
- **Smart Contract Security**: OpenZeppelin libraries used
- **Environment Variables**: Sensitive data not in code
- **HTTPS**: Production uses secure connections

## 🧪 Testing

Run tests for each component:

```bash
# Backend tests
cd backend
npm test

# Smart contract tests
cd blockchain
npx hardhat test

# Frontend tests
cd frontend
npm test
```

## 📈 Future Enhancements

- **Secondary Market**: Token trading between users
- **Mobile App**: Native iOS and Android applications
- **More Asset Types**: Art, collectibles, intellectual property
- **Advanced Analytics**: AI-powered investment insights
- **Staking Rewards**: Earn rewards for holding tokens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions:
- Create an issue in the repository
- Email: support@fractionfi.com
- Documentation: [Link to docs]

---

**Built with ❤️ for democratizing investment opportunities**
