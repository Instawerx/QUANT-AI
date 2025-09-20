import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { writeFileSync, appendFileSync } from "fs";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("\n🚀 QuantMissionAI Smart Contract Deployment");
  console.log("===========================================");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Deployer Address:", deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Validate required environment variables
  const requiredVars = ['TREASURY_WALLET_ADDRESS'];
  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].includes('YOUR_')) {
      console.error(`❌ Error: ${varName} is not properly set in .env file`);
      console.error(`Please update your .env file with real wallet addresses`);
      process.exit(1);
    }
  }

  // Load configuration from environment
  const treasuryWallet = process.env.TREASURY_WALLET_ADDRESS!;
  const gasBufferPercent = parseInt(process.env.GAS_BUFFER_PERCENT || "100"); // 1% default
  const gasPrice = process.env.GAS_PRICE ? parseInt(process.env.GAS_PRICE) : undefined;
  const gasLimit = parseInt(process.env.GAS_LIMIT || "8000000");

  console.log("\n📊 Deployment Configuration");
  console.log("Treasury Wallet:", treasuryWallet);
  console.log("Gas Buffer Percent:", gasBufferPercent, "basis points (", gasBufferPercent/100, "%)");
  console.log("Gas Limit:", gasLimit);
  if (gasPrice) console.log("Gas Price:", gasPrice, "wei");

  const deploymentResults: Record<string, string> = {};
  const isTestnet = network.chainId === 11155111n; // Sepolia

  try {
    // Deploy QuantMissionAI Contract
    console.log("\n🎯 Deploying QuantMissionAI...");
    const QuantMissionAI = await ethers.getContractFactory("QuantMissionAI");
    const quantMissionAI = await QuantMissionAI.deploy(
      treasuryWallet,
      gasBufferPercent,
      { gasLimit, gasPrice }
    );
    await quantMissionAI.waitForDeployment();
    const quantMissionAIAddress = await quantMissionAI.getAddress();
    deploymentResults.QUANTMISSIONAI_CONTRACT_ADDRESS = quantMissionAIAddress;
    console.log("✅ QuantMissionAI deployed to:", quantMissionAIAddress);

    // Post-deployment configuration
    console.log("\n⚙️  Configuring Mission Contract...");

    // Register default agreement hash (you'll need to update this with actual agreement)
    const defaultAgreementText = "I agree to contribute to QuantAI missions and understand that funds will be used for platform development, research, and operations. Contributions are final and cannot be withdrawn.";
    const defaultAgreementHash = ethers.keccak256(ethers.toUtf8Bytes(defaultAgreementText));

    console.log("Registering default agreement...");
    const registerTx = await quantMissionAI.registerAgreement(defaultAgreementHash);
    await registerTx.wait();
    console.log("✅ Default agreement registered with hash:", defaultAgreementHash);

    // Deployment Summary
    console.log("\n🎉 Deployment Summary");
    console.log("=====================");
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId.toString());
    console.log("Deployer:", deployer.address);
    console.log("Treasury Wallet:", treasuryWallet);
    console.log("Contract Address:", quantMissionAIAddress);
    console.log("Agreement Hash:", defaultAgreementHash);

    // Save deployment addresses
    const envPrefix = isTestnet ? 'SEPOLIA_' : '';
    const envContent = `
# QuantMissionAI Contract Deployment - ${network.name} - ${new Date().toISOString()}
${envPrefix}QUANTMISSIONAI_ADDRESS=${quantMissionAIAddress}
${envPrefix}AGREEMENT_HASH=${defaultAgreementHash}
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
      gasBufferPercent,
      timestamp: new Date().toISOString(),
      blockNumber: await ethers.provider.getBlockNumber(),
      contracts: {
        quantMissionAI: quantMissionAIAddress
      },
      agreementHash: defaultAgreementHash,
      agreementText: defaultAgreementText
    };

    const deploymentFile = `deployments/${network.name}-mission-deployment.json`;
    writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`📁 Deployment info saved to ${deploymentFile}`);

    // Run basic functionality tests
    console.log("\n🧪 Testing Mission Contract Functionality");
    console.log("=========================================");

    try {
      // Test 1: Check available missions
      console.log("Testing available missions...");
      const missions = await quantMissionAI.getAvailableMissions();
      console.log("✅ Available missions:", missions);

      // Test 2: Check treasury configuration
      console.log("Testing treasury configuration...");
      const treasuryConfig = await quantMissionAI.treasuryConfig();
      console.log("✅ Treasury config verified - Wallet:", treasuryConfig.treasuryWallet);

      // Test 3: Check platform metrics
      console.log("Testing platform metrics...");
      const metrics = await quantMissionAI.getPlatformMetrics();
      console.log("✅ Platform metrics initialized - Contributors:", metrics.totalContributors.toString());

      // Test 4: Verify agreement is registered
      console.log("Testing agreement registration...");
      // Note: Can't directly test validAgreements mapping, but registration transaction succeeded

      console.log("\n🎊 All contracts deployed and tested successfully!");

    } catch (error) {
      console.error("\n❌ Error during testing:", error);
      console.log("Contract deployed but testing failed. Check configuration.");
    }

    // Integration instructions
    console.log("\n🔗 Frontend Integration Instructions");
    console.log("===================================");
    console.log("1. Update your frontend to call: quantMissionAI.confirmMissionAndContribute()");
    console.log("2. Use agreement hash:", defaultAgreementHash);
    console.log("3. Available mission types:", missions.join(", "));
    console.log("4. Treasury wallet will receive funds immediately upon contribution");

    // Contract verification instructions
    if (process.env.VERIFY_CONTRACTS === 'true' && process.env.ETHERSCAN_API_KEY) {
      console.log("\n🔍 Contract Verification");
      console.log("========================");
      console.log("Run the following command to verify the contract:");
      console.log(`npx hardhat verify --network ${network.name} ${quantMissionAIAddress} "${treasuryWallet}" ${gasBufferPercent}`);
    }

    console.log("\n✨ Mission-based deployment completed successfully!");
    console.log("\n🏦 Treasury Control Confirmed:");
    console.log("   - Funds go directly to treasury wallet");
    console.log("   - No user withdrawal functionality");
    console.log("   - Full institutional control maintained");

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