const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AssetToken contract...");

  const AssetToken = await ethers.getContractFactory("AssetToken");
  const assetToken = await AssetToken.deploy();

  await assetToken.deployed();

  console.log("AssetToken deployed to:", assetToken.address);

  // Create sample assets for testing
  console.log("Creating sample assets...");
  
  await assetToken.createAssetToken(
    "Luxury Apartment Mumbai",
    "real_estate",
    ethers.utils.parseEther("100"), // 100 ETH value
    10000 // 10,000 tokens
  );

  await assetToken.createAssetToken(
    "Gold Reserve",
    "gold",
    ethers.utils.parseEther("50"), // 50 ETH value
    5000 // 5,000 tokens
  );

  await assetToken.createAssetToken(
    "Tech Startup",
    "startup",
    ethers.utils.parseEther("200"), // 200 ETH value
    20000 // 20,000 tokens
  );

  console.log("Sample assets created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
