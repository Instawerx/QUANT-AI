// Smart contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Hardhat local network
  31337: {
    QuantToken: '',
    AccessRegistry: '',
    QuantTradeAI: '',
  },
  // Sepolia testnet
  11155111: {
    QuantToken: process.env.NEXT_PUBLIC_QUANT_TOKEN_ADDRESS || '',
    AccessRegistry: process.env.NEXT_PUBLIC_ACCESS_REGISTRY_ADDRESS || '',
    QuantTradeAI: process.env.NEXT_PUBLIC_QUANT_TRADE_AI_ADDRESS || '',
  },
};

export function getContractAddress(chainId: number, contractName: keyof typeof CONTRACT_ADDRESSES[31337]) {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return addresses[contractName];
}