import { ethers } from "ethers";

async function main() {
  console.log("Starting deployment to Sepolia testnet...");

  // Use Sepolia testnet with public RPC
  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
  
  // Sample testnet private key (replace with your own)
  // This is a test key - DO NOT use in production
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey);
  const deployer = wallet.connect(provider);

  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.log("❌ No ETH in deployer account");
    console.log("Get testnet ETH from: https://sepoliafaucet.com/");
    process.exit(1);
  }

  // Deploy AssetToken contract
  const AssetTokenFactory = await ethers.getContractFactory("AssetToken");
  
  try {
    console.log("Deploying AssetToken contract...");
    const assetToken = await AssetTokenFactory.deploy();
    await assetToken.waitForDeployment();
    
    const contractAddress = await assetToken.getAddress();
    console.log("✅ AssetToken deployed to:", contractAddress);
    console.log("Transaction hash:", assetToken.deploymentTransaction().hash);
    
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("Contract Address:", contractAddress);
    console.log("Add to frontend .env.local:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
    
    return contractAddress;
    
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
