import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MetaMaskPortfolioManager", function () {
  // Mock ERC20 token contract for testing
  async function deployMockERC20() {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy("Test Token", "TEST", 18);
    return mockToken;
  }

  async function deployPortfolioManagerFixture() {
    // Get signers
    const [admin, user1, user2] = await ethers.getSigners();

    // Deploy mock tokens
    const token1 = await deployMockERC20();
    const token2 = await deployMockERC20();

    // Deploy portfolio manager with initial tokens
    const MetaMaskPortfolioManager = await ethers.getContractFactory("MetaMaskPortfolioManager");
    const portfolioManager = await MetaMaskPortfolioManager.deploy([
      await token1.getAddress(),
      await token2.getAddress()
    ]);

    // Mint tokens to users for testing
    const mintAmount = ethers.parseEther("1000");
    await token1.mint(user1.address, mintAmount);
    await token1.mint(user2.address, mintAmount);
    await token2.mint(user1.address, mintAmount);
    await token2.mint(user2.address, mintAmount);

    return {
      portfolioManager,
      token1,
      token2,
      admin,
      user1,
      user2,
      mintAmount
    };
  }

  describe("Deployment", function () {
    it("Should set the admin correctly", async function () {
      const { portfolioManager, admin } = await loadFixture(deployPortfolioManagerFixture);
      expect(await portfolioManager.admin()).to.equal(admin.address);
    });

    it("Should initialize supported tokens", async function () {
      const { portfolioManager, token1, token2 } = await loadFixture(deployPortfolioManagerFixture);
      const supportedTokens = await portfolioManager.getSupportedTokens();
      expect(supportedTokens).to.include(await token1.getAddress());
      expect(supportedTokens).to.include(await token2.getAddress());
      expect(supportedTokens.length).to.equal(2);
    });
  });

  describe("Token Deposits", function () {
    it("Should allow users to deposit single token", async function () {
      const { portfolioManager, token1, user1 } = await loadFixture(deployPortfolioManagerFixture);

      const depositAmount = ethers.parseEther("100");
      const token1Address = await token1.getAddress();

      // Approve and deposit
      await token1.connect(user1).approve(await portfolioManager.getAddress(), depositAmount);

      await expect(
        portfolioManager.connect(user1).depositTokens([token1Address], [depositAmount])
      )
        .to.emit(portfolioManager, "TokenDeposited")
        .withArgs(user1.address, token1Address, depositAmount);

      // Check balance
      expect(await portfolioManager.getUserBalance(user1.address, token1Address))
        .to.equal(depositAmount);
    });

    it("Should allow users to deposit multiple tokens", async function () {
      const { portfolioManager, token1, token2, user1 } = await loadFixture(deployPortfolioManagerFixture);

      const depositAmount1 = ethers.parseEther("100");
      const depositAmount2 = ethers.parseEther("200");
      const token1Address = await token1.getAddress();
      const token2Address = await token2.getAddress();

      // Approve tokens
      await token1.connect(user1).approve(await portfolioManager.getAddress(), depositAmount1);
      await token2.connect(user1).approve(await portfolioManager.getAddress(), depositAmount2);

      // Deposit multiple tokens
      await portfolioManager.connect(user1).depositTokens(
        [token1Address, token2Address],
        [depositAmount1, depositAmount2]
      );

      // Check balances
      expect(await portfolioManager.getUserBalance(user1.address, token1Address))
        .to.equal(depositAmount1);
      expect(await portfolioManager.getUserBalance(user1.address, token2Address))
        .to.equal(depositAmount2);
    });

    it("Should revert on array length mismatch", async function () {
      const { portfolioManager, token1, user1 } = await loadFixture(deployPortfolioManagerFixture);

      const token1Address = await token1.getAddress();
      const depositAmount = ethers.parseEther("100");

      await expect(
        portfolioManager.connect(user1).depositTokens(
          [token1Address],
          [depositAmount, depositAmount] // Mismatched array lengths
        )
      ).to.be.revertedWith("Array mismatch");
    });

    it("Should revert if transfer fails", async function () {
      const { portfolioManager, token1, user1 } = await loadFixture(deployPortfolioManagerFixture);

      const token1Address = await token1.getAddress();
      const depositAmount = ethers.parseEther("100");

      // Don't approve tokens - transfer should fail
      await expect(
        portfolioManager.connect(user1).depositTokens([token1Address], [depositAmount])
      ).to.be.revertedWith("Transfer failed");
    });
  });

  describe("ETH Deposits", function () {
    it("Should allow users to deposit ETH", async function () {
      const { portfolioManager, user1 } = await loadFixture(deployPortfolioManagerFixture);

      const depositAmount = ethers.parseEther("1");

      await expect(
        portfolioManager.connect(user1).depositETH({ value: depositAmount })
      )
        .to.emit(portfolioManager, "ETHDeposited")
        .withArgs(user1.address, depositAmount);

      // Check ETH balance (address(0) represents ETH)
      expect(await portfolioManager.getUserBalance(user1.address, ethers.ZeroAddress))
        .to.equal(depositAmount);
    });

    it("Should accumulate multiple ETH deposits", async function () {
      const { portfolioManager, user1 } = await loadFixture(deployPortfolioManagerFixture);

      const depositAmount1 = ethers.parseEther("1");
      const depositAmount2 = ethers.parseEther("0.5");

      // First deposit
      await portfolioManager.connect(user1).depositETH({ value: depositAmount1 });

      // Second deposit
      await portfolioManager.connect(user1).depositETH({ value: depositAmount2 });

      // Check total balance
      expect(await portfolioManager.getUserBalance(user1.address, ethers.ZeroAddress))
        .to.equal(depositAmount1 + depositAmount2);
    });
  });

  describe("Admin Functions", function () {
    describe("Admin Withdraw Token", function () {
      it("Should allow admin to withdraw user tokens", async function () {
        const { portfolioManager, token1, admin, user1 } = await loadFixture(deployPortfolioManagerFixture);

        const depositAmount = ethers.parseEther("100");
        const withdrawAmount = ethers.parseEther("50");
        const token1Address = await token1.getAddress();

        // User deposits tokens
        await token1.connect(user1).approve(await portfolioManager.getAddress(), depositAmount);
        await portfolioManager.connect(user1).depositTokens([token1Address], [depositAmount]);

        // Admin withdraws
        await expect(
          portfolioManager.connect(admin).adminWithdrawToken(token1Address, user1.address, withdrawAmount)
        )
          .to.emit(portfolioManager, "AdminWithdrawToken")
          .withArgs(admin.address, user1.address, token1Address, withdrawAmount);

        // Check updated balance
        expect(await portfolioManager.getUserBalance(user1.address, token1Address))
          .to.equal(depositAmount - withdrawAmount);
      });

      it("Should revert if user has insufficient balance", async function () {
        const { portfolioManager, token1, admin, user1 } = await loadFixture(deployPortfolioManagerFixture);

        const token1Address = await token1.getAddress();
        const withdrawAmount = ethers.parseEther("100");

        await expect(
          portfolioManager.connect(admin).adminWithdrawToken(token1Address, user1.address, withdrawAmount)
        ).to.be.revertedWith("Insufficient balance");
      });

      it("Should revert if not called by admin", async function () {
        const { portfolioManager, token1, user1, user2 } = await loadFixture(deployPortfolioManagerFixture);

        const token1Address = await token1.getAddress();
        const withdrawAmount = ethers.parseEther("50");

        await expect(
          portfolioManager.connect(user1).adminWithdrawToken(token1Address, user2.address, withdrawAmount)
        ).to.be.revertedWith("Not admin");
      });
    });

    describe("Admin Withdraw ETH", function () {
      it("Should allow admin to withdraw user ETH", async function () {
        const { portfolioManager, admin, user1 } = await loadFixture(deployPortfolioManagerFixture);

        const depositAmount = ethers.parseEther("1");
        const withdrawAmount = ethers.parseEther("0.5");

        // User deposits ETH
        await portfolioManager.connect(user1).depositETH({ value: depositAmount });

        // Admin withdraws
        await expect(
          portfolioManager.connect(admin).adminWithdrawETH(user1.address, withdrawAmount)
        )
          .to.emit(portfolioManager, "AdminWithdrawETH")
          .withArgs(admin.address, user1.address, withdrawAmount);

        // Check updated balance
        expect(await portfolioManager.getUserBalance(user1.address, ethers.ZeroAddress))
          .to.equal(depositAmount - withdrawAmount);
      });

      it("Should revert if user has insufficient ETH balance", async function () {
        const { portfolioManager, admin, user1 } = await loadFixture(deployPortfolioManagerFixture);

        const withdrawAmount = ethers.parseEther("1");

        await expect(
          portfolioManager.connect(admin).adminWithdrawETH(user1.address, withdrawAmount)
        ).to.be.revertedWith("Insufficient balance");
      });
    });

    describe("Admin Transfer Token", function () {
      it("Should allow admin to transfer tokens between users", async function () {
        const { portfolioManager, token1, admin, user1, user2 } = await loadFixture(deployPortfolioManagerFixture);

        const depositAmount = ethers.parseEther("100");
        const transferAmount = ethers.parseEther("30");
        const token1Address = await token1.getAddress();

        // User1 deposits tokens
        await token1.connect(user1).approve(await portfolioManager.getAddress(), depositAmount);
        await portfolioManager.connect(user1).depositTokens([token1Address], [depositAmount]);

        // Admin transfers from user1 to user2
        await portfolioManager.connect(admin).adminTransferToken(
          token1Address,
          user1.address,
          user2.address,
          transferAmount
        );

        // Check balances
        expect(await portfolioManager.getUserBalance(user1.address, token1Address))
          .to.equal(depositAmount - transferAmount);
        expect(await portfolioManager.getUserBalance(user2.address, token1Address))
          .to.equal(transferAmount);
      });

      it("Should revert if from user has insufficient balance", async function () {
        const { portfolioManager, token1, admin, user1, user2 } = await loadFixture(deployPortfolioManagerFixture);

        const token1Address = await token1.getAddress();
        const transferAmount = ethers.parseEther("100");

        await expect(
          portfolioManager.connect(admin).adminTransferToken(
            token1Address,
            user1.address,
            user2.address,
            transferAmount
          )
        ).to.be.revertedWith("Insufficient balance");
      });
    });

    describe("Add Supported Token", function () {
      it("Should allow admin to add supported tokens", async function () {
        const { portfolioManager, admin } = await loadFixture(deployPortfolioManagerFixture);

        const newToken = await deployMockERC20();
        const newTokenAddress = await newToken.getAddress();

        await portfolioManager.connect(admin).addSupportedToken(newTokenAddress);

        const supportedTokens = await portfolioManager.getSupportedTokens();
        expect(supportedTokens).to.include(newTokenAddress);
      });

      it("Should revert if not called by admin", async function () {
        const { portfolioManager, user1 } = await loadFixture(deployPortfolioManagerFixture);

        const newToken = await deployMockERC20();
        const newTokenAddress = await newToken.getAddress();

        await expect(
          portfolioManager.connect(user1).addSupportedToken(newTokenAddress)
        ).to.be.revertedWith("Not admin");
      });
    });
  });

  describe("View Functions", function () {
    it("Should return correct user balance", async function () {
      const { portfolioManager, token1, user1 } = await loadFixture(deployPortfolioManagerFixture);

      const depositAmount = ethers.parseEther("100");
      const token1Address = await token1.getAddress();

      // Initially zero balance
      expect(await portfolioManager.getUserBalance(user1.address, token1Address))
        .to.equal(0);

      // After deposit
      await token1.connect(user1).approve(await portfolioManager.getAddress(), depositAmount);
      await portfolioManager.connect(user1).depositTokens([token1Address], [depositAmount]);

      expect(await portfolioManager.getUserBalance(user1.address, token1Address))
        .to.equal(depositAmount);
    });

    it("Should return supported tokens array", async function () {
      const { portfolioManager, token1, token2 } = await loadFixture(deployPortfolioManagerFixture);

      const supportedTokens = await portfolioManager.getSupportedTokens();
      expect(supportedTokens.length).to.equal(2);
      expect(supportedTokens).to.include(await token1.getAddress());
      expect(supportedTokens).to.include(await token2.getAddress());
    });
  });
});

// Mock ERC20 token contract for testing
// This should be deployed separately or use an existing mock
const MockERC20Source = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}
`;