import { expect } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { QuantMissionAI } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = hre;

describe("QuantMissionAI Mission-Based Contract", function () {
  let quantMissionAI: QuantMissionAI;

  // Test accounts
  let owner: SignerWithAddress;
  let treasury: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  // Test constants
  const GAS_BUFFER_PERCENT = 100; // 1%
  const BASIS_POINTS = 10000;
  const MIN_CONTRIBUTION = ethers.parseEther("0.01");
  const MAX_CONTRIBUTION = ethers.parseEther("100");

  async function deployQuantMissionAIFixture() {
    const [owner, treasury, user1, user2, user3] = await ethers.getSigners();

    // Deploy QuantMissionAI with treasury integration
    const QuantMissionAIFactory = await ethers.getContractFactory("QuantMissionAI");
    const quantMissionAI = await QuantMissionAIFactory.deploy(
      treasury.address,
      GAS_BUFFER_PERCENT
    );
    await quantMissionAI.waitForDeployment();

    // Register a test agreement
    const agreementText = "I agree to contribute to QuantAI missions and understand that funds will be used for platform development.";
    const agreementHash = ethers.keccak256(ethers.toUtf8Bytes(agreementText));
    await quantMissionAI.registerAgreement(agreementHash);

    return { quantMissionAI, owner, treasury, user1, user2, user3, agreementHash, agreementText };
  }

  beforeEach(async function () {
    const fixture = await loadFixture(deployQuantMissionAIFixture);
    quantMissionAI = fixture.quantMissionAI;
    owner = fixture.owner;
    treasury = fixture.treasury;
    user1 = fixture.user1;
    user2 = fixture.user2;
    user3 = fixture.user3;
  });

  describe("Deployment & Configuration", function () {
    it("Should set the correct owner and treasury", async function () {
      expect(await quantMissionAI.owner()).to.equal(owner.address);

      const config = await quantMissionAI.treasuryConfig();
      expect(config.treasuryWallet).to.equal(treasury.address);
      expect(config.gasBufferPercent).to.equal(GAS_BUFFER_PERCENT);
    });

    it("Should have default missions available", async function () {
      const missions = await quantMissionAI.getAvailableMissions();
      expect(missions.length).to.be.greaterThan(0);
      expect(missions).to.include("AI Development");
      expect(missions).to.include("Research & Innovation");
    });

    it("Should reject deployment with zero treasury address", async function () {
      const QuantMissionAIFactory = await ethers.getContractFactory("QuantMissionAI");

      await expect(
        QuantMissionAIFactory.deploy(ethers.ZeroAddress, GAS_BUFFER_PERCENT)
      ).to.be.revertedWithCustomError(quantMissionAI, "InvalidTreasuryAddress");
    });

    it("Should reject excessive gas buffer percentage", async function () {
      const QuantMissionAIFactory = await ethers.getContractFactory("QuantMissionAI");

      await expect(
        QuantMissionAIFactory.deploy(treasury.address, 600) // 6% > 5% max
      ).to.be.revertedWithCustomError(quantMissionAI, "InvalidGasBuffer");
    });
  });

  describe("Mission Contributions - Core Workflow", function () {
    let agreementHash: string;
    let validMission: string;

    beforeEach(async function () {
      // Set up valid agreement and mission
      const agreementText = "Test mission agreement";
      agreementHash = ethers.keccak256(ethers.toUtf8Bytes(agreementText));
      await quantMissionAI.registerAgreement(agreementHash);

      const missions = await quantMissionAI.getAvailableMissions();
      validMission = missions[0]; // Use first available mission
    });

    it("Should allow user to confirm mission and contribute funds", async function () {
      const contributionAmount = ethers.parseEther("1.0");
      const expectedGasBuffer = (contributionAmount * BigInt(GAS_BUFFER_PERCENT)) / BigInt(BASIS_POINTS);
      const expectedMissionAmount = contributionAmount - expectedGasBuffer;

      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

      // User confirms mission and contributes
      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(validMission, agreementHash, { value: contributionAmount })
      ).to.emit(quantMissionAI, "MissionContribution")
        .withArgs(user1.address, expectedMissionAmount, expectedGasBuffer, validMission, agreementHash)
        .and.to.emit(quantMissionAI, "FundsTransferredToTreasury")
        .withArgs(user1.address, expectedMissionAmount, validMission);

      // Verify funds went to treasury immediately
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(expectedMissionAmount);

      // Verify user contribution recorded
      const userContributions = await quantMissionAI.getUserContributions(user1.address);
      expect(userContributions.length).to.equal(1);
      expect(userContributions[0].amount).to.equal(expectedMissionAmount);
      expect(userContributions[0].missionType).to.equal(validMission);
      expect(userContributions[0].agreementConfirmed).to.be.true;

      // Verify platform metrics updated
      const metrics = await quantMissionAI.getPlatformMetrics();
      expect(metrics.totalContributors).to.equal(1);
      expect(metrics.totalContributions).to.equal(contributionAmount);
      expect(metrics.totalMissionFunding).to.equal(expectedMissionAmount);
    });

    it("Should track mission funding correctly", async function () {
      const contribution1 = ethers.parseEther("1.0");
      const contribution2 = ethers.parseEther("2.0");

      await quantMissionAI.connect(user1).confirmMissionAndContribute(validMission, agreementHash, { value: contribution1 });
      await quantMissionAI.connect(user2).confirmMissionAndContribute(validMission, agreementHash, { value: contribution2 });

      const missionFunding = await quantMissionAI.getMissionFunding(validMission);

      // Calculate expected total (contributions minus gas buffers)
      const expectedTotal = (contribution1 + contribution2) * BigInt(BASIS_POINTS - GAS_BUFFER_PERCENT) / BigInt(BASIS_POINTS);
      expect(missionFunding).to.equal(expectedTotal);
    });

    it("Should handle multiple contributors correctly", async function () {
      const contributionAmount = ethers.parseEther("0.5");

      await quantMissionAI.connect(user1).confirmMissionAndContribute(validMission, agreementHash, { value: contributionAmount });
      await quantMissionAI.connect(user2).confirmMissionAndContribute(validMission, agreementHash, { value: contributionAmount });
      await quantMissionAI.connect(user3).confirmMissionAndContribute(validMission, agreementHash, { value: contributionAmount });

      const metrics = await quantMissionAI.getPlatformMetrics();
      expect(metrics.totalContributors).to.equal(3);

      // Check each user's contribution
      expect(await quantMissionAI.hasUserContributed(user1.address)).to.be.true;
      expect(await quantMissionAI.hasUserContributed(user2.address)).to.be.true;
      expect(await quantMissionAI.hasUserContributed(user3.address)).to.be.true;
    });

    it("Should prevent contributions below minimum amount", async function () {
      const belowMin = MIN_CONTRIBUTION - 1n;

      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(validMission, agreementHash, { value: belowMin })
      ).to.be.revertedWithCustomError(quantMissionAI, "BelowMinContribution");
    });

    it("Should prevent contributions above maximum amount", async function () {
      const aboveMax = MAX_CONTRIBUTION + 1n;

      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(validMission, agreementHash, { value: aboveMax })
      ).to.be.revertedWithCustomError(quantMissionAI, "ExceedsMaxContribution");
    });

    it("Should reject invalid mission types", async function () {
      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute("Invalid Mission", agreementHash, { value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(quantMissionAI, "InvalidMission");
    });

    it("Should reject invalid agreement hashes", async function () {
      const invalidHash = ethers.keccak256(ethers.toUtf8Bytes("Invalid agreement"));

      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(validMission, invalidHash, { value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(quantMissionAI, "AgreementNotValid");
    });
  });

  describe("No Withdrawal Functionality", function () {
    it("Should NOT have any withdrawal functions", async function () {
      // Verify the contract doesn't have withdrawal functions
      const contractInterface = quantMissionAI.interface;
      const functions = contractInterface.fragments.filter(f => f.type === 'function');

      const withdrawalFunctions = functions.filter(f =>
        f.name.toLowerCase().includes('withdraw') &&
        !f.name.includes('emergency') // Emergency functions are admin-only
      );

      expect(withdrawalFunctions.length).to.equal(0);
    });

    it("Should maintain institutional control - no user access to contributed funds", async function () {
      const contributionAmount = ethers.parseEther("1.0");
      const agreementText = "Test agreement";
      const agreementHash = ethers.keccak256(ethers.toUtf8Bytes(agreementText));
      await quantMissionAI.registerAgreement(agreementHash);

      const missions = await quantMissionAI.getAvailableMissions();

      // User contributes
      await quantMissionAI.connect(user1).confirmMissionAndContribute(missions[0], agreementHash, { value: contributionAmount });

      // Verify contract has minimal balance (only gas buffer)
      const contractBalance = await quantMissionAI.getContractBalance();
      const expectedGasBuffer = (contributionAmount * BigInt(GAS_BUFFER_PERCENT)) / BigInt(BASIS_POINTS);
      expect(contractBalance).to.equal(expectedGasBuffer);

      // Verify user cannot get funds back (no withdrawal functions available)
      const userContributions = await quantMissionAI.getUserContributions(user1.address);
      expect(userContributions.length).to.equal(1);
      // But no way to withdraw these contributions
    });
  });

  describe("Admin Functions & Institutional Control", function () {
    it("Should allow owner to add new missions", async function () {
      const newMission = "Quantum Computing Research";

      await expect(
        quantMissionAI.addMission(newMission)
      ).to.emit(quantMissionAI, "MissionAdded")
        .withArgs(newMission);

      const missions = await quantMissionAI.getAvailableMissions();
      expect(missions).to.include(newMission);
    });

    it("Should allow owner to register and revoke agreements", async function () {
      const newAgreementText = "New mission agreement terms";
      const newAgreementHash = ethers.keccak256(ethers.toUtf8Bytes(newAgreementText));

      // Register agreement
      await expect(
        quantMissionAI.registerAgreement(newAgreementHash)
      ).to.emit(quantMissionAI, "AgreementRegistered")
        .withArgs(newAgreementHash);

      // Revoke agreement
      await quantMissionAI.revokeAgreement(newAgreementHash);

      // Should no longer be valid
      const missions = await quantMissionAI.getAvailableMissions();
      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(missions[0], newAgreementHash, { value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(quantMissionAI, "AgreementNotValid");
    });

    it("Should allow owner to update treasury configuration", async function () {
      const newTreasury = user2.address;
      const newGasBuffer = 200; // 2%

      await expect(
        quantMissionAI.updateTreasuryConfig(newTreasury, newGasBuffer)
      ).to.emit(quantMissionAI, "TreasuryConfigUpdated")
        .withArgs(newTreasury, newGasBuffer);

      const config = await quantMissionAI.treasuryConfig();
      expect(config.treasuryWallet).to.equal(newTreasury);
      expect(config.gasBufferPercent).to.equal(newGasBuffer);
    });

    it("Should allow owner to toggle contributions", async function () {
      // Disable contributions
      await quantMissionAI.toggleContributions(false);

      const missions = await quantMissionAI.getAvailableMissions();
      const agreementText = "Test agreement";
      const agreementHash = ethers.keccak256(ethers.toUtf8Bytes(agreementText));
      await quantMissionAI.registerAgreement(agreementHash);

      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(missions[0], agreementHash, { value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(quantMissionAI, "ContributionsDisabled");

      // Re-enable contributions
      await quantMissionAI.toggleContributions(true);

      // Should work again
      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(missions[0], agreementHash, { value: ethers.parseEther("1") })
      ).to.not.be.reverted;
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to emergency withdraw gas buffer", async function () {
      // First, create some gas buffer by having users contribute
      const contributionAmount = ethers.parseEther("1.0");
      const agreementText = "Test agreement";
      const agreementHash = ethers.keccak256(ethers.toUtf8Bytes(agreementText));
      await quantMissionAI.registerAgreement(agreementHash);

      const missions = await quantMissionAI.getAvailableMissions();

      await quantMissionAI.connect(user1).confirmMissionAndContribute(missions[0], agreementHash, { value: contributionAmount });

      const contractBalanceBefore = await quantMissionAI.getContractBalance();
      expect(contractBalanceBefore).to.be.greaterThan(0);

      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

      // Emergency withdraw
      await quantMissionAI.emergencyWithdrawGasBuffer();

      const contractBalanceAfter = await quantMissionAI.getContractBalance();
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);

      expect(contractBalanceAfter).to.equal(0);
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(contractBalanceBefore);
    });

    it("Should allow owner to pause and unpause contract", async function () {
      await quantMissionAI.pause();

      const missions = await quantMissionAI.getAvailableMissions();
      const agreementText = "Test agreement";
      const agreementHash = ethers.keccak256(ethers.toUtf8Bytes(agreementText));
      await quantMissionAI.registerAgreement(agreementHash);

      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(missions[0], agreementHash, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Pausable: paused");

      await quantMissionAI.unpause();

      // Should work again
      await expect(
        quantMissionAI.connect(user1).confirmMissionAndContribute(missions[0], agreementHash, { value: ethers.parseEther("1") })
      ).to.not.be.reverted;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      const agreementText = "Test agreement";
      const agreementHash = ethers.keccak256(ethers.toUtf8Bytes(agreementText));
      await quantMissionAI.registerAgreement(agreementHash);

      const missions = await quantMissionAI.getAvailableMissions();

      // Create some test data
      await quantMissionAI.connect(user1).confirmMissionAndContribute(missions[0], agreementHash, { value: ethers.parseEther("1") });
      await quantMissionAI.connect(user1).confirmMissionAndContribute(missions[1], agreementHash, { value: ethers.parseEther("2") });
      await quantMissionAI.connect(user2).confirmMissionAndContribute(missions[0], agreementHash, { value: ethers.parseEther("0.5") });
    });

    it("Should return correct user contribution history", async function () {
      const user1Contributions = await quantMissionAI.getUserContributions(user1.address);
      expect(user1Contributions.length).to.equal(2);

      const user2Contributions = await quantMissionAI.getUserContributions(user2.address);
      expect(user2Contributions.length).to.equal(1);
    });

    it("Should calculate correct total user contributions", async function () {
      const user1Total = await quantMissionAI.getUserTotalContribution(user1.address);
      expect(user1Total).to.equal(ethers.parseEther("3")); // 1 + 2 ETH

      const user2Total = await quantMissionAI.getUserTotalContribution(user2.address);
      expect(user2Total).to.equal(ethers.parseEther("0.5"));
    });

    it("Should track platform metrics correctly", async function () {
      const metrics = await quantMissionAI.getPlatformMetrics();
      expect(metrics.totalContributors).to.equal(2);
      expect(metrics.totalContributions).to.equal(ethers.parseEther("3.5"));
    });
  });
});