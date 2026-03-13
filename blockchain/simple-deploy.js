const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  const [deployer] = await ethers.getSigners();

  if (deployer.length === 0) {
    console.error("No deployer account found");
    process.exit(1);
  }

  console.log("Deploying with account:", deployer[0].address);

  try {
    console.log("Deploying AssetToken contract...");
    const AssetToken = await ethers.getContractFactory("AssetToken");
    const assetToken = await AssetToken.deploy();
    await assetToken.deployed();

    console.log("✅ AssetToken deployed to:", assetToken.address);
    console.log("Transaction hash:", assetToken.deployTransaction.hash);

    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("Contract Address:", assetToken.address);
    console.log("Add to frontend .env.local:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${assetToken.address}`);
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main();
