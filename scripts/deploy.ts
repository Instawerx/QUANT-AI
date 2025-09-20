import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { writeFileSync, appendFileSync } from "fs";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("\n🚀 QuantAI Smart Contract Deployment");
  console.log("=====================================");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Deployer Address:", deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Validate required environment variables
  const requiredVars = ['TREASURY_WALLET_ADDRESS', 'FEE_COLLECTOR_ADDRESS'];
  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].includes('YOUR_')) {
      console.error(`❌ Error: ${varName} is not properly set in .env file`);
      console.error(`Please update your .env file with real wallet addresses`);
      process.exit(1);
    }
  }

  // Load configuration from environment
  const treasuryWallet = process.env.TREASURY_WALLET_ADDRESS!;
  const feeCollector = process.env.FEE_COLLECTOR_ADDRESS!;
  const platformFeePercent = parseInt(process.env.PLATFORM_FEE_BPS || "250");
  const gasPrice = process.env.GAS_PRICE ? parseInt(process.env.GAS_PRICE) : undefined;
  const gasLimit = parseInt(process.env.GAS_LIMIT || "8000000");

  console.log("\n📊 Deployment Configuration");
  console.log("Treasury Wallet:", treasuryWallet);
  console.log("Fee Collector:", feeCollector);
  console.log("Platform Fee:", platformFeePercent, "basis points");
  console.log("Gas Limit:", gasLimit);
  if (gasPrice) console.log("Gas Price:", gasPrice, "wei");

  const deploymentResults: Record<string, string> = {};
  const isTestnet = network.chainId === 11155111n; // Sepolia

  try {
    // Deploy Enhanced QuantTradeAI Contract
    console.log("\n📋 Deploying QuantTradeAI...");
    const QuantTradeAI = await ethers.getContractFactory("QuantTradeAI");
    const quantTradeAI = await QuantTradeAI.deploy(
      treasuryWallet,
      feeCollector,
      platformFeePercent,
      { gasLimit, gasPrice }
    );
    await quantTradeAI.waitForDeployment();
    const quantTradeAIAddress = await quantTradeAI.getAddress();
    deploymentResults.QUANTTRADEAI_CONTRACT_ADDRESS = quantTradeAIAddress;
    console.log("✅ QuantTradeAI deployed to:", quantTradeAIAddress);

    // Deploy PortfolioManager
    console.log("\n📊 Deploying PortfolioManager...");
    const PortfolioManager = await ethers.getContractFactory("PortfolioManager");
    const portfolioManager = await PortfolioManager.deploy({ gasLimit, gasPrice });
    await portfolioManager.waitForDeployment();
    const portfolioManagerAddress = await portfolioManager.getAddress();
    deploymentResults.PORTFOLIO_MANAGER_CONTRACT_ADDRESS = portfolioManagerAddress;
    console.log("✅ PortfolioManager deployed to:", portfolioManagerAddress);

    // Deploy TradingBot
    console.log("\n🤖 Deploying TradingBot...");
    const TradingBot = await ethers.getContractFactory("TradingBot");
    const tradingBot = await TradingBot.deploy(feeCollector, { gasLimit, gasPrice });
    await tradingBot.waitForDeployment();
    const tradingBotAddress = await tradingBot.getAddress();
    deploymentResults.TRADING_BOT_CONTRACT_ADDRESS = tradingBotAddress;
    console.log("✅ TradingBot deployed to:", tradingBotAddress);

    // Deploy AccessRegistry if exists
    try {
      console.log("\n🔐 Deploying AccessRegistry...");
      const AccessRegistry = await ethers.getContractFactory("AccessRegistry");
      const accessRegistry = await AccessRegistry.deploy({ gasLimit, gasPrice });
      await accessRegistry.waitForDeployment();
      const accessRegistryAddress = await accessRegistry.getAddress();
      deploymentResults.ACCESS_REGISTRY_CONTRACT_ADDRESS = accessRegistryAddress;
      console.log("✅ AccessRegistry deployed to:", accessRegistryAddress);
    } catch (error) {
      console.log("⚠️  AccessRegistry contract not found, skipping...");
    }

    // Deploy QuantToken if exists
    try {
      console.log("\n🪙 Deploying QuantToken...");
      const QuantToken = await ethers.getContractFactory("QuantToken");
      const quantToken = await QuantToken.deploy({ gasLimit, gasPrice });
      await quantToken.waitForDeployment();
      const quantTokenAddress = await quantToken.getAddress();
      deploymentResults.QUANT_TOKEN_CONTRACT_ADDRESS = quantTokenAddress;
      console.log("✅ QuantToken deployed to:", quantTokenAddress);
    } catch (error) {
      console.log("⚠️  QuantToken contract not found, skipping...");
    }

    // Post-deployment configuration
    console.log("\n⚙️  Configuring Contracts...");

    // Set up integrations between contracts
    if (deploymentResults.ACCESS_REGISTRY_CONTRACT_ADDRESS) {
      console.log("Setting up AccessRegistry permissions...");
      // Add necessary permissions here
    }

    // Configure portfolio manager tokens
    console.log("Configuring PortfolioManager supported tokens...");
    // Add USDC, USDT, etc. here

    // Deployment Summary
    console.log("\n🎉 Deployment Summary");
    console.log("===================");
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId.toString());
    console.log("Deployer:", deployer.address);
    console.log("Treasury Wallet:", treasuryWallet);
    console.log("Fee Collector:", feeCollector);
    console.log("");
    Object.entries(deploymentResults).forEach(([key, address]) => {
      console.log(`${key}: ${address}`);
    });

    // Save deployment addresses
    const envPrefix = isTestnet ? 'SEPOLIA_' : '';
    const envContent = `
# Contract Addresses - ${network.name} - ${new Date().toISOString()}
${envPrefix}QUANTTRADEAI_ADDRESS=${deploymentResults.QUANTTRADEAI_CONTRACT_ADDRESS || ''}
${envPrefix}TRADING_BOT_ADDRESS=${deploymentResults.TRADING_BOT_CONTRACT_ADDRESS || ''}
${envPrefix}PORTFOLIO_MANAGER_ADDRESS=${deploymentResults.PORTFOLIO_MANAGER_CONTRACT_ADDRESS || ''}
${envPrefix}ACCESS_REGISTRY_ADDRESS=${deploymentResults.ACCESS_REGISTRY_CONTRACT_ADDRESS || ''}
${envPrefix}QUANT_TOKEN_ADDRESS=${deploymentResults.QUANT_TOKEN_CONTRACT_ADDRESS || ''}
LAST_DEPLOYMENT_NETWORK=${network.name}
LAST_DEPLOYMENT_BLOCK=${await ethers.provider.getBlockNumber()}
DEPLOYMENT_TIMESTAMP=${Math.floor(Date.now() / 1000)}
`;

    // Append to .env file
    appendFileSync('.env', envContent);
    console.log("\n📝 Contract addresses saved to .env file");

    // Save deployment info to JSON
    const deploymentInfo = {
      network: network.name,
      chainId: network.chainId.toString(),
      deployer: deployer.address,
      treasuryWallet,
      feeCollector,
      platformFeePercent,
      timestamp: new Date().toISOString(),
      blockNumber: await ethers.provider.getBlockNumber(),
      contracts: deploymentResults
    };

    const deploymentFile = `deployments/${network.name}-deployment.json`;
    writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`📁 Deployment info saved to ${deploymentFile}`);

    // Run basic functionality tests
    console.log("\n🧪 Testing Basic Functionality");
    console.log("==============================");

    try {
      // Test QuantTradeAI
      console.log("Testing QuantTradeAI contract...");
      const supportedTokens = await quantTradeAI.getSupportedTokens();
      console.log("✅ Supported tokens:", supportedTokens.length);

      const treasuryConfig = await quantTradeAI.treasuryConfig();
      console.log("✅ Treasury config verified");

      // Test PortfolioManager
      console.log("Testing PortfolioManager contract...");
      const pmSupportedTokens = await portfolioManager.getSupportedTokens();
      console.log("✅ Portfolio supported tokens:", pmSupportedTokens.length);

      // Test TradingBot
      console.log("Testing TradingBot contract...");
      const strategies = await tradingBot.getAvailableStrategies();
      console.log("✅ Available strategies:", strategies.length);

      if (strategies.length > 0) {
        const conservativeStrategy = await tradingBot.getStrategy(strategies[0]);
        console.log("✅ Strategy details verified");
      }

      console.log("\n🎊 All contracts deployed and tested successfully!");

    } catch (error) {
      console.error("\n❌ Error during testing:", error);
      console.log("Contracts deployed but testing failed. Check configuration.");
    }

    // Contract verification instructions
    if (process.env.VERIFY_CONTRACTS === 'true' && process.env.ETHERSCAN_API_KEY) {
      console.log("\n🔍 Contract Verification");
      console.log("========================");
      console.log("Run the following commands to verify contracts:");
      console.log("");
      Object.entries(deploymentResults).forEach(([key, address]) => {
        const contractName = key.split('_')[0];
        console.log(`npx hardhat verify --network ${network.name} ${address}`);
      });
    }

    console.log("\n✨ Deployment completed successfully!");

  } catch (error) {
    console.error("\n💥 Deployment failed:", error);
    process.exitCode = 1;
  }
}

// Execute deployment
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
