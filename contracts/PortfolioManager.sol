// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract PortfolioManager is Ownable, ReentrancyGuard, Pausable {
    struct Portfolio {
        string name;
        address owner;
        uint256 totalValue;
        address[] tokens;
        uint256[] balances;
        uint256[] weights; // Percentage allocations (0-10000 = 0-100%)
        uint256 createdAt;
        uint256 lastRebalanced;
        bool isActive;
    }

    struct PortfolioSnapshot {
        uint256 portfolioId;
        uint256 totalValue;
        uint256[] balances;
        uint256 timestamp;
        uint256 performanceChange; // Percentage change since last snapshot
    }

    // State variables
    mapping(uint256 => Portfolio) public portfolios;
    mapping(address => uint256[]) public userPortfolios;
    mapping(uint256 => PortfolioSnapshot[]) public portfolioSnapshots;

    uint256 public nextPortfolioId = 1;
    uint256 public constant MAX_TOKENS_PER_PORTFOLIO = 20;
    uint256 public constant TOTAL_WEIGHT = 10000; // 100% = 10000
    uint256 public rebalanceThreshold = 500; // 5% threshold for automatic rebalancing
    uint256 public snapshotInterval = 1 days;

    // Supported tokens mapping
    mapping(address => bool) public supportedTokens;
    address[] public supportedTokenList;

    // Events
    event PortfolioCreated(
        uint256 indexed portfolioId,
        address indexed owner,
        string name,
        address[] tokens,
        uint256[] weights
    );

    event PortfolioRebalanced(
        uint256 indexed portfolioId,
        uint256[] oldBalances,
        uint256[] newBalances
    );

    event PortfolioSnapshotCreated(
        uint256 indexed portfolioId,
        uint256 totalValue,
        uint256 performanceChange,
        uint256 timestamp
    );

    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);

    // Errors
    error InvalidPortfolioId();
    error UnauthorizedAccess();
    error InvalidTokenCount();
    error InvalidWeights();
    error TokenNotSupported();
    error PortfolioNotActive();
    error InsufficientBalance();

    constructor() Ownable(msg.sender) {
        // Add ETH as default supported token (address(0))
        supportedTokens[address(0)] = true;
        supportedTokenList.push(address(0));
    }

    modifier validPortfolio(uint256 portfolioId) {
        if (portfolioId == 0 || portfolioId >= nextPortfolioId) {
            revert InvalidPortfolioId();
        }
        _;
    }

    modifier onlyPortfolioOwner(uint256 portfolioId) {
        if (portfolios[portfolioId].owner != msg.sender) {
            revert UnauthorizedAccess();
        }
        _;
    }

    function createPortfolio(
        string memory name,
        address[] memory tokens,
        uint256[] memory weights
    ) external whenNotPaused nonReentrant returns (uint256) {
        // Validate inputs
        if (tokens.length == 0 || tokens.length > MAX_TOKENS_PER_PORTFOLIO) {
            revert InvalidTokenCount();
        }

        if (tokens.length != weights.length) {
            revert InvalidWeights();
        }

        // Validate weights sum to 100%
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        if (totalWeight != TOTAL_WEIGHT) {
            revert InvalidWeights();
        }

        // Validate all tokens are supported
        for (uint256 i = 0; i < tokens.length; i++) {
            if (!supportedTokens[tokens[i]]) {
                revert TokenNotSupported();
            }
        }

        uint256 portfolioId = nextPortfolioId++;

        // Initialize balances array
        uint256[] memory initialBalances = new uint256[](tokens.length);

        Portfolio storage portfolio = portfolios[portfolioId];
        portfolio.name = name;
        portfolio.owner = msg.sender;
        portfolio.totalValue = 0;
        portfolio.tokens = tokens;
        portfolio.balances = initialBalances;
        portfolio.weights = weights;
        portfolio.createdAt = block.timestamp;
        portfolio.lastRebalanced = block.timestamp;
        portfolio.isActive = true;

        userPortfolios[msg.sender].push(portfolioId);

        emit PortfolioCreated(portfolioId, msg.sender, name, tokens, weights);

        return portfolioId;
    }

    function depositToPortfolio(uint256 portfolioId, uint256 tokenIndex)
        external
        payable
        validPortfolio(portfolioId)
        onlyPortfolioOwner(portfolioId)
        whenNotPaused
        nonReentrant
    {
        Portfolio storage portfolio = portfolios[portfolioId];

        if (!portfolio.isActive) {
            revert PortfolioNotActive();
        }

        if (tokenIndex >= portfolio.tokens.length) {
            revert InvalidTokenCount();
        }

        address token = portfolio.tokens[tokenIndex];

        if (token == address(0)) {
            // ETH deposit
            if (msg.value == 0) {
                revert InsufficientBalance();
            }
            portfolio.balances[tokenIndex] += msg.value;
            portfolio.totalValue += msg.value;
        } else {
            // ERC20 token deposit would be implemented here
            // For now, this is a placeholder
            revert("ERC20 deposits not implemented");
        }

        // Check if rebalancing is needed
        _checkRebalancing(portfolioId);
    }

    function withdrawFromPortfolio(
        uint256 portfolioId,
        uint256 tokenIndex,
        uint256 amount
    )
        external
        validPortfolio(portfolioId)
        onlyPortfolioOwner(portfolioId)
        whenNotPaused
        nonReentrant
    {
        Portfolio storage portfolio = portfolios[portfolioId];

        if (!portfolio.isActive) {
            revert PortfolioNotActive();
        }

        if (tokenIndex >= portfolio.tokens.length) {
            revert InvalidTokenCount();
        }

        if (portfolio.balances[tokenIndex] < amount) {
            revert InsufficientBalance();
        }

        address token = portfolio.tokens[tokenIndex];
        portfolio.balances[tokenIndex] -= amount;
        portfolio.totalValue -= amount;

        if (token == address(0)) {
            // ETH withdrawal
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 token withdrawal would be implemented here
            revert("ERC20 withdrawals not implemented");
        }

        // Check if rebalancing is needed
        _checkRebalancing(portfolioId);
    }

    function rebalancePortfolio(uint256 portfolioId)
        external
        validPortfolio(portfolioId)
        onlyPortfolioOwner(portfolioId)
        whenNotPaused
        nonReentrant
    {
        _rebalancePortfolio(portfolioId);
    }

    function createSnapshot(uint256 portfolioId)
        external
        validPortfolio(portfolioId)
        onlyPortfolioOwner(portfolioId)
        whenNotPaused
    {
        Portfolio storage portfolio = portfolios[portfolioId];

        if (!portfolio.isActive) {
            revert PortfolioNotActive();
        }

        // Calculate performance change
        uint256 performanceChange = 0;
        PortfolioSnapshot[] storage snapshots = portfolioSnapshots[portfolioId];

        if (snapshots.length > 0) {
            PortfolioSnapshot storage lastSnapshot = snapshots[snapshots.length - 1];
            if (lastSnapshot.totalValue > 0) {
                performanceChange = ((portfolio.totalValue - lastSnapshot.totalValue) * 10000) / lastSnapshot.totalValue;
            }
        }

        // Create new snapshot
        snapshots.push(PortfolioSnapshot({
            portfolioId: portfolioId,
            totalValue: portfolio.totalValue,
            balances: portfolio.balances,
            timestamp: block.timestamp,
            performanceChange: performanceChange
        }));

        emit PortfolioSnapshotCreated(portfolioId, portfolio.totalValue, performanceChange, block.timestamp);
    }

    function _rebalancePortfolio(uint256 portfolioId) internal {
        Portfolio storage portfolio = portfolios[portfolioId];

        uint256[] memory oldBalances = new uint256[](portfolio.balances.length);
        for (uint256 i = 0; i < portfolio.balances.length; i++) {
            oldBalances[i] = portfolio.balances[i];
        }

        // Calculate target balances based on weights
        for (uint256 i = 0; i < portfolio.tokens.length; i++) {
            uint256 targetBalance = (portfolio.totalValue * portfolio.weights[i]) / TOTAL_WEIGHT;
            portfolio.balances[i] = targetBalance;
        }

        portfolio.lastRebalanced = block.timestamp;

        emit PortfolioRebalanced(portfolioId, oldBalances, portfolio.balances);
    }

    function _checkRebalancing(uint256 portfolioId) internal {
        Portfolio storage portfolio = portfolios[portfolioId];

        if (block.timestamp - portfolio.lastRebalanced >= snapshotInterval) {
            // Check if any token allocation deviates by more than threshold
            bool needsRebalancing = false;

            for (uint256 i = 0; i < portfolio.tokens.length; i++) {
                if (portfolio.totalValue > 0) {
                    uint256 currentAllocation = (portfolio.balances[i] * TOTAL_WEIGHT) / portfolio.totalValue;
                    uint256 targetAllocation = portfolio.weights[i];

                    uint256 deviation = currentAllocation > targetAllocation
                        ? currentAllocation - targetAllocation
                        : targetAllocation - currentAllocation;

                    if (deviation > rebalanceThreshold) {
                        needsRebalancing = true;
                        break;
                    }
                }
            }

            if (needsRebalancing) {
                _rebalancePortfolio(portfolioId);
            }
        }
    }

    // View functions
    function getPortfolio(uint256 portfolioId)
        external
        view
        validPortfolio(portfolioId)
        returns (
            string memory name,
            address owner,
            uint256 totalValue,
            address[] memory tokens,
            uint256[] memory balances,
            uint256[] memory weights,
            uint256 createdAt,
            uint256 lastRebalanced,
            bool isActive
        )
    {
        Portfolio storage portfolio = portfolios[portfolioId];
        return (
            portfolio.name,
            portfolio.owner,
            portfolio.totalValue,
            portfolio.tokens,
            portfolio.balances,
            portfolio.weights,
            portfolio.createdAt,
            portfolio.lastRebalanced,
            portfolio.isActive
        );
    }

    function getUserPortfolios(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userPortfolios[user];
    }

    function getPortfolioSnapshots(uint256 portfolioId)
        external
        view
        validPortfolio(portfolioId)
        returns (PortfolioSnapshot[] memory)
    {
        return portfolioSnapshots[portfolioId];
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokenList;
    }

    // Admin functions
    function addSupportedToken(address token) external onlyOwner {
        if (!supportedTokens[token]) {
            supportedTokens[token] = true;
            supportedTokenList.push(token);
            emit TokenAdded(token);
        }
    }

    function removeSupportedToken(address token) external onlyOwner {
        if (supportedTokens[token]) {
            supportedTokens[token] = false;

            // Remove from array
            for (uint256 i = 0; i < supportedTokenList.length; i++) {
                if (supportedTokenList[i] == token) {
                    supportedTokenList[i] = supportedTokenList[supportedTokenList.length - 1];
                    supportedTokenList.pop();
                    break;
                }
            }

            emit TokenRemoved(token);
        }
    }

    function setRebalanceThreshold(uint256 newThreshold) external onlyOwner {
        rebalanceThreshold = newThreshold;
    }

    function setSnapshotInterval(uint256 newInterval) external onlyOwner {
        snapshotInterval = newInterval;
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
}