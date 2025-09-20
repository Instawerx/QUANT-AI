import { expect } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { QuantToken } from "../typechain-types";

describe("QuantToken", function () {
  let quantToken: QuantToken;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await hre.ethers.getSigners();

    const QuantToken = await hre.ethers.getContractFactory("QuantToken");
    quantToken = await QuantToken.deploy(owner.address);
    await quantToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await quantToken.owner()).to.equal(owner.address);
    });

    it("Should mint initial supply to owner", async function () {
      const initialSupply = hre.ethers.parseEther("100000000"); // 100 million
      expect(await quantToken.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("Should have correct token details", async function () {
      expect(await quantToken.name()).to.equal("QuantTrade AI Token");
      expect(await quantToken.symbol()).to.equal("QUANT");
      expect(await quantToken.decimals()).to.equal(18);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = hre.ethers.parseEther("1000");
      await quantToken.mint(user1.address, mintAmount);
      expect(await quantToken.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Should not allow minting beyond max supply", async function () {
      const maxSupply = hre.ethers.parseEther("1000000000"); // 1 billion
      const currentSupply = await quantToken.totalSupply();
      const excessAmount = maxSupply - currentSupply + hre.ethers.parseEther("1");

      await expect(
        quantToken.mint(user1.address, excessAmount)
      ).to.be.revertedWith("QuantToken: exceeds max supply");
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = hre.ethers.parseEther("1000");
      await expect(
        quantToken.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWith("OwnableUnauthorizedAccount");
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause and unpause", async function () {
      await quantToken.pause();
      expect(await quantToken.paused()).to.be.true;

      await quantToken.unpause();
      expect(await quantToken.paused()).to.be.false;
    });

    it("Should prevent transfers when paused", async function () {
      // Transfer some tokens to user1 first
      await quantToken.transfer(user1.address, hre.ethers.parseEther("1000"));

      // Pause the contract
      await quantToken.pause();

      // Try to transfer - should fail
      await expect(
        quantToken.connect(user1).transfer(user2.address, hre.ethers.parseEther("100"))
      ).to.be.revertedWith("EnforcedPause");
    });
  });

  describe("Trading Rewards", function () {
    beforeEach(async function () {
      // Mint some tokens for testing
      await quantToken.mint(owner.address, hre.ethers.parseEther("10000"));
    });

    it("Should allow depositing trading rewards", async function () {
      const depositAmount = hre.ethers.parseEther("1000");

      await quantToken.depositTradingRewards(depositAmount);

      expect(await quantToken.tradingRewardsPool()).to.equal(depositAmount);
      expect(await quantToken.balanceOf(await quantToken.getAddress())).to.equal(depositAmount);
    });

    it("Should allow distributing trading rewards", async function () {
      const depositAmount = hre.ethers.parseEther("1000");
      const rewardAmount = hre.ethers.parseEther("100");

      // Deposit rewards first
      await quantToken.depositTradingRewards(depositAmount);

      // Distribute rewards
      await quantToken.distributeTradingRewards(user1.address, rewardAmount);

      expect(await quantToken.balanceOf(user1.address)).to.equal(rewardAmount);
      expect(await quantToken.tradingRewardsPool()).to.equal(depositAmount - rewardAmount);
    });

    it("Should not allow distributing more than available rewards", async function () {
      const depositAmount = hre.ethers.parseEther("1000");
      const excessAmount = hre.ethers.parseEther("2000");

      await quantToken.depositTradingRewards(depositAmount);

      await expect(
        quantToken.distributeTradingRewards(user1.address, excessAmount)
      ).to.be.revertedWith("QuantToken: insufficient rewards pool");
    });
  });

  describe("ERC20Permit", function () {
    it("Should have correct domain separator", async function () {
      const domainSeparator = await quantToken.DOMAIN_SEPARATOR();
      expect(domainSeparator).to.not.equal(hre.ethers.ZeroHash);
    });
  });
});