import { ethers, Contract, Wallet } from 'ethers';
import { config } from '@/utils/config';
import { log } from '@/utils/logger';
import { ContractTransaction, UserBalance, PortfolioManagerConfig } from '@/types';

// MetaMaskPortfolioManager ABI
const PORTFOLIO_MANAGER_ABI = [
  'function depositTokens(address[] calldata tokens, uint256[] calldata amounts) external',
  'function depositETH() external payable',
  'function adminWithdrawToken(address token, address user, uint256 amount) external',
  'function adminWithdrawETH(address user, uint256 amount) external',
  'function adminTransferToken(address token, address fromUser, address toUser, uint256 amount) external',
  'function getUserBalance(address user, address token) external view returns (uint256)',
  'function addSupportedToken(address token) external',
  'function getSupportedTokens() external view returns (address[] memory)',
  'function admin() external view returns (address)',
  'event TokenDeposited(address indexed user, address indexed token, uint256 amount)',
  'event ETHDeposited(address indexed user, uint256 amount)',
  'event AdminWithdrawToken(address indexed admin, address indexed user, address indexed token, uint256 amount)',
  'event AdminWithdrawETH(address indexed admin, address indexed user, uint256 amount)',
];

// ERC20 ABI for token interactions
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

export class PortfolioManagerService {
  private provider: ethers.JsonRpcProvider;
  private wallet: Wallet;
  private contract: Contract;
  private config: PortfolioManagerConfig;

  constructor() {
    this.config = {
      contractAddress: config.contracts.portfolioManager,
      supportedTokens: config.contracts.supportedTokens,
      networkRpcUrl: config.blockchain.networkRpcUrl,
      chainId: config.blockchain.chainId,
    };

    this.initializeProvider();
    this.initializeWallet();
    this.initializeContract();
  }

  private initializeProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(this.config.networkRpcUrl);
      log.info('Blockchain provider initialized', {
        rpcUrl: this.config.networkRpcUrl,
        chainId: this.config.chainId,
      });
    } catch (error) {
      log.error('Failed to initialize provider', { error });
      throw error;
    }
  }

  private initializeWallet() {
    try {
      this.wallet = new ethers.Wallet(config.blockchain.privateKey, this.provider);
      log.info('Wallet initialized', { address: this.wallet.address });
    } catch (error) {
      log.error('Failed to initialize wallet', { error });
      throw error;
    }
  }

  private initializeContract() {
    try {
      this.contract = new ethers.Contract(
        this.config.contractAddress,
        PORTFOLIO_MANAGER_ABI,
        this.wallet
      );
      log.info('Portfolio manager contract initialized', {
        address: this.config.contractAddress,
      });
    } catch (error) {
      log.error('Failed to initialize contract', { error });
      throw error;
    }
  }

  // Get contract instance for read-only operations
  getReadOnlyContract() {
    return new ethers.Contract(
      this.config.contractAddress,
      PORTFOLIO_MANAGER_ABI,
      this.provider
    );
  }

  // Get ERC20 token contract
  getTokenContract(tokenAddress: string) {
    return new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
  }

  // Admin deposit tokens for a user
  async depositTokens(userAddress: string, tokens: string[], amounts: string[]): Promise<ContractTransaction> {
    try {
      if (tokens.length !== amounts.length) {
        throw new Error('Tokens and amounts arrays must have the same length');
      }

      // Convert amounts to BigInt
      const amountsBigInt = amounts.map(amount => ethers.parseEther(amount));

      const tx = await this.contract.depositTokens(tokens, amountsBigInt);

      log.contract(this.config.contractAddress, 'depositTokens', tx.hash, {
        userAddress,
        tokens,
        amounts,
      });

      return {
        hash: tx.hash,
        status: 'pending',
      };
    } catch (error) {
      log.error('Failed to deposit tokens', { userAddress, tokens, amounts, error });
      throw error;
    }
  }

  // Admin deposit ETH for a user
  async depositETH(userAddress: string, amount: string): Promise<ContractTransaction> {
    try {
      const amountWei = ethers.parseEther(amount);

      const tx = await this.contract.depositETH({ value: amountWei });

      log.contract(this.config.contractAddress, 'depositETH', tx.hash, {
        userAddress,
        amount,
      });

      return {
        hash: tx.hash,
        status: 'pending',
      };
    } catch (error) {
      log.error('Failed to deposit ETH', { userAddress, amount, error });
      throw error;
    }
  }

  // Admin withdraw tokens from user
  async adminWithdrawToken(tokenAddress: string, userAddress: string, amount: string): Promise<ContractTransaction> {
    try {
      const amountWei = ethers.parseEther(amount);

      const tx = await this.contract.adminWithdrawToken(tokenAddress, userAddress, amountWei);

      log.contract(this.config.contractAddress, 'adminWithdrawToken', tx.hash, {
        tokenAddress,
        userAddress,
        amount,
      });

      return {
        hash: tx.hash,
        status: 'pending',
      };
    } catch (error) {
      log.error('Failed to withdraw token', { tokenAddress, userAddress, amount, error });
      throw error;
    }
  }

  // Admin withdraw ETH from user
  async adminWithdrawETH(userAddress: string, amount: string): Promise<ContractTransaction> {
    try {
      const amountWei = ethers.parseEther(amount);

      const tx = await this.contract.adminWithdrawETH(userAddress, amountWei);

      log.contract(this.config.contractAddress, 'adminWithdrawETH', tx.hash, {
        userAddress,
        amount,
      });

      return {
        hash: tx.hash,
        status: 'pending',
      };
    } catch (error) {
      log.error('Failed to withdraw ETH', { userAddress, amount, error });
      throw error;
    }
  }

  // Admin transfer tokens between users
  async adminTransferToken(tokenAddress: string, fromUser: string, toUser: string, amount: string): Promise<ContractTransaction> {
    try {
      const amountWei = ethers.parseEther(amount);

      const tx = await this.contract.adminTransferToken(tokenAddress, fromUser, toUser, amountWei);

      log.contract(this.config.contractAddress, 'adminTransferToken', tx.hash, {
        tokenAddress,
        fromUser,
        toUser,
        amount,
      });

      return {
        hash: tx.hash,
        status: 'pending',
      };
    } catch (error) {
      log.error('Failed to transfer token', { tokenAddress, fromUser, toUser, amount, error });
      throw error;
    }
  }

  // Get user balance for a specific token
  async getUserBalance(userAddress: string, tokenAddress: string): Promise<string> {
    try {
      const readOnlyContract = this.getReadOnlyContract();
      const balance = await readOnlyContract.getUserBalance(userAddress, tokenAddress);

      return ethers.formatEther(balance);
    } catch (error) {
      log.error('Failed to get user balance', { userAddress, tokenAddress, error });
      throw error;
    }
  }

  // Get all user balances
  async getAllUserBalances(userAddress: string): Promise<UserBalance[]> {
    try {
      const balances: UserBalance[] = [];

      // Get ETH balance (address(0))
      const ethBalance = await this.getUserBalance(userAddress, ethers.ZeroAddress);
      balances.push({
        token: ethers.ZeroAddress,
        balance: ethBalance,
        symbol: 'ETH',
        decimals: 18,
      });

      // Get token balances
      for (const tokenAddress of this.config.supportedTokens) {
        try {
          const balance = await this.getUserBalance(userAddress, tokenAddress);
          const tokenContract = this.getTokenContract(tokenAddress);

          const [symbol, decimals] = await Promise.all([
            tokenContract.symbol(),
            tokenContract.decimals(),
          ]);

          balances.push({
            token: tokenAddress,
            balance,
            symbol,
            decimals: Number(decimals),
          });
        } catch (tokenError) {
          log.warn('Failed to get balance for token', { tokenAddress, tokenError });
          // Continue with other tokens
        }
      }

      return balances;
    } catch (error) {
      log.error('Failed to get all user balances', { userAddress, error });
      throw error;
    }
  }

  // Get supported tokens
  async getSupportedTokens(): Promise<string[]> {
    try {
      const readOnlyContract = this.getReadOnlyContract();
      const tokens = await readOnlyContract.getSupportedTokens();
      return tokens;
    } catch (error) {
      log.error('Failed to get supported tokens', { error });
      throw error;
    }
  }

  // Add supported token (admin only)
  async addSupportedToken(tokenAddress: string): Promise<ContractTransaction> {
    try {
      const tx = await this.contract.addSupportedToken(tokenAddress);

      log.contract(this.config.contractAddress, 'addSupportedToken', tx.hash, {
        tokenAddress,
      });

      return {
        hash: tx.hash,
        status: 'pending',
      };
    } catch (error) {
      log.error('Failed to add supported token', { tokenAddress, error });
      throw error;
    }
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash: string) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      log.error('Failed to get transaction receipt', { txHash, error });
      throw error;
    }
  }

  // Wait for transaction confirmation
  async waitForTransaction(txHash: string, confirmations: number = 1) {
    try {
      const receipt = await this.provider.waitForTransaction(txHash, confirmations);
      return receipt;
    } catch (error) {
      log.error('Failed to wait for transaction', { txHash, confirmations, error });
      throw error;
    }
  }

  // Get contract admin address
  async getAdmin(): Promise<string> {
    try {
      const readOnlyContract = this.getReadOnlyContract();
      const admin = await readOnlyContract.admin();
      return admin;
    } catch (error) {
      log.error('Failed to get contract admin', { error });
      throw error;
    }
  }

  // Check if current wallet is admin
  async isAdmin(): Promise<boolean> {
    try {
      const adminAddress = await this.getAdmin();
      return adminAddress.toLowerCase() === this.wallet.address.toLowerCase();
    } catch (error) {
      log.error('Failed to check admin status', { error });
      return false;
    }
  }
}

export const portfolioManagerService = new PortfolioManagerService();