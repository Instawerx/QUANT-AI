import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying QuantTrade AI contracts...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Account balance: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} ETH`);

  // Deploy AccessRegistry first
  console.log("\n📋 Deploying AccessRegistry...");
  const AccessRegistry = await hre.ethers.getContractFactory("AccessRegistry");
  const accessRegistry = await AccessRegistry.deploy(deployer.address);
  await accessRegistry.waitForDeployment();
  const accessRegistryAddress = await accessRegistry.getAddress();
  console.log(`✅ AccessRegistry deployed to: ${accessRegistryAddress}`);

  // Deploy QuantToken
  console.log("\n🪙 Deploying QuantToken...");
  const QuantToken = await hre.ethers.getContractFactory("QuantToken");
  const quantToken = await QuantToken.deploy(deployer.address);
  await quantToken.waitForDeployment();
  const quantTokenAddress = await quantToken.getAddress();
  console.log(`✅ QuantToken deployed to: ${quantTokenAddress}`);

  // Deploy QuantTradeAI
  console.log("\n🤖 Deploying QuantTradeAI...");
  const QuantTradeAI = await hre.ethers.getContractFactory("QuantTradeAI");
  const quantTradeAI = await QuantTradeAI.deploy();
  await quantTradeAI.waitForDeployment();
  const quantTradeAIAddress = await quantTradeAI.getAddress();
  console.log(`✅ QuantTradeAI deployed to: ${quantTradeAIAddress}`);

  // Setup initial configuration
  console.log("\n⚙️ Setting up initial configuration...");

  // Grant USER_MANAGER_ROLE to deployer for testing
  const USER_MANAGER_ROLE = await accessRegistry.USER_MANAGER_ROLE();
  await accessRegistry.grantRole(USER_MANAGER_ROLE, deployer.address);
  console.log("✅ Granted USER_MANAGER_ROLE to deployer");

  // Verify deployer as user
  await accessRegistry.verifyUser(deployer.address);
  console.log("✅ Verified deployer as user");

  // Summary
  console.log("\n📋 Deployment Summary:");
  console.log(`AccessRegistry: ${accessRegistryAddress}`);
  console.log(`QuantToken: ${quantTokenAddress}`);
  console.log(`QuantTradeAI: ${quantTradeAIAddress}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer.address}`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AccessRegistry: accessRegistryAddress,
      QuantToken: quantTokenAddress,
      QuantTradeAI: quantTradeAIAddress,
    },
  };

  console.log("\n💾 Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
