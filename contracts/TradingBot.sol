// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TradingBot is Ownable, ReentrancyGuard, Pausable {
    struct TradingSession {
        address owner;
        string strategy;
        uint256 startAmount;
        uint256 currentAmount;
        uint8 riskLevel; // 1-10 scale
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 maxDrawdown;
        uint256 highWaterMark;
    }

    struct Trade {
        uint256 sessionId;
        address fromToken;
        address toToken;
        uint256 amountIn;
        uint256 amountOut;
        uint256 timestamp;
        bool isSuccessful;
        string tradeType; // "buy", "sell", "swap"
        uint256 gasUsed;
    }

    struct Strategy {
        string name;
        string description;
        uint8 minRiskLevel;
        uint8 maxRiskLevel;
        uint256 minAmount;
        bool isActive;
        uint256 successRate; // Percentage * 100 (e.g., 7500 = 75%)
        uint256 avgReturn; // Percentage * 100
    }

    // State variables
    mapping(uint256 => TradingSession) public tradingSessions;
    mapping(address => uint256[]) public userSessions;
    mapping(uint256 => Trade[]) public sessionTrades;
    mapping(string => Strategy) public strategies;

    uint256 public nextSessionId = 1;
    uint256 public minimumTradingAmount = 0.01 ether;
    uint256 public maximumTradingAmount = 100 ether;
    uint256 public platformFeePercentage = 250; // 2.5% = 250 basis points
    uint256 public constant BASIS_POINTS = 10000;

    string[] public availableStrategies;
    address public feeCollector;
    bool public emergencyStop = false;

    // Events
    event TradingStarted(
        uint256 indexed sessionId,
        address indexed owner,
        string strategy,
        uint256 amount,
        uint8 riskLevel
    );

    event TradingStopped(
        uint256 indexed sessionId,
        uint256 finalAmount,
        uint256 totalTrades,
        uint256 successfulTrades
    );

    event TradeExecuted(
        uint256 indexed sessionId,
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 amountOut,
        bool isSuccessful
    );

    event StrategyAdded(string name, uint8 minRisk, uint8 maxRisk);
    event StrategyUpdated(string name, bool isActive);
    event EmergencyStopActivated();
    event EmergencyStopDeactivated();

    // Errors
    error InvalidSessionId();
    error UnauthorizedAccess();
    error InvalidAmount();
    error InvalidRiskLevel();
    error StrategyNotFound();
    error StrategyNotActive();
    error SessionNotActive();
    error SessionAlreadyActive();
    error EmergencyStopActive();
    error InsufficientBalance();

    constructor(address _feeCollector) Ownable(msg.sender) {
        feeCollector = _feeCollector;

        // Initialize default strategies
        _addStrategy("Conservative", "Low-risk, stable returns", 1, 3, 0.01 ether, 6500, 800);
        _addStrategy("Moderate", "Balanced risk-reward", 3, 6, 0.05 ether, 7200, 1500);
        _addStrategy("Aggressive", "High-risk, high-reward", 6, 10, 0.1 ether, 5800, 3200);
        _addStrategy("DeFi Yield", "Yield farming strategies", 4, 8, 0.2 ether, 6800, 2100);
        _addStrategy("Arbitrage", "Cross-exchange arbitrage", 2, 5, 1 ether, 8500, 1200);
    }

    modifier validSession(uint256 sessionId) {
        if (sessionId == 0 || sessionId >= nextSessionId) {
            revert InvalidSessionId();
        }
        _;
    }

    modifier onlySessionOwner(uint256 sessionId) {
        if (tradingSessions[sessionId].owner != msg.sender) {
            revert UnauthorizedAccess();
        }
        _;
    }

    modifier notEmergencyStop() {
        if (emergencyStop) {
            revert EmergencyStopActive();
        }
        _;
    }

    function startTrading(
        string memory strategyName,
        uint8 riskLevel
    ) external payable whenNotPaused notEmergencyStop nonReentrant returns (uint256) {
        // Validate amount
        if (msg.value < minimumTradingAmount || msg.value > maximumTradingAmount) {
            revert InvalidAmount();
        }

        // Validate risk level
        if (riskLevel < 1 || riskLevel > 10) {
            revert InvalidRiskLevel();
        }

        // Validate strategy
        Strategy storage strategy = strategies[strategyName];
        if (bytes(strategy.name).length == 0) {
            revert StrategyNotFound();
        }

        if (!strategy.isActive) {
            revert StrategyNotActive();
        }

        if (riskLevel < strategy.minRiskLevel || riskLevel > strategy.maxRiskLevel) {
            revert InvalidRiskLevel();
        }

        if (msg.value < strategy.minAmount) {
            revert InvalidAmount();
        }

        uint256 sessionId = nextSessionId++;

        // Calculate platform fee
        uint256 platformFee = (msg.value * platformFeePercentage) / BASIS_POINTS;
        uint256 tradingAmount = msg.value - platformFee;

        // Transfer fee to fee collector
        if (platformFee > 0) {
            (bool feeSuccess, ) = payable(feeCollector).call{value: platformFee}("");
            require(feeSuccess, "Fee transfer failed");
        }

        // Create trading session
        TradingSession storage session = tradingSessions[sessionId];
        session.owner = msg.sender;
        session.strategy = strategyName;
        session.startAmount = tradingAmount;
        session.currentAmount = tradingAmount;
        session.riskLevel = riskLevel;
        session.startTime = block.timestamp;
        session.isActive = true;
        session.highWaterMark = tradingAmount;

        userSessions[msg.sender].push(sessionId);

        emit TradingStarted(sessionId, msg.sender, strategyName, tradingAmount, riskLevel);

        return sessionId;
    }

    function stopTrading(uint256 sessionId)
        external
        validSession(sessionId)
        onlySessionOwner(sessionId)
        whenNotPaused
        nonReentrant
    {
        TradingSession storage session = tradingSessions[sessionId];

        if (!session.isActive) {
            revert SessionNotActive();
        }

        session.isActive = false;
        session.endTime = block.timestamp;

        // Transfer remaining amount back to user
        uint256 amount = session.currentAmount;
        if (amount > 0) {
            session.currentAmount = 0;
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            require(success, "Withdrawal failed");
        }

        emit TradingStopped(sessionId, amount, session.totalTrades, session.successfulTrades);
    }

    function simulateTrade(
        uint256 sessionId,
        address fromToken,
        address toToken,
        uint256 amountIn,
        bool isSuccessful
    ) external onlyOwner validSession(sessionId) {
        TradingSession storage session = tradingSessions[sessionId];

        if (!session.isActive) {
            revert SessionNotActive();
        }

        // Simulate trade execution
        uint256 amountOut = amountIn;

        if (isSuccessful) {
            // Simulate profit based on strategy and risk level
            Strategy storage strategy = strategies[session.strategy];
            uint256 baseReturn = strategy.avgReturn;

            // Add risk-based variance
            uint256 riskMultiplier = 50 + (session.riskLevel * 10); // 60-150% of base return
            uint256 adjustedReturn = (baseReturn * riskMultiplier) / 100;

            // Random variance (simplified for demo)
            uint256 variance = (block.timestamp % 200) - 100; // -100 to +99 basis points
            amountOut = amountIn + ((amountIn * (adjustedReturn + variance)) / BASIS_POINTS);

            session.successfulTrades++;
        } else {
            // Simulate loss
            uint256 lossPercentage = 100 + (session.riskLevel * 50); // 150-650 basis points
            amountOut = amountIn - ((amountIn * lossPercentage) / BASIS_POINTS);
        }

        // Update session
        session.currentAmount = session.currentAmount - amountIn + amountOut;
        session.totalTrades++;

        // Update high water mark and drawdown
        if (session.currentAmount > session.highWaterMark) {
            session.highWaterMark = session.currentAmount;
        }

        uint256 currentDrawdown = ((session.highWaterMark - session.currentAmount) * BASIS_POINTS) / session.highWaterMark;
        if (currentDrawdown > session.maxDrawdown) {
            session.maxDrawdown = currentDrawdown;
        }

        // Record trade
        sessionTrades[sessionId].push(Trade({
            sessionId: sessionId,
            fromToken: fromToken,
            toToken: toToken,
            amountIn: amountIn,
            amountOut: amountOut,
            timestamp: block.timestamp,
            isSuccessful: isSuccessful,
            tradeType: "swap",
            gasUsed: 21000 // Simplified
        }));

        emit TradeExecuted(sessionId, fromToken, toToken, amountIn, amountOut, isSuccessful);
    }

    // View functions
    function getTradingSession(uint256 sessionId)
        external
        view
        validSession(sessionId)
        returns (
            address owner,
            string memory strategy,
            uint256 startAmount,
            uint256 currentAmount,
            uint8 riskLevel,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 totalTrades,
            uint256 successfulTrades,
            uint256 maxDrawdown
        )
    {
        TradingSession storage session = tradingSessions[sessionId];
        return (
            session.owner,
            session.strategy,
            session.startAmount,
            session.currentAmount,
            session.riskLevel,
            session.startTime,
            session.endTime,
            session.isActive,
            session.totalTrades,
            session.successfulTrades,
            session.maxDrawdown
        );
    }

    function getUserSessions(address user) external view returns (uint256[] memory) {
        return userSessions[user];
    }

    function getSessionTrades(uint256 sessionId)
        external
        view
        validSession(sessionId)
        returns (Trade[] memory)
    {
        return sessionTrades[sessionId];
    }

    function getStrategy(string memory name)
        external
        view
        returns (
            string memory description,
            uint8 minRiskLevel,
            uint8 maxRiskLevel,
            uint256 minAmount,
            bool isActive,
            uint256 successRate,
            uint256 avgReturn
        )
    {
        Strategy storage strategy = strategies[name];
        return (
            strategy.description,
            strategy.minRiskLevel,
            strategy.maxRiskLevel,
            strategy.minAmount,
            strategy.isActive,
            strategy.successRate,
            strategy.avgReturn
        );
    }

    function getAvailableStrategies() external view returns (string[] memory) {
        return availableStrategies;
    }

    function getSessionPerformance(uint256 sessionId)
        external
        view
        validSession(sessionId)
        returns (
            uint256 totalReturn,
            uint256 successRate,
            uint256 profitLoss,
            uint256 maxDrawdown
        )
    {
        TradingSession storage session = tradingSessions[sessionId];

        totalReturn = session.startAmount > 0
            ? ((session.currentAmount - session.startAmount) * BASIS_POINTS) / session.startAmount
            : 0;

        successRate = session.totalTrades > 0
            ? (session.successfulTrades * BASIS_POINTS) / session.totalTrades
            : 0;

        profitLoss = session.currentAmount > session.startAmount
            ? session.currentAmount - session.startAmount
            : session.startAmount - session.currentAmount;

        maxDrawdown = session.maxDrawdown;
    }

    // Internal functions
    function _addStrategy(
        string memory name,
        string memory description,
        uint8 minRisk,
        uint8 maxRisk,
        uint256 minAmount,
        uint256 successRate,
        uint256 avgReturn
    ) internal {
        strategies[name] = Strategy({
            name: name,
            description: description,
            minRiskLevel: minRisk,
            maxRiskLevel: maxRisk,
            minAmount: minAmount,
            isActive: true,
            successRate: successRate,
            avgReturn: avgReturn
        });

        availableStrategies.push(name);
    }

    // Admin functions
    function addStrategy(
        string memory name,
        string memory description,
        uint8 minRisk,
        uint8 maxRisk,
        uint256 minAmount,
        uint256 successRate,
        uint256 avgReturn
    ) external onlyOwner {
        if (bytes(strategies[name].name).length == 0) {
            availableStrategies.push(name);
        }

        strategies[name] = Strategy({
            name: name,
            description: description,
            minRiskLevel: minRisk,
            maxRiskLevel: maxRisk,
            minAmount: minAmount,
            isActive: true,
            successRate: successRate,
            avgReturn: avgReturn
        });

        emit StrategyAdded(name, minRisk, maxRisk);
    }

    function updateStrategyStatus(string memory name, bool isActive) external onlyOwner {
        if (bytes(strategies[name].name).length == 0) {
            revert StrategyNotFound();
        }

        strategies[name].isActive = isActive;
        emit StrategyUpdated(name, isActive);
    }

    function setMinimumTradingAmount(uint256 amount) external onlyOwner {
        minimumTradingAmount = amount;
    }

    function setMaximumTradingAmount(uint256 amount) external onlyOwner {
        maximumTradingAmount = amount;
    }

    function setPlatformFeePercentage(uint256 percentage) external onlyOwner {
        require(percentage <= 1000, "Fee too high"); // Max 10%
        platformFeePercentage = percentage;
    }

    function setFeeCollector(address newFeeCollector) external onlyOwner {
        feeCollector = newFeeCollector;
    }

    function activateEmergencyStop() external onlyOwner {
        emergencyStop = true;
        emit EmergencyStopActivated();
    }

    function deactivateEmergencyStop() external onlyOwner {
        emergencyStop = false;
        emit EmergencyStopDeactivated();
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "Emergency withdraw failed");
        }
    }

    function forceStopSession(uint256 sessionId) external onlyOwner validSession(sessionId) {
        TradingSession storage session = tradingSessions[sessionId];

        if (session.isActive) {
            session.isActive = false;
            session.endTime = block.timestamp;

            // Transfer remaining amount back to session owner
            uint256 amount = session.currentAmount;
            if (amount > 0) {
                session.currentAmount = 0;
                (bool success, ) = payable(session.owner).call{value: amount}("");
                require(success, "Force stop withdrawal failed");
            }
        }
    }
}