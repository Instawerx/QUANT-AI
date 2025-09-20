import hre from "hardhat";

async function main() {
  console.log("🔍 Verifying contracts on Etherscan...");

  // Contract addresses (replace with actual deployed addresses)
  const contracts = {
    accessRegistry: process.env.ACCESS_REGISTRY_ADDRESS || "",
    quantToken: process.env.QUANT_TOKEN_ADDRESS || "",
    quantTradeAI: process.env.QUANT_TRADE_AI_ADDRESS || "",
  };

  const [deployer] = await hre.ethers.getSigners();

  try {
    // Verify AccessRegistry
    if (contracts.accessRegistry) {
      console.log(`\n📋 Verifying AccessRegistry at ${contracts.accessRegistry}...`);
      await hre.run("verify:verify", {
        address: contracts.accessRegistry,
        constructorArguments: [deployer.address],
      });
      console.log("✅ AccessRegistry verified!");
    }

    // Verify QuantToken
    if (contracts.quantToken) {
      console.log(`\n🪙 Verifying QuantToken at ${contracts.quantToken}...`);
      await hre.run("verify:verify", {
        address: contracts.quantToken,
        constructorArguments: [deployer.address],
      });
      console.log("✅ QuantToken verified!");
    }

    // Verify QuantTradeAI
    if (contracts.quantTradeAI) {
      console.log(`\n🤖 Verifying QuantTradeAI at ${contracts.quantTradeAI}...`);
      await hre.run("verify:verify", {
        address: contracts.quantTradeAI,
        constructorArguments: [],
      });
      console.log("✅ QuantTradeAI verified!");
    }

    console.log("\n🎉 All contracts verified successfully!");

  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});