import { ethers } from "ethers";

async function main() {
  console.log("Starting deployment to testnet...");

  // Get deployer account
  const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_PROJECT_ID");
  const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY");
  const deployer = wallet.connect(provider);

  if (!deployer) {
    console.error("No deployer account found");
    process.exit(1);
  }

  console.log("Deploying with account:", deployer.address);

  // Deploy AssetToken contract
  const AssetTokenFactory = await ethers.getContractFactory("AssetToken");
  
  try {
    console.log("Deploying AssetToken contract...");
    const assetToken = await AssetTokenFactory.deploy();
    await assetToken.waitForDeployment();
    
    console.log("✅ AssetToken deployed to:", assetToken.target);
    console.log("Transaction hash:", assetToken.deploymentTransaction().hash);
    
    // Create sample assets
    console.log("Creating sample assets...");
    
    const createAssetTx = await assetToken.createAssetToken(
      "Luxury Apartment Mumbai",
      "real_estate",
      ethers.parseEther("10"), // 10 ETH total value
      10000 // 10,000 tokens
    );
    
    await createAssetTx.wait();
    console.log("✅ Sample asset created");
    
    const createAssetTx2 = await assetToken.createAssetToken(
      "Gold Reserve",
      "gold", 
      ethers.parseEther("5"), // 5 ETH total value
      5000 // 5,000 tokens
    );
    
    await createAssetTx2.wait();
    console.log("✅ Second sample asset created");
    
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("Contract Address:", assetToken.target);
    console.log("Add to frontend .env.local:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${assetToken.target}`);
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
