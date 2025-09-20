import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  console.log("Deploying MetaMaskPortfolioManager contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // **IMPORTANT: Replace these placeholder addresses with actual token addresses before deployment**
  // These are example addresses for popular tokens on different networks:

  // For Sepolia testnet - replace with actual test token addresses
  const SEPOLIA_INITIAL_TOKENS = [
    "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Wrapped ETH (WETH) on Sepolia
    "0x779877A7B0D9E8603169DdbD7836e478b4624789", // ChainLink Token (LINK) on Sepolia
    // Add more token addresses as needed
  ];

  // For mainnet - replace with actual mainnet token addresses
  const MAINNET_INITIAL_TOKENS = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Wrapped ETH (WETH)
    "0xA0b86a33E6441947C5F7c6Bb6b3f1e3F9F4e5F6", // Example ERC20 token
    // Add more token addresses as needed
  ];

  // For local development/testing - deploy mock tokens
  const LOCAL_TOKENS: string[] = [];

  // Determine which token set to use based on network
  const network = await ethers.provider.getNetwork();
  let initialTokens: string[] = [];

  if (network.chainId === 11155111n) {
    // Sepolia testnet
    console.log("Deploying on Sepolia testnet");
    initialTokens = SEPOLIA_INITIAL_TOKENS;
  } else if (network.chainId === 1n) {
    // Ethereum mainnet
    console.log("Deploying on Ethereum mainnet");
    initialTokens = MAINNET_INITIAL_TOKENS;
  } else {
    // Local development or other networks
    console.log("Deploying on local/development network");
    console.log("Deploying mock tokens for testing...");

    // Deploy mock tokens for local testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");

    const mockToken1 = await MockERC20.deploy("Test Token 1", "TEST1", 18);
    await mockToken1.waitForDeployment();
    console.log("Mock Token 1 deployed to:", await mockToken1.getAddress());

    const mockToken2 = await MockERC20.deploy("Test Token 2", "TEST2", 18);
    await mockToken2.waitForDeployment();
    console.log("Mock Token 2 deployed to:", await mockToken2.getAddress());

    initialTokens = [
      await mockToken1.getAddress(),
      await mockToken2.getAddress()
    ];

    // Mint some tokens to deployer for testing
    const mintAmount = ethers.parseEther("1000000");
    await mockToken1.mint(deployer.address, mintAmount);
    await mockToken2.mint(deployer.address, mintAmount);
    console.log("Minted test tokens to deployer");
  }

  console.log("Initial supported tokens:", initialTokens);

  // Deploy the MetaMaskPortfolioManager contract
  const MetaMaskPortfolioManager = await ethers.getContractFactory("MetaMaskPortfolioManager");
  const portfolioManager = await MetaMaskPortfolioManager.deploy(initialTokens);

  await portfolioManager.waitForDeployment();
  const portfolioManagerAddress = await portfolioManager.getAddress();

  console.log("MetaMaskPortfolioManager deployed to:", portfolioManagerAddress);
  console.log("Admin address:", deployer.address);
  console.log("Supported tokens:", await portfolioManager.getSupportedTokens());

  // Save deployment information
  const deploymentInfo = {
    network: {
      name: network.name,
      chainId: network.chainId.toString()
    },
    contracts: {
      MetaMaskPortfolioManager: portfolioManagerAddress,
    },
    admin: deployer.address,
    initialTokens: initialTokens,
    deploymentTime: new Date().toISOString(),
    deployer: deployer.address
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verification instructions
  console.log("\n=== Verification Instructions ===");
  if (network.chainId === 11155111n || network.chainId === 1n) {
    console.log(`To verify on Etherscan, run:`);
    console.log(`npx hardhat verify --network ${network.name} ${portfolioManagerAddress} '${JSON.stringify(initialTokens)}'`);
  }

  console.log("\n=== Important Notes ===");
  console.log("1. The admin of this contract is:", deployer.address);
  console.log("2. Only the admin can perform administrative functions");
  console.log("3. Users can deposit tokens and ETH to this contract");
  console.log("4. Admin can withdraw and transfer user funds");
  console.log("5. Make sure to update the frontend with the new contract address");

  // Save deployment info to file for reference
  const fs = require('fs');
  const path = require('path');

  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `portfolio-manager-${network.chainId}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${filepath}`);

  return {
    portfolioManager,
    deploymentInfo
  };
}

// Error handling
main()
  .then((result) => {
    console.log("\n✅ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });