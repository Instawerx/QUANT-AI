import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Fee collector address (can be the deployer for now, or set in env)
  const feeCollector = process.env.FEE_COLLECTOR_ADDRESS || deployer.address;

  console.log("Fee collector address:", feeCollector);

  // Deploy PortfolioManager
  console.log("\nDeploying PortfolioManager...");
  const PortfolioManager = await ethers.getContractFactory("PortfolioManager");
  const portfolioManager = await PortfolioManager.deploy();
  await portfolioManager.waitForDeployment();

  const portfolioManagerAddress = await portfolioManager.getAddress();
  console.log("PortfolioManager deployed to:", portfolioManagerAddress);

  // Deploy TradingBot
  console.log("\nDeploying TradingBot...");
  const TradingBot = await ethers.getContractFactory("TradingBot");
  const tradingBot = await TradingBot.deploy(feeCollector);
  await tradingBot.waitForDeployment();

  const tradingBotAddress = await tradingBot.getAddress();
  console.log("TradingBot deployed to:", tradingBotAddress);

  // Verify deployments
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("Deployer:", deployer.address);
  console.log("PortfolioManager:", portfolioManagerAddress);
  console.log("TradingBot:", tradingBotAddress);
  console.log("Fee Collector:", feeCollector);

  // Save deployment addresses to environment file
  const envContent = `
# Contract Addresses - ${new Date().toISOString()}
PORTFOLIO_MANAGER_ADDRESS=${portfolioManagerAddress}
TRADING_BOT_ADDRESS=${tradingBotAddress}
FEE_COLLECTOR_ADDRESS=${feeCollector}
`;

  console.log("\n=== Environment Variables ===");
  console.log(envContent);

  // Test basic functionality
  console.log("\n=== Testing Basic Functionality ===");

  try {
    // Test PortfolioManager
    console.log("Testing PortfolioManager...");
    const supportedTokens = await portfolioManager.getSupportedTokens();
    console.log("Supported tokens:", supportedTokens);

    // Test TradingBot
    console.log("Testing TradingBot...");
    const strategies = await tradingBot.getAvailableStrategies();
    console.log("Available strategies:", strategies);

    const conservativeStrategy = await tradingBot.getStrategy("Conservative");
    console.log("Conservative strategy details:", conservativeStrategy);

    console.log("\n✅ All deployments successful and tested!");

  } catch (error) {
    console.error("❌ Error during testing:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
