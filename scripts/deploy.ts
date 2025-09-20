import { ethers } from "hardhat";

async function main() {
  console.log("Deploying QuantTradeAI contract...");
  
  // Get the contract factory
  const QuantTradeAI = await ethers.getContractFactory("QuantTradeAI");
  
  // Deploy the contract
  const quantTradeAI = await QuantTradeAI.deploy();
  
  // Wait for deployment to complete
  await quantTradeAI.waitForDeployment();
  
  console.log(`QuantTradeAI deployed to: ${await quantTradeAI.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
