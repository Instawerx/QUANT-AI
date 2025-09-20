import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import "hardhat-gas-reporter";
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        accountsBalance: "10000000000000000000000", // 10,000 ETH
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || process.env.INFURA_API_KEY
        ? `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
        : "https://sepolia.infura.io/v3/demo",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 66
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 11155111,
      gasPrice: 20000000000, // 20 gwei
      gas: 8000000,
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || process.env.INFURA_API_KEY
        ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        : "https://mainnet.infura.io/v3/demo",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 66
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 1,
      gasPrice: 30000000000, // 30 gwei
      gas: 8000000,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};

export default config;
