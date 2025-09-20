import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { setInterval } from "timers";

dotenv.config();

interface AutomationConfig {
  enabled: boolean;
  intervalMinutes: number;
  maxGasPrice: number;
  minProfitThreshold: number;
  riskManagement: {
    maxLossPercent: number;
    stopLossEnabled: boolean;
    takeProfitEnabled: boolean;
  };
}

class TradingAutomation {
  private config: AutomationConfig;
  private contracts: any = {};
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(config: AutomationConfig) {
    this.config = config;
  }

  async initialize() {
    console.log("🤖 Initializing Trading Automation System");

    try {
      // Load contract instances
      await this.loadContracts();

      // Verify contract connectivity
      await this.verifyContracts();

      // Set up event listeners
      this.setupEventListeners();

      console.log("✅ Trading automation system initialized successfully");
      return true;

    } catch (error) {
      console.error("❌ Failed to initialize trading automation:", error);
      return false;
    }
  }

  private async loadContracts() {
    const network = await ethers.provider.getNetwork();
    console.log("Loading contracts for network:", network.name);

    // Load contract addresses from environment
    const contractAddresses = {
      quantTradeAI: process.env.QUANTTRADEAI_CONTRACT_ADDRESS,
      tradingBot: process.env.TRADING_BOT_CONTRACT_ADDRESS,
      portfolioManager: process.env.PORTFOLIO_MANAGER_CONTRACT_ADDRESS
    };

    // Validate addresses
    for (const [name, address] of Object.entries(contractAddresses)) {
      if (!address || address.includes('YOUR_')) {
        throw new Error(`Missing contract address for ${name}`);
      }
    }

    // Create contract instances
    const QuantTradeAI = await ethers.getContractFactory("QuantTradeAI");
    const TradingBot = await ethers.getContractFactory("TradingBot");
    const PortfolioManager = await ethers.getContractFactory("PortfolioManager");

    this.contracts.quantTradeAI = QuantTradeAI.attach(contractAddresses.quantTradeAI!);
    this.contracts.tradingBot = TradingBot.attach(contractAddresses.tradingBot!);
    this.contracts.portfolioManager = PortfolioManager.attach(contractAddresses.portfolioManager!);
  }

  private async verifyContracts() {
    console.log("Verifying contract connectivity...");

    // Check QuantTradeAI
    const platformMetrics = await this.contracts.quantTradeAI.platformMetrics();
    console.log("📊 Platform Metrics:", {
      totalUsers: platformMetrics.totalUsers.toString(),
      totalDeposits: ethers.formatEther(platformMetrics.totalDeposits),
      totalFeesCollected: ethers.formatEther(platformMetrics.totalFeesCollected)
    });

    // Check TradingBot
    const strategies = await this.contracts.tradingBot.getAvailableStrategies();
    console.log("🎯 Available Strategies:", strategies);

    // Check PortfolioManager
    const supportedTokens = await this.contracts.portfolioManager.getSupportedTokens();
    console.log("🪙 Supported Tokens:", supportedTokens.length);
  }

  private setupEventListeners() {
    console.log("Setting up automation event listeners...");

    // Listen for new deposits
    this.contracts.quantTradeAI.on("Deposited", (user, token, amount, fee) => {
      console.log(`💰 New Deposit: ${ethers.formatEther(amount)} ETH from ${user}`);
      this.handleNewDeposit(user, token, amount);
    });

    // Listen for trading sessions
    this.contracts.tradingBot.on("TradingStarted", (sessionId, owner, strategy, amount, riskLevel) => {
      console.log(`🚀 Trading Started: Session ${sessionId}, Strategy: ${strategy}, Amount: ${ethers.formatEther(amount)}`);
      this.handleTradingSession(sessionId, strategy, amount, riskLevel);
    });

    // Listen for portfolio rebalancing
    this.contracts.portfolioManager.on("PortfolioRebalanced", (portfolioId, oldBalances, newBalances) => {
      console.log(`⚖️ Portfolio Rebalanced: ${portfolioId}`);
      this.handlePortfolioRebalance(portfolioId, oldBalances, newBalances);
    });
  }

  private async handleNewDeposit(user: string, token: string, amount: bigint) {
    try {
      // Auto-suggest trading strategies based on deposit amount
      const userAccount = await this.contracts.quantTradeAI.getUserAccount(user);
      const riskLevel = userAccount.riskLevel;

      if (amount >= ethers.parseEther("1")) {
        // Suggest starting a trading session for larger deposits
        console.log(`💡 Suggestion: User ${user} deposited ${ethers.formatEther(amount)} ETH - consider starting automated trading`);

        // Could automatically start trading here based on user preferences
        // await this.autoStartTrading(user, amount, riskLevel);
      }
    } catch (error) {
      console.error("Error handling new deposit:", error);
    }
  }

  private async handleTradingSession(sessionId: bigint, strategy: string, amount: bigint, riskLevel: number) {
    try {
      // Monitor trading session performance
      const session = await this.contracts.tradingBot.getTradingSession(sessionId);

      // Implement risk management
      if (this.config.riskManagement.stopLossEnabled) {
        await this.monitorStopLoss(sessionId, amount);
      }

      if (this.config.riskManagement.takeProfitEnabled) {
        await this.monitorTakeProfit(sessionId, amount);
      }

    } catch (error) {
      console.error("Error handling trading session:", error);
    }
  }

  private async handlePortfolioRebalance(portfolioId: bigint, oldBalances: bigint[], newBalances: bigint[]) {
    try {
      // Log rebalancing performance
      const totalOld = oldBalances.reduce((sum, balance) => sum + balance, 0n);
      const totalNew = newBalances.reduce((sum, balance) => sum + balance, 0n);

      console.log(`📈 Portfolio ${portfolioId} rebalanced: ${ethers.formatEther(totalOld)} → ${ethers.formatEther(totalNew)}`);

      // Create performance snapshot
      await this.contracts.portfolioManager.createSnapshot(portfolioId);

    } catch (error) {
      console.error("Error handling portfolio rebalance:", error);
    }
  }

  private async monitorStopLoss(sessionId: bigint, initialAmount: bigint) {
    const maxLossAmount = (initialAmount * BigInt(this.config.riskManagement.maxLossPercent)) / 100n;

    // Check session performance
    const performance = await this.contracts.tradingBot.getSessionPerformance(sessionId);

    if (performance.profitLoss > maxLossAmount && performance.totalReturn < 0) {
      console.log(`🛑 Stop Loss triggered for session ${sessionId}`);
      // Auto-stop trading session
      // await this.contracts.tradingBot.stopTrading(sessionId);
    }
  }

  private async monitorTakeProfit(sessionId: bigint, initialAmount: bigint) {
    const targetProfitAmount = (initialAmount * BigInt(this.config.minProfitThreshold)) / 100n;

    const performance = await this.contracts.tradingBot.getSessionPerformance(sessionId);

    if (performance.profitLoss >= targetProfitAmount) {
      console.log(`💰 Take Profit triggered for session ${sessionId}`);
      // Auto-stop trading session to lock in profits
      // await this.contracts.tradingBot.stopTrading(sessionId);
    }
  }

  async startAutomation() {
    if (this.isRunning) {
      console.log("⚠️ Automation is already running");
      return;
    }

    if (!this.config.enabled) {
      console.log("⚠️ Automation is disabled in configuration");
      return;
    }

    console.log(`🚀 Starting trading automation (interval: ${this.config.intervalMinutes} minutes)`);

    this.isRunning = true;

    // Run automation checks
    this.intervalId = setInterval(async () => {
      await this.runAutomationCycle();
    }, this.config.intervalMinutes * 60 * 1000);

    // Run initial check
    await this.runAutomationCycle();
  }

  async stopAutomation() {
    if (!this.isRunning) {
      console.log("⚠️ Automation is not running");
      return;
    }

    console.log("🛑 Stopping trading automation");

    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async runAutomationCycle() {
    try {
      console.log("🔄 Running automation cycle...");

      // Check gas prices
      const gasPrice = await ethers.provider.getGasPrice();
      if (gasPrice > this.config.maxGasPrice) {
        console.log(`⛽ Gas price too high: ${gasPrice.toString()}, skipping automation`);
        return;
      }

      // Perform automated actions
      await this.performAutomatedRebalancing();
      await this.performAutomatedTradingChecks();
      await this.performMaintenanceTasks();

      console.log("✅ Automation cycle completed");

    } catch (error) {
      console.error("❌ Automation cycle failed:", error);
    }
  }

  private async performAutomatedRebalancing() {
    // Check all portfolios for rebalancing needs
    try {
      // Get platform metrics to see how many portfolios exist
      const metrics = await this.contracts.quantTradeAI.platformMetrics();
      console.log(`📊 Checking ${metrics.totalUsers} user portfolios for rebalancing...`);

      // In production, you would iterate through user portfolios
      // For now, this is a placeholder for the rebalancing logic

    } catch (error) {
      console.error("Error in automated rebalancing:", error);
    }
  }

  private async performAutomatedTradingChecks() {
    // Check active trading sessions for risk management
    try {
      console.log("🎯 Checking active trading sessions...");

      // Implementation would check all active sessions
      // and apply risk management rules

    } catch (error) {
      console.error("Error in trading checks:", error);
    }
  }

  private async performMaintenanceTasks() {
    // Perform routine maintenance
    try {
      console.log("🔧 Performing maintenance tasks...");

      // Collect accumulated fees
      const feeCollector = await this.contracts.quantTradeAI.treasuryConfig();
      // await this.contracts.quantTradeAI.collectAccumulatedFees(ethers.ZeroAddress);

      // Update platform metrics
      const currentBlock = await ethers.provider.getBlockNumber();
      console.log(`📦 Current block: ${currentBlock}`);

    } catch (error) {
      console.error("Error in maintenance tasks:", error);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      config: this.config,
      contractsLoaded: Object.keys(this.contracts).length > 0
    };
  }
}

// Default automation configuration
const defaultConfig: AutomationConfig = {
  enabled: process.env.ENABLE_AUTOMATION === 'true',
  intervalMinutes: parseInt(process.env.AUTOMATION_INTERVAL_MINUTES || '15'),
  maxGasPrice: parseInt(process.env.MAX_GAS_PRICE || '50000000000'), // 50 gwei
  minProfitThreshold: parseInt(process.env.MIN_PROFIT_THRESHOLD || '5'), // 5%
  riskManagement: {
    maxLossPercent: parseInt(process.env.MAX_LOSS_PERCENT || '10'), // 10%
    stopLossEnabled: process.env.ENABLE_STOP_LOSS === 'true',
    takeProfitEnabled: process.env.ENABLE_TAKE_PROFIT === 'true'
  }
};

// Main execution
async function main() {
  console.log("🤖 QuantAI Trading Automation System");
  console.log("===================================");

  const automation = new TradingAutomation(defaultConfig);

  if (await automation.initialize()) {
    await automation.startAutomation();

    // Keep the process running
    console.log("🎯 Automation system is running. Press Ctrl+C to stop.");

    process.on('SIGINT', async () => {
      console.log("\n🛑 Received interrupt signal. Stopping automation...");
      await automation.stopAutomation();
      process.exit(0);
    });

    // Keep alive
    setInterval(() => {
      const status = automation.getStatus();
      console.log(`💓 Automation heartbeat - Running: ${status.isRunning}`);
    }, 5 * 60 * 1000); // Every 5 minutes

  } else {
    console.log("❌ Failed to initialize automation system");
    process.exit(1);
  }
}

// Export for use in other scripts
export { TradingAutomation, AutomationConfig };

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}