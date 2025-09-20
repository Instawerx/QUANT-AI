# MetaMaskPortfolioManager Deployment Guide

This guide explains how to deploy and customize the MetaMaskPortfolioManager contract for your QuantAI platform.

## Overview

The MetaMaskPortfolioManager contract allows users to deposit tokens and ETH, while giving administrators control over user funds for trading operations. It supports multiple ERC20 tokens and ETH deposits.

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js v18+ installed
2. **Hardhat**: Project uses Hardhat for compilation and deployment
3. **Private Key**: Set up your deployer account private key
4. **RPC URL**: Access to blockchain RPC endpoint (Infura, Alchemy, etc.)
5. **Etherscan API Key**: For contract verification (optional but recommended)

## Environment Setup

Create a `.env` file in the project root with the following variables:

```bash
# Deployment account private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs
INFURA_API_KEY=your_infura_api_key
ALCHEMY_API_KEY=your_alchemy_api_key

# For contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Gas reporting
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
REPORT_GAS=true
```

## Contract Customization

### 1. Update Initial Token Addresses

Before deployment, you **MUST** update the token addresses in `scripts/deploy_portfolio.ts`:

#### For Sepolia Testnet:
```typescript
const SEPOLIA_INITIAL_TOKENS = [
  "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // WETH on Sepolia
  "0x779877A7B0D9E8603169DdbD7836e478b4624789", // LINK on Sepolia
  // Add your token addresses here
];
```

#### For Ethereum Mainnet:
```typescript
const MAINNET_INITIAL_TOKENS = [
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b", // CRO
  // Add your token addresses here
];
```

### 2. Popular Token Addresses

#### Sepolia Testnet:
- **WETH**: `0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9`
- **LINK**: `0x779877A7B0D9E8603169DdbD7836e478b4624789`
- **USDC**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`

#### Ethereum Mainnet:
- **WETH**: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **USDC**: `0xA0b86a33E6441947C5F7c6Bb6b3f1e3F9F4e5F6`
- **USDT**: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- **DAI**: `0x6B175474E89094C44Da98b954EedeAC495271d0F`

## Deployment Instructions

### 1. Compile Contracts

```bash
npm run contracts:compile
```

### 2. Deploy to Local Network

For local development and testing:

```bash
# Start local Hardhat network
npx hardhat node

# Deploy to local network (in another terminal)
npx hardhat run scripts/deploy_portfolio.ts --network localhost
```

### 3. Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy_portfolio.ts --network sepolia
```

### 4. Deploy to Ethereum Mainnet

```bash
npx hardhat run scripts/deploy_portfolio.ts --network mainnet
```

## Contract Verification

After deployment, verify your contract on Etherscan:

```bash
# Replace with your actual deployment address and constructor args
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS '["0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9","0x779877A7B0D9E8603169DdbD7836e478b4624789"]'
```

## Post-Deployment Configuration

### 1. Update Frontend Configuration

Update your frontend contract addresses in `src/lib/contract-addresses.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  11155111: { // Sepolia
    MetaMaskPortfolioManager: "0xYourDeployedContractAddress",
    // ... other contracts
  },
  1: { // Mainnet
    MetaMaskPortfolioManager: "0xYourDeployedContractAddress",
    // ... other contracts
  }
};
```

### 2. Add New Token Support

After deployment, you can add new supported tokens by calling the `addSupportedToken` function:

```javascript
// Using ethers.js
const portfolioManager = new ethers.Contract(address, abi, signer);
await portfolioManager.addSupportedToken("0xNewTokenAddress");
```

### 3. Admin Functions

The deployer account becomes the admin and can:

- **Withdraw user tokens**: `adminWithdrawToken(token, user, amount)`
- **Withdraw user ETH**: `adminWithdrawETH(user, amount)`
- **Transfer between users**: `adminTransferToken(token, fromUser, toUser, amount)`
- **Add supported tokens**: `addSupportedToken(tokenAddress)`

## Security Considerations

1. **Admin Private Key**: Store the admin private key securely
2. **Multi-sig**: Consider using a multi-signature wallet for admin functions
3. **Auditing**: Have the contract audited before mainnet deployment
4. **Testing**: Thoroughly test all functions on testnet
5. **Token Validation**: Verify all token addresses before adding them

## Gas Optimization

The contract is optimized for gas efficiency:

- Batch token deposits in single transaction
- Efficient storage patterns
- Minimal external calls

Estimated gas costs:
- **Deployment**: ~800,000 gas
- **Token Deposit**: ~50,000 gas per token
- **ETH Deposit**: ~30,000 gas
- **Admin Withdraw**: ~40,000 gas

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run with gas reporting
npm run test:gas
```

## Troubleshooting

### Common Issues

1. **"Transfer failed"**: User hasn't approved tokens or insufficient balance
2. **"Not admin"**: Function can only be called by contract admin
3. **"Array mismatch"**: Token and amount arrays have different lengths
4. **"Insufficient balance"**: User doesn't have enough deposited funds

### Network Issues

- **Sepolia**: Ensure you have Sepolia ETH from faucets
- **Mainnet**: Double-check gas prices and account balance
- **Local**: Make sure Hardhat node is running

### Verification Issues

- Ensure constructor arguments match exactly
- Use the correct network name
- Check Etherscan API key

## Integration with QuantAI

The portfolio manager integrates with your trading system by:

1. **User Deposits**: Users deposit trading capital
2. **Admin Trading**: Admin account executes trades using user funds
3. **Balance Tracking**: System tracks individual user balances
4. **Withdrawals**: Admin can withdraw profits or return funds

## Support

For deployment issues:

1. Check the Hardhat documentation
2. Verify network configurations
3. Ensure all dependencies are installed
4. Review error messages in deployment logs

## Example Deployment Output

```json
{
  "network": {
    "name": "sepolia",
    "chainId": "11155111"
  },
  "contracts": {
    "MetaMaskPortfolioManager": "0x742d35CC6634C0532925a3b8D404f65971b1fc23"
  },
  "admin": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "initialTokens": [
    "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    "0x779877A7B0D9E8603169DdbD7836e478b4624789"
  ],
  "deploymentTime": "2024-01-15T10:30:00.000Z",
  "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
}
```

This deployment information is automatically saved to `deployments/` directory for your records.