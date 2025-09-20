import { PortfolioManagerService } from '../src/services/contract';
import { ethers } from 'ethers';

// Mock the config import
jest.mock('../src/utils/config', () => ({
  config: {
    contracts: {
      portfolioManager: '0x1234567890123456789012345678901234567890',
      supportedTokens: ['0x2222222222222222222222222222222222222222'],
    },
    blockchain: {
      networkRpcUrl: 'http://localhost:8545',
      privateKey: '0x0000000000000000000000000000000000000000000000000000000000000001',
      chainId: 1337,
    },
  },
}));

describe('PortfolioManagerService', () => {
  let service: PortfolioManagerService;
  let mockContract: any;
  let mockProvider: any;
  let mockWallet: any;

  beforeEach(() => {
    // Mock ethers components
    mockContract = {
      depositTokens: jest.fn(),
      depositETH: jest.fn(),
      adminWithdrawToken: jest.fn(),
      adminWithdrawETH: jest.fn(),
      adminTransferToken: jest.fn(),
      getUserBalance: jest.fn(),
      getSupportedTokens: jest.fn(),
      addSupportedToken: jest.fn(),
      admin: jest.fn(),
    };

    mockProvider = {
      getTransactionReceipt: jest.fn(),
      waitForTransaction: jest.fn(),
    };

    mockWallet = {
      address: '0xadmin123456789012345678901234567890',
    };

    // Mock ethers constructors
    (ethers.JsonRpcProvider as jest.Mock).mockReturnValue(mockProvider);
    (ethers.Wallet as jest.Mock).mockReturnValue(mockWallet);
    (ethers.Contract as jest.Mock).mockReturnValue(mockContract);

    service = new PortfolioManagerService();
  });

  describe('depositTokens', () => {
    it('should deposit tokens successfully', async () => {
      const userAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
      const tokens = ['0x2222222222222222222222222222222222222222'];
      const amounts = ['100.0'];

      mockContract.depositTokens.mockResolvedValue({
        hash: '0xabcdef123456789',
      });

      const result = await service.depositTokens(userAddress, tokens, amounts);

      expect(result.hash).toBe('0xabcdef123456789');
      expect(result.status).toBe('pending');
      expect(mockContract.depositTokens).toHaveBeenCalledWith(
        tokens,
        amounts.map(amount => amount) // Mock parseEther returns the same value
      );
    });

    it('should reject mismatched array lengths', async () => {
      const userAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
      const tokens = ['0x2222222222222222222222222222222222222222'];
      const amounts = ['100.0', '200.0']; // Different length

      await expect(
        service.depositTokens(userAddress, tokens, amounts)
      ).rejects.toThrow('Tokens and amounts arrays must have the same length');
    });
  });

  describe('depositETH', () => {
    it('should deposit ETH successfully', async () => {
      const userAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
      const amount = '1.5';

      mockContract.depositETH.mockResolvedValue({
        hash: '0xabcdef123456789',
      });

      const result = await service.depositETH(userAddress, amount);

      expect(result.hash).toBe('0xabcdef123456789');
      expect(result.status).toBe('pending');
      expect(mockContract.depositETH).toHaveBeenCalledWith({
        value: amount, // Mock parseEther returns the same value
      });
    });
  });

  describe('adminWithdrawToken', () => {
    it('should withdraw tokens successfully', async () => {
      const tokenAddress = '0x2222222222222222222222222222222222222222';
      const userAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
      const amount = '50.0';

      mockContract.adminWithdrawToken.mockResolvedValue({
        hash: '0xabcdef123456789',
      });

      const result = await service.adminWithdrawToken(tokenAddress, userAddress, amount);

      expect(result.hash).toBe('0xabcdef123456789');
      expect(result.status).toBe('pending');
      expect(mockContract.adminWithdrawToken).toHaveBeenCalledWith(
        tokenAddress,
        userAddress,
        amount // Mock parseEther returns the same value
      );
    });
  });

  describe('adminWithdrawETH', () => {
    it('should withdraw ETH successfully', async () => {
      const userAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
      const amount = '0.5';

      mockContract.adminWithdrawETH.mockResolvedValue({
        hash: '0xabcdef123456789',
      });

      const result = await service.adminWithdrawETH(userAddress, amount);

      expect(result.hash).toBe('0xabcdef123456789');
      expect(result.status).toBe('pending');
      expect(mockContract.adminWithdrawETH).toHaveBeenCalledWith(
        userAddress,
        amount // Mock parseEther returns the same value
      );
    });
  });

  describe('adminTransferToken', () => {
    it('should transfer tokens between users successfully', async () => {
      const tokenAddress = '0x2222222222222222222222222222222222222222';
      const fromUser = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
      const toUser = '0x3333333333333333333333333333333333333333';
      const amount = '25.0';

      mockContract.adminTransferToken.mockResolvedValue({
        hash: '0xabcdef123456789',
      });

      const result = await service.adminTransferToken(tokenAddress, fromUser, toUser, amount);

      expect(result.hash).toBe('0xabcdef123456789');
      expect(result.status).toBe('pending');
      expect(mockContract.adminTransferToken).toHaveBeenCalledWith(
        tokenAddress,
        fromUser,
        toUser,
        amount // Mock parseEther returns the same value
      );
    });
  });

  describe('getUserBalance', () => {
    it('should get user balance successfully', async () => {
      const userAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
      const tokenAddress = '0x2222222222222222222222222222222222222222';

      // Mock read-only contract
      const mockReadOnlyContract = {
        getUserBalance: jest.fn().mockResolvedValue('100.5'),
      };

      (ethers.Contract as jest.Mock).mockReturnValue(mockReadOnlyContract);

      const result = await service.getUserBalance(userAddress, tokenAddress);

      expect(result).toBe('100.5'); // Mock formatEther returns the same value
      expect(mockReadOnlyContract.getUserBalance).toHaveBeenCalledWith(userAddress, tokenAddress);
    });
  });

  describe('getAllUserBalances', () => {
    it('should get all user balances successfully', async () => {
      const userAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';

      // Mock read-only contract for balance queries
      const mockReadOnlyContract = {
        getUserBalance: jest.fn()
          .mockResolvedValueOnce('1.5') // ETH balance
          .mockResolvedValueOnce('100.0'), // Token balance
      };

      // Mock token contract
      const mockTokenContract = {
        symbol: jest.fn().mockResolvedValue('TEST'),
        decimals: jest.fn().mockResolvedValue(18),
      };

      (ethers.Contract as jest.Mock)
        .mockReturnValueOnce(mockReadOnlyContract) // First call for portfolio manager
        .mockReturnValueOnce(mockTokenContract); // Second call for token contract

      const result = await service.getAllUserBalances(userAddress);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        token: ethers.ZeroAddress,
        balance: '1.5',
        symbol: 'ETH',
        decimals: 18,
      });
      expect(result[1]).toEqual({
        token: '0x2222222222222222222222222222222222222222',
        balance: '100.0',
        symbol: 'TEST',
        decimals: 18,
      });
    });
  });

  describe('getSupportedTokens', () => {
    it('should get supported tokens successfully', async () => {
      const mockTokens = ['0x2222222222222222222222222222222222222222'];

      const mockReadOnlyContract = {
        getSupportedTokens: jest.fn().mockResolvedValue(mockTokens),
      };

      (ethers.Contract as jest.Mock).mockReturnValue(mockReadOnlyContract);

      const result = await service.getSupportedTokens();

      expect(result).toEqual(mockTokens);
      expect(mockReadOnlyContract.getSupportedTokens).toHaveBeenCalled();
    });
  });

  describe('addSupportedToken', () => {
    it('should add supported token successfully', async () => {
      const tokenAddress = '0x5555555555555555555555555555555555555555';

      mockContract.addSupportedToken.mockResolvedValue({
        hash: '0xabcdef123456789',
      });

      const result = await service.addSupportedToken(tokenAddress);

      expect(result.hash).toBe('0xabcdef123456789');
      expect(result.status).toBe('pending');
      expect(mockContract.addSupportedToken).toHaveBeenCalledWith(tokenAddress);
    });
  });

  describe('getTransactionReceipt', () => {
    it('should get transaction receipt successfully', async () => {
      const txHash = '0xabcdef123456789';
      const mockReceipt = {
        status: 1,
        blockNumber: 12345,
        gasUsed: BigInt(21000),
      };

      mockProvider.getTransactionReceipt.mockResolvedValue(mockReceipt);

      const result = await service.getTransactionReceipt(txHash);

      expect(result).toEqual(mockReceipt);
      expect(mockProvider.getTransactionReceipt).toHaveBeenCalledWith(txHash);
    });
  });

  describe('waitForTransaction', () => {
    it('should wait for transaction confirmation', async () => {
      const txHash = '0xabcdef123456789';
      const confirmations = 2;
      const mockReceipt = {
        status: 1,
        blockNumber: 12345,
      };

      mockProvider.waitForTransaction.mockResolvedValue(mockReceipt);

      const result = await service.waitForTransaction(txHash, confirmations);

      expect(result).toEqual(mockReceipt);
      expect(mockProvider.waitForTransaction).toHaveBeenCalledWith(txHash, confirmations);
    });
  });

  describe('getAdmin', () => {
    it('should get contract admin address', async () => {
      const adminAddress = '0xadmin123456789012345678901234567890';

      const mockReadOnlyContract = {
        admin: jest.fn().mockResolvedValue(adminAddress),
      };

      (ethers.Contract as jest.Mock).mockReturnValue(mockReadOnlyContract);

      const result = await service.getAdmin();

      expect(result).toBe(adminAddress);
      expect(mockReadOnlyContract.admin).toHaveBeenCalled();
    });
  });

  describe('isAdmin', () => {
    it('should return true if wallet is admin', async () => {
      const adminAddress = '0xadmin123456789012345678901234567890';

      const mockReadOnlyContract = {
        admin: jest.fn().mockResolvedValue(adminAddress),
      };

      (ethers.Contract as jest.Mock).mockReturnValue(mockReadOnlyContract);

      const result = await service.isAdmin();

      expect(result).toBe(true);
    });

    it('should return false if wallet is not admin', async () => {
      const adminAddress = '0xotheradmin1234567890123456789012345';

      const mockReadOnlyContract = {
        admin: jest.fn().mockResolvedValue(adminAddress),
      };

      (ethers.Contract as jest.Mock).mockReturnValue(mockReadOnlyContract);

      const result = await service.isAdmin();

      expect(result).toBe(false);
    });
  });
});