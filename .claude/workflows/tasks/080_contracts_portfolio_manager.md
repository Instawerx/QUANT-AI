Agent: solidity
Goal: Integrate and prepare the MetaMaskPortfolioManager contract for deployment.

Steps:
- Ensure `contracts/MetaMaskPortfolioManager.sol` exists in the repository. Do not overwrite existing code; treat it as a template.
- Add the contract to Hardhat's compilation pipeline and update `hardhat.config.ts` if necessary.
- Write unit tests exercising `depositTokens`, `depositETH`, `adminWithdrawToken`, `adminWithdrawETH`, `adminTransferToken`, `getUserBalance`, `addSupportedToken`, and `getSupportedTokens`. Use mocks for ERC20 tokens.
- Create a deployment script (e.g. `scripts/deploy_portfolio.ts`) that deploys the contract with a constructor array of supported tokens (placeholders) and outputs the deployed address.
- **Important:** The constructor parameter `initialTokens` and all address placeholders (supported tokens and admin) must be replaced with actual addresses during deployment. Document where to update them.
- Ensure tests pass (using `pnpm test` or `npx hardhat test`) and compile without errors.
- Document instructions for customizing and deploying on Sepolia or a chosen testnet with Etherscan verification.

