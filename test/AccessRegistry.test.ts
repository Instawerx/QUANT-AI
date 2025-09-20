import { expect } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { AccessRegistry } from "../typechain-types";

describe("AccessRegistry", function () {
  let accessRegistry: AccessRegistry;
  let admin: SignerWithAddress;
  let userManager: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [admin, userManager, user1, user2] = await hre.ethers.getSigners();

    const AccessRegistry = await hre.ethers.getContractFactory("AccessRegistry");
    accessRegistry = await AccessRegistry.deploy(admin.address);
    await accessRegistry.waitForDeployment();

    // Grant USER_MANAGER_ROLE to userManager
    const USER_MANAGER_ROLE = await accessRegistry.USER_MANAGER_ROLE();
    await accessRegistry.connect(admin).grantRole(USER_MANAGER_ROLE, userManager.address);
  });

  describe("Deployment", function () {
    it("Should set the admin role correctly", async function () {
      const ADMIN_ROLE = await accessRegistry.ADMIN_ROLE();
      expect(await accessRegistry.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
    });

    it("Should set the default admin role", async function () {
      const DEFAULT_ADMIN_ROLE = await accessRegistry.DEFAULT_ADMIN_ROLE();
      expect(await accessRegistry.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
    });
  });

  describe("User Management", function () {
    it("Should allow user manager to verify users", async function () {
      await accessRegistry.connect(userManager).verifyUser(user1.address);
      expect(await accessRegistry.isVerified(user1.address)).to.be.true;
    });

    it("Should allow user manager to suspend users", async function () {
      await accessRegistry.connect(userManager).suspendUser(user1.address);
      expect(await accessRegistry.isSuspended(user1.address)).to.be.true;
    });

    it("Should allow user manager to unsuspend users", async function () {
      // Suspend first
      await accessRegistry.connect(userManager).suspendUser(user1.address);
      expect(await accessRegistry.isSuspended(user1.address)).to.be.true;

      // Then unsuspend
      await accessRegistry.connect(userManager).unsuspendUser(user1.address);
      expect(await accessRegistry.isSuspended(user1.address)).to.be.false;
    });

    it("Should not allow non-user-manager to verify users", async function () {
      await expect(
        accessRegistry.connect(user1).verifyUser(user2.address)
      ).to.be.revertedWith("AccessControlUnauthorizedAccount");
    });
  });

  describe("User Tiers", function () {
    it("Should allow updating user tiers", async function () {
      await accessRegistry.connect(userManager).updateUserTier(user1.address, 2);
      expect(await accessRegistry.getUserTier(user1.address)).to.equal(2);
    });

    it("Should not allow invalid tier values", async function () {
      await expect(
        accessRegistry.connect(userManager).updateUserTier(user1.address, 3)
      ).to.be.revertedWith("AccessRegistry: invalid tier");
    });

    it("Should default to tier 0", async function () {
      expect(await accessRegistry.getUserTier(user1.address)).to.equal(0);
    });
  });

  describe("Trading Permissions", function () {
    it("Should allow trading for verified, non-suspended users", async function () {
      await accessRegistry.connect(userManager).verifyUser(user1.address);
      expect(await accessRegistry.canTrade(user1.address)).to.be.true;
    });

    it("Should not allow trading for unverified users", async function () {
      expect(await accessRegistry.canTrade(user1.address)).to.be.false;
    });

    it("Should not allow trading for suspended users", async function () {
      await accessRegistry.connect(userManager).verifyUser(user1.address);
      await accessRegistry.connect(userManager).suspendUser(user1.address);
      expect(await accessRegistry.canTrade(user1.address)).to.be.false;
    });

    it("Should not allow trading when paused", async function () {
      await accessRegistry.connect(userManager).verifyUser(user1.address);
      await accessRegistry.connect(admin).pause();
      expect(await accessRegistry.canTrade(user1.address)).to.be.false;
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to grant trading manager role", async function () {
      await accessRegistry.connect(admin).grantTradingManager(user1.address);
      const TRADING_MANAGER_ROLE = await accessRegistry.TRADING_MANAGER_ROLE();
      expect(await accessRegistry.hasRole(TRADING_MANAGER_ROLE, user1.address)).to.be.true;
    });

    it("Should allow admin to grant risk manager role", async function () {
      await accessRegistry.connect(admin).grantRiskManager(user1.address);
      const RISK_MANAGER_ROLE = await accessRegistry.RISK_MANAGER_ROLE();
      expect(await accessRegistry.hasRole(RISK_MANAGER_ROLE, user1.address)).to.be.true;
    });

    it("Should allow admin to grant user manager role", async function () {
      await accessRegistry.connect(admin).grantUserManager(user1.address);
      const USER_MANAGER_ROLE = await accessRegistry.USER_MANAGER_ROLE();
      expect(await accessRegistry.hasRole(USER_MANAGER_ROLE, user1.address)).to.be.true;
    });

    it("Should not allow non-admin to grant roles", async function () {
      await expect(
        accessRegistry.connect(user1).grantTradingManager(user2.address)
      ).to.be.revertedWith("AccessControlUnauthorizedAccount");
    });
  });

  describe("Pausable", function () {
    it("Should allow admin to pause and unpause", async function () {
      await accessRegistry.connect(admin).pause();
      expect(await accessRegistry.paused()).to.be.true;

      await accessRegistry.connect(admin).unpause();
      expect(await accessRegistry.paused()).to.be.false;
    });

    it("Should not allow non-admin to pause", async function () {
      await expect(
        accessRegistry.connect(user1).pause()
      ).to.be.revertedWith("AccessControlUnauthorizedAccount");
    });
  });
});