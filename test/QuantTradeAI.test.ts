import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { QuantTradeAI } from "../typechain-types";

describe("QuantTradeAI", function () {
  // Contracts
  let quantTradeAI: QuantTradeAI;
  
  // Test accounts
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy the contract
    const QuantTradeAIFactory = await ethers.getContractFactory("QuantTradeAI");
    quantTradeAI = await QuantTradeAIFactory.deploy();
    await quantTradeAI.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await quantTradeAI.owner()).to.equal(owner.address);
    });
  });

  describe("Deposits", function () {
    it("Should allow users to deposit ETH", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      // Deposit from user1
      await expect(
        quantTradeAI.connect(user1).deposit({ value: depositAmount })
      ).to.changeEtherBalance(user1, -depositAmount);
      
      // Check user's balance
      expect(await quantTradeAI.balances(user1.address)).to.equal(depositAmount);
    });

    it("Should not allow zero value deposits", async function () {
      await expect(
        quantTradeAI.connect(user1).deposit({ value: 0 })
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("Withdrawals", function () {
    const depositAmount = ethers.parseEther("1.0");
    
    beforeEach(async function () {
      // User1 deposits ETH first
      await quantTradeAI.connect(user1).deposit({ value: depositAmount });
    });

    it("Should allow users to withdraw their ETH", async function () {
      // Withdraw half of the deposited amount
      const withdrawAmount = depositAmount / 2n;
      
      await expect(
        quantTradeAI.connect(user1).withdraw(withdrawAmount)
      ).to.changeEtherBalance(user1, withdrawAmount);
      
      // Check updated balance
      expect(await quantTradeAI.balances(user1.address)).to.equal(depositAmount - withdrawAmount);
    });

    it("Should not allow withdrawals exceeding balance", async function () {
      const excessAmount = depositAmount + ethers.parseEther("1.0");
      
      await expect(
        quantTradeAI.connect(user1).withdraw(excessAmount)
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Contract Balance", function () {
    it("Should return the correct contract balance", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      // User1 deposits ETH
      await quantTradeAI.connect(user1).deposit({ value: depositAmount });
      
      // Check contract balance
      expect(await quantTradeAI.getContractBalance()).to.equal(depositAmount);
      
      // User2 deposits more ETH
      await quantTradeAI.connect(user2).deposit({ value: depositAmount });
      
      // Check updated contract balance
      expect(await quantTradeAI.getContractBalance()).to.equal(depositAmount * 2n);
    });
  });
});
