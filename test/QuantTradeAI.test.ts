import { expect } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { QuantTradeAI, MockERC20 } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = hre;

describe("QuantTradeAI Enhanced", function () {
  // Contracts
  let quantTradeAI: QuantTradeAI;
  let mockToken: MockERC20;

  // Test accounts
  let owner: SignerWithAddress;
  let treasury: SignerWithAddress;
  let feeCollector: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let operator: SignerWithAddress;

  // Test constants
  const PLATFORM_FEE = 250; // 2.5%
  const BASIS_POINTS = 10000;
  const MIN_DEPOSIT = ethers.parseEther("0.001");
  const MAX_DEPOSIT = ethers.parseEther("1000");

  async function deployQuantTradeAIFixture() {
    const [owner, treasury, feeCollector, user1, user2, operator] = await ethers.getSigners();

    // Deploy QuantTradeAI with treasury integration
    const QuantTradeAIFactory = await ethers.getContractFactory("QuantTradeAI");
    const quantTradeAI = await QuantTradeAIFactory.deploy(
      treasury.address,
      feeCollector.address,
      PLATFORM_FEE
    );
    await quantTradeAI.waitForDeployment();

    // Deploy mock ERC20 token for testing
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy(
      "Mock Token",
      "MOCK",
      ethers.parseEther("1000000")
    );
    await mockToken.waitForDeployment();

    // Add mock token as supported
    await quantTradeAI.addSupportedToken(await mockToken.getAddress());

    // Authorize operator
    await quantTradeAI.setOperatorAuthorization(operator.address, true);

    return { quantTradeAI, mockToken, owner, treasury, feeCollector, user1, user2, operator };
  }

  beforeEach(async function () {
    const fixture = await loadFixture(deployQuantTradeAIFixture);
    quantTradeAI = fixture.quantTradeAI;
    mockToken = fixture.mockToken;
    owner = fixture.owner;
    treasury = fixture.treasury;
    feeCollector = fixture.feeCollector;
    user1 = fixture.user1;
    user2 = fixture.user2;
    operator = fixture.operator;
  });

  describe("Deployment & Configuration", function () {
    it("Should set the correct owner", async function () {
      expect(await quantTradeAI.owner()).to.equal(owner.address);
    });

    it("Should set the correct treasury configuration", async function () {
      const config = await quantTradeAI.treasuryConfig();
      expect(config.treasuryWallet).to.equal(treasury.address);
      expect(config.feeCollector).to.equal(feeCollector.address);
      expect(config.platformFeePercent).to.equal(PLATFORM_FEE);
      expect(config.feeCollectionActive).to.be.true;
    });

    it("Should have ETH as supported token by default", async function () {
      const supportedTokens = await quantTradeAI.getSupportedTokens();
      expect(supportedTokens).to.include(ethers.ZeroAddress);
    });

    it("Should reject deployment with zero addresses", async function () {
      const QuantTradeAIFactory = await ethers.getContractFactory("QuantTradeAI");

      await expect(
        QuantTradeAIFactory.deploy(ethers.ZeroAddress, feeCollector.address, PLATFORM_FEE)
      ).to.be.revertedWithCustomError(quantTradeAI, "InvalidTreasuryAddress");

      await expect(
        QuantTradeAIFactory.deploy(treasury.address, ethers.ZeroAddress, PLATFORM_FEE)
      ).to.be.revertedWithCustomError(quantTradeAI, "InvalidTreasuryAddress");
    });
  });

  describe("ETH Deposits with Fees", function () {
    it("Should allow ETH deposits with correct fee collection", async function () {
      const depositAmount = ethers.parseEther("1.0");
      const expectedFee = (depositAmount * BigInt(PLATFORM_FEE)) / BigInt(BASIS_POINTS);
      const expectedDepositAmount = depositAmount - expectedFee;

      const feeCollectorBalanceBefore = await ethers.provider.getBalance(feeCollector.address);

      await expect(
        quantTradeAI.connect(user1).depositETH({ value: depositAmount })
      ).to.emit(quantTradeAI, "Deposited")
        .withArgs(user1.address, ethers.ZeroAddress, expectedDepositAmount, expectedFee);

      // Check user balance
      expect(await quantTradeAI.getUserBalance(user1.address, ethers.ZeroAddress))
        .to.equal(expectedDepositAmount);

      // Check fee was collected
      const feeCollectorBalanceAfter = await ethers.provider.getBalance(feeCollector.address);
      expect(feeCollectorBalanceAfter - feeCollectorBalanceBefore).to.equal(expectedFee);

      // Check platform metrics
      const metrics = await quantTradeAI.platformMetrics();
      expect(metrics.totalDeposits).to.equal(expectedDepositAmount);
      expect(metrics.totalFeesCollected).to.equal(expectedFee);
      expect(metrics.totalUsers).to.equal(1);
    });

    it("Should enforce minimum deposit amount", async function () {
      const belowMin = MIN_DEPOSIT - 1n;

      await expect(
        quantTradeAI.connect(user1).depositETH({ value: belowMin })
      ).to.be.revertedWithCustomError(quantTradeAI, "BelowMinDeposit");
    });

    it("Should enforce maximum deposit amount", async function () {
      const aboveMax = MAX_DEPOSIT + 1n;

      await expect(
        quantTradeAI.connect(user1).depositETH({ value: aboveMax })
      ).to.be.revertedWithCustomError(quantTradeAI, "ExceedsMaxDeposit");
    });

    it("Should reject zero value deposits", async function () {
      await expect(
        quantTradeAI.connect(user1).depositETH({ value: 0 })
      ).to.be.revertedWithCustomError(quantTradeAI, "InvalidAmount");
    });

    it("Should track new users correctly", async function () {
      await quantTradeAI.connect(user1).depositETH({ value: ethers.parseEther("1") });
      await quantTradeAI.connect(user2).depositETH({ value: ethers.parseEther("1") });

      const metrics = await quantTradeAI.platformMetrics();
      expect(metrics.totalUsers).to.equal(2);

      // Check user account details
      const user1Account = await quantTradeAI.getUserAccount(user1.address);
      expect(user1Account.riskLevel).to.equal(5); // Default medium risk
      expect(user1Account.lastActiveTime).to.be.greaterThan(0);
    });
  });

  describe("ERC20 Token Deposits", function () {
    const tokenAmount = ethers.parseEther("100");

    beforeEach(async function () {
      // Transfer tokens to user1 for testing
      await mockToken.transfer(user1.address, tokenAmount);
      await mockToken.connect(user1).approve(await quantTradeAI.getAddress(), tokenAmount);
    });

    it("Should allow ERC20 token deposits with fee collection", async function () {
      const depositAmount = ethers.parseEther("50");
      const expectedFee = (depositAmount * BigInt(PLATFORM_FEE)) / BigInt(BASIS_POINTS);
      const expectedDepositAmount = depositAmount - expectedFee;

      const tokenAddress = await mockToken.getAddress();

      await expect(
        quantTradeAI.connect(user1).depositToken(tokenAddress, depositAmount)
      ).to.emit(quantTradeAI, "Deposited")
        .withArgs(user1.address, tokenAddress, expectedDepositAmount, expectedFee);

      // Check user token balance
      expect(await quantTradeAI.getUserBalance(user1.address, tokenAddress))
        .to.equal(expectedDepositAmount);

      // Check fee was collected
      expect(await mockToken.balanceOf(feeCollector.address)).to.equal(expectedFee);
    });

    it("Should reject unsupported tokens", async function () {
      // Deploy another token that's not supported
      const MockERC20Factory = await ethers.getContractFactory("MockERC20");
      const unsupportedToken = await MockERC20Factory.deploy(
        "Unsupported Token",
        "UNSUP",
        ethers.parseEther("1000")
      );

      await expect(
        quantTradeAI.connect(user1).depositToken(await unsupportedToken.getAddress(), tokenAmount)
      ).to.be.revertedWithCustomError(quantTradeAI, "TokenNotSupported");
    });
  });

  describe("Withdrawals with Fees", function () {
    const depositAmount = ethers.parseEther("1.0");

    beforeEach(async function () {
      // User1 deposits ETH first
      await quantTradeAI.connect(user1).depositETH({ value: depositAmount });
    });

    it("Should allow ETH withdrawals with fee collection", async function () {
      const userBalance = await quantTradeAI.getUserBalance(user1.address, ethers.ZeroAddress);
      const withdrawAmount = userBalance / 2n;

      const withdrawalFeePercent = 50; // 0.5% as set in contract
      const expectedFee = (withdrawAmount * BigInt(withdrawalFeePercent)) / BigInt(BASIS_POINTS);
      const expectedWithdrawAmount = withdrawAmount - expectedFee;

      const user1BalanceBefore = await ethers.provider.getBalance(user1.address);
      const feeCollectorBalanceBefore = await ethers.provider.getBalance(feeCollector.address);

      const tx = await quantTradeAI.connect(user1).withdrawETH(withdrawAmount);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      // Check user received correct amount (minus gas)
      const user1BalanceAfter = await ethers.provider.getBalance(user1.address);
      expect(user1BalanceAfter - user1BalanceBefore + gasUsed).to.equal(expectedWithdrawAmount);

      // Check fee was collected
      const feeCollectorBalanceAfter = await ethers.provider.getBalance(feeCollector.address);
      expect(feeCollectorBalanceAfter - feeCollectorBalanceBefore).to.equal(expectedFee);
    });

    it("Should reject withdrawals exceeding balance", async function () {
      const userBalance = await quantTradeAI.getUserBalance(user1.address, ethers.ZeroAddress);
      const excessAmount = userBalance + ethers.parseEther("1.0");

      await expect(
        quantTradeAI.connect(user1).withdrawETH(excessAmount)
      ).to.be.revertedWithCustomError(quantTradeAI, "InsufficientBalance");
    });
  });

  describe("User Management & Security", function () {
    beforeEach(async function () {
      await quantTradeAI.connect(user1).depositETH({ value: ethers.parseEther("1") });
    });

    it("Should allow owner to blacklist users", async function () {
      await quantTradeAI.setUserBlacklist(user1.address, true);

      await expect(
        quantTradeAI.connect(user1).depositETH({ value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(quantTradeAI, "UserIsBlacklisted");
    });

    it("Should allow authorized operators to set risk levels", async function () {
      await expect(
        quantTradeAI.connect(operator).setUserRiskLevel(user1.address, 8)
      ).to.emit(quantTradeAI, "RiskLevelUpdated")
        .withArgs(user1.address, 5, 8);

      const userAccount = await quantTradeAI.getUserAccount(user1.address);
      expect(userAccount.riskLevel).to.equal(8);
    });

    it("Should reject unauthorized risk level changes", async function () {
      await expect(
        quantTradeAI.connect(user2).setUserRiskLevel(user1.address, 8)
      ).to.be.revertedWithCustomError(quantTradeAI, "UnauthorizedOperator");
    });
  });

  describe("Emergency Controls", function () {
    beforeEach(async function () {
      await quantTradeAI.connect(user1).depositETH({ value: ethers.parseEther("1") });
    });

    it("Should allow owner to pause the contract", async function () {
      await quantTradeAI.pause();

      await expect(
        quantTradeAI.connect(user2).depositETH({ value: ethers.parseEther("1") })
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow emergency withdrawals mode", async function () {
      await quantTradeAI.toggleEmergencyWithdrawals(true);

      // Deposits should be blocked
      await expect(
        quantTradeAI.connect(user2).depositETH({ value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(quantTradeAI, "EmergencyWithdrawalsActive");

      // Withdrawals should work without fees
      const userBalance = await quantTradeAI.getUserBalance(user1.address, ethers.ZeroAddress);

      await expect(
        quantTradeAI.connect(user1).withdrawETH(userBalance)
      ).to.emit(quantTradeAI, "Withdrawn");
    });

    it("Should allow emergency treasury withdrawal", async function () {
      const contractBalance = await ethers.provider.getBalance(await quantTradeAI.getAddress());
      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

      await quantTradeAI.emergencyWithdrawTreasury(ethers.ZeroAddress, contractBalance);

      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(contractBalance);
    });
  });

  describe("Treasury Configuration", function () {
    it("Should allow owner to update treasury config", async function () {
      const newTreasury = user2.address;
      const newFeeCollector = user2.address;
      const newPlatformFee = 300;
      const newWithdrawalFee = 75;

      await expect(
        quantTradeAI.updateTreasuryConfig(
          newTreasury,
          newFeeCollector,
          newPlatformFee,
          newWithdrawalFee
        )
      ).to.emit(quantTradeAI, "TreasuryConfigUpdated")
        .withArgs(newTreasury, newFeeCollector, newPlatformFee);

      const config = await quantTradeAI.treasuryConfig();
      expect(config.treasuryWallet).to.equal(newTreasury);
      expect(config.feeCollector).to.equal(newFeeCollector);
      expect(config.platformFeePercent).to.equal(newPlatformFee);
      expect(config.withdrawalFeePercent).to.equal(newWithdrawalFee);
    });

    it("Should reject excessive fee percentages", async function () {
      const excessiveFee = 1001; // 10.01%, above MAX_FEE_PERCENT

      await expect(
        quantTradeAI.updateTreasuryConfig(
          treasury.address,
          feeCollector.address,
          excessiveFee,
          50
        )
      ).to.be.revertedWithCustomError(quantTradeAI, "InvalidFeePercent");
    });
  });

  describe("Token Management", function () {
    it("Should allow owner to add supported tokens", async function () {
      // Deploy new token
      const MockERC20Factory = await ethers.getContractFactory("MockERC20");
      const newToken = await MockERC20Factory.deploy("New Token", "NEW", ethers.parseEther("1000"));
      const tokenAddress = await newToken.getAddress();

      await expect(
        quantTradeAI.addSupportedToken(tokenAddress)
      ).to.emit(quantTradeAI, "TokenSupportAdded")
        .withArgs(tokenAddress);

      const supportedTokens = await quantTradeAI.getSupportedTokens();
      expect(supportedTokens).to.include(tokenAddress);
    });

    it("Should allow owner to remove supported tokens", async function () {
      const tokenAddress = await mockToken.getAddress();

      await expect(
        quantTradeAI.removeSupportedToken(tokenAddress)
      ).to.emit(quantTradeAI, "TokenSupportRemoved")
        .withArgs(tokenAddress);

      const supportedTokens = await quantTradeAI.getSupportedTokens();
      expect(supportedTokens).to.not.include(tokenAddress);
    });
  });

  describe("Fee Collection", function () {
    beforeEach(async function () {
      await quantTradeAI.connect(user1).depositETH({ value: ethers.parseEther("1") });
    });

    it("Should allow authorized operators to collect accumulated fees", async function () {
      // There might be some remaining ETH in contract after deposits
      const contractBalance = await ethers.provider.getBalance(await quantTradeAI.getAddress());

      if (contractBalance > 0) {
        const feeCollectorBalanceBefore = await ethers.provider.getBalance(feeCollector.address);

        await expect(
          quantTradeAI.connect(operator).collectAccumulatedFees(ethers.ZeroAddress)
        ).to.emit(quantTradeAI, "FeesCollected");

        const feeCollectorBalanceAfter = await ethers.provider.getBalance(feeCollector.address);
        expect(feeCollectorBalanceAfter).to.be.greaterThan(feeCollectorBalanceBefore);
      }
    });

    it("Should allow toggling fee collection", async function () {
      await quantTradeAI.toggleFeeCollection(false);

      const config = await quantTradeAI.treasuryConfig();
      expect(config.feeCollectionActive).to.be.false;

      // Test deposit without fees
      const depositAmount = ethers.parseEther("1");
      await expect(
        quantTradeAI.connect(user2).depositETH({ value: depositAmount })
      ).to.emit(quantTradeAI, "Deposited")
        .withArgs(user2.address, ethers.ZeroAddress, depositAmount, 0);
    });
  });

  describe("Contract Balance & Metrics", function () {
    it("Should return correct contract balances", async function () {
      const ethDeposit = ethers.parseEther("1.0");
      await quantTradeAI.connect(user1).depositETH({ value: ethDeposit });

      const ethBalance = await quantTradeAI.getContractBalance(ethers.ZeroAddress);
      expect(ethBalance).to.be.greaterThan(0);

      // Test token balance
      const tokenAddress = await mockToken.getAddress();
      const tokenBalance = await quantTradeAI.getContractBalance(tokenAddress);
      expect(tokenBalance).to.equal(0); // No token deposits yet
    });

    it("Should track platform metrics correctly", async function () {
      await quantTradeAI.connect(user1).depositETH({ value: ethers.parseEther("1") });
      await quantTradeAI.connect(user2).depositETH({ value: ethers.parseEther("2") });

      const metrics = await quantTradeAI.platformMetrics();
      expect(metrics.totalUsers).to.equal(2);
      expect(metrics.totalDeposits).to.be.greaterThan(0);
      expect(metrics.totalFeesCollected).to.be.greaterThan(0);
    });
  });

  describe("Fallback Functions", function () {
    it("Should reject direct ETH transfers from unauthorized senders", async function () {
      await expect(
        user1.sendTransaction({
          to: await quantTradeAI.getAddress(),
          value: ethers.parseEther("1")
        })
      ).to.be.revertedWith("Direct ETH transfers not allowed");
    });

    it("Should accept ETH from authorized addresses", async function () {
      // ETH from treasury should be accepted
      await expect(
        treasury.sendTransaction({
          to: await quantTradeAI.getAddress(),
          value: ethers.parseEther("1")
        })
      ).to.not.be.reverted;
    });
  });
});
