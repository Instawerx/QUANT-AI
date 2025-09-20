// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title QuantTradeAI
 * @dev Enhanced smart contract for the QuantTrade AI platform with treasury integration,
 *      fee management, emergency controls, and advanced security features
 */
contract QuantTradeAI is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    struct UserAccount {
        uint256 ethBalance;
        mapping(address => uint256) tokenBalances;
        uint256 totalTradingVolume;
        uint256 lastActiveTime;
        bool isBlacklisted;
        uint8 riskLevel; // 1-10
        uint256 totalPlatformFeesPaid;
    }

    struct TreasuryConfig {
        address treasuryWallet;
        address feeCollector;
        uint256 platformFeePercent; // basis points (250 = 2.5%)
        uint256 withdrawalFeePercent; // basis points
        uint256 minDepositAmount;
        uint256 maxDepositAmount;
        bool feeCollectionActive;
    }

    struct PlatformMetrics {
        uint256 totalDeposits;
        uint256 totalWithdrawals;
        uint256 totalFeesCollected;
        uint256 totalUsers;
        uint256 totalTradingVolume;
    }

    // State variables
    mapping(address => UserAccount) public userAccounts;
    mapping(address => bool) public supportedTokens;
    mapping(address => bool) public authorizedOperators;

    TreasuryConfig public treasuryConfig;
    PlatformMetrics public platformMetrics;

    address[] public supportedTokenList;
    address[] public registeredUsers;

    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MAX_FEE_PERCENT = 1000; // 10% max

    bool public emergencyWithdrawalsOnly = false;
    uint256 public contractVersion = 1;

    // Events
    event Deposited(address indexed user, address indexed token, uint256 amount, uint256 fee);
    event Withdrawn(address indexed user, address indexed token, uint256 amount, uint256 fee);
    event TreasuryConfigUpdated(address treasuryWallet, address feeCollector, uint256 platformFee);
    event TokenSupportAdded(address indexed token);
    event TokenSupportRemoved(address indexed token);
    event UserBlacklisted(address indexed user, bool status);
    event OperatorAuthorized(address indexed operator, bool status);
    event EmergencyWithdrawalsToggled(bool enabled);
    event FeesCollected(address indexed token, uint256 amount);
    event RiskLevelUpdated(address indexed user, uint8 oldLevel, uint8 newLevel);

    // Errors
    error InvalidAmount();
    error InsufficientBalance();
    error TokenNotSupported();
    error UserIsBlacklisted();
    error UnauthorizedOperator();
    error InvalidFeePercent();
    error InvalidTreasuryAddress();
    error EmergencyWithdrawalsActive();
    error ExceedsMaxDeposit();
    error BelowMinDeposit();

    constructor(
        address _treasuryWallet,
        address _feeCollector,
        uint256 _platformFeePercent
    ) Ownable(msg.sender) {
        if (_treasuryWallet == address(0) || _feeCollector == address(0)) {
            revert InvalidTreasuryAddress();
        }
        if (_platformFeePercent > MAX_FEE_PERCENT) {
            revert InvalidFeePercent();
        }

        treasuryConfig = TreasuryConfig({
            treasuryWallet: _treasuryWallet,
            feeCollector: _feeCollector,
            platformFeePercent: _platformFeePercent,
            withdrawalFeePercent: 50, // 0.5% default
            minDepositAmount: 0.001 ether,
            maxDepositAmount: 1000 ether,
            feeCollectionActive: true
        });

        // Add ETH as supported token (address(0))
        supportedTokens[address(0)] = true;
        supportedTokenList.push(address(0));

        emit TreasuryConfigUpdated(_treasuryWallet, _feeCollector, _platformFeePercent);
    }

    modifier onlyAuthorized() {
        if (!authorizedOperators[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedOperator();
        }
        _;
    }

    modifier validToken(address token) {
        if (!supportedTokens[token]) {
            revert TokenNotSupported();
        }
        _;
    }

    modifier notBlacklisted(address user) {
        if (userAccounts[user].isBlacklisted) {
            revert UserIsBlacklisted();
        }
        _;
    }

    modifier onlyNormalOperations() {
        if (emergencyWithdrawalsOnly) {
            revert EmergencyWithdrawalsActive();
        }
        _;
    }

    /**
     * @dev Deposit ETH with fee collection
     */
    function depositETH()
        external
        payable
        whenNotPaused
        nonReentrant
        notBlacklisted(msg.sender)
        onlyNormalOperations
    {
        if (msg.value == 0) revert InvalidAmount();
        if (msg.value < treasuryConfig.minDepositAmount) revert BelowMinDeposit();
        if (msg.value > treasuryConfig.maxDepositAmount) revert ExceedsMaxDeposit();

        uint256 fee = 0;
        if (treasuryConfig.feeCollectionActive) {
            fee = (msg.value * treasuryConfig.platformFeePercent) / BASIS_POINTS;
            if (fee > 0) {
                (bool success, ) = payable(treasuryConfig.feeCollector).call{value: fee}("");
                require(success, "Fee transfer failed");
            }
        }

        uint256 depositAmount = msg.value - fee;

        UserAccount storage user = userAccounts[msg.sender];
        if (user.lastActiveTime == 0) {
            registeredUsers.push(msg.sender);
            platformMetrics.totalUsers++;
            user.riskLevel = 5; // Default medium risk
        }

        user.ethBalance += depositAmount;
        user.lastActiveTime = block.timestamp;

        platformMetrics.totalDeposits += depositAmount;
        platformMetrics.totalFeesCollected += fee;

        emit Deposited(msg.sender, address(0), depositAmount, fee);
    }

    /**
     * @dev Deposit ERC20 tokens with fee collection
     */
    function depositToken(address token, uint256 amount)
        external
        whenNotPaused
        nonReentrant
        validToken(token)
        notBlacklisted(msg.sender)
        onlyNormalOperations
    {
        if (amount == 0) revert InvalidAmount();
        if (token == address(0)) revert TokenNotSupported();

        IERC20 tokenContract = IERC20(token);

        uint256 fee = 0;
        if (treasuryConfig.feeCollectionActive) {
            fee = (amount * treasuryConfig.platformFeePercent) / BASIS_POINTS;
        }

        uint256 depositAmount = amount - fee;

        // Transfer tokens from user
        tokenContract.safeTransferFrom(msg.sender, address(this), amount);

        // Transfer fee to fee collector
        if (fee > 0) {
            tokenContract.safeTransfer(treasuryConfig.feeCollector, fee);
        }

        UserAccount storage user = userAccounts[msg.sender];
        if (user.lastActiveTime == 0) {
            registeredUsers.push(msg.sender);
            platformMetrics.totalUsers++;
            user.riskLevel = 5;
        }

        user.tokenBalances[token] += depositAmount;
        user.lastActiveTime = block.timestamp;

        platformMetrics.totalDeposits += depositAmount;
        platformMetrics.totalFeesCollected += fee;

        emit Deposited(msg.sender, token, depositAmount, fee);
    }

    /**
     * @dev Withdraw ETH with fee collection
     */
    function withdrawETH(uint256 amount)
        external
        whenNotPaused
        nonReentrant
        notBlacklisted(msg.sender)
    {
        if (amount == 0) revert InvalidAmount();

        UserAccount storage user = userAccounts[msg.sender];
        if (user.ethBalance < amount) revert InsufficientBalance();

        uint256 fee = 0;
        if (treasuryConfig.feeCollectionActive && !emergencyWithdrawalsOnly) {
            fee = (amount * treasuryConfig.withdrawalFeePercent) / BASIS_POINTS;
            if (fee > 0) {
                (bool feeSuccess, ) = payable(treasuryConfig.feeCollector).call{value: fee}("");
                require(feeSuccess, "Fee transfer failed");
            }
        }

        uint256 withdrawAmount = amount - fee;
        user.ethBalance -= amount;
        user.lastActiveTime = block.timestamp;

        (bool success, ) = payable(msg.sender).call{value: withdrawAmount}("");
        require(success, "Withdrawal failed");

        platformMetrics.totalWithdrawals += withdrawAmount;
        platformMetrics.totalFeesCollected += fee;

        emit Withdrawn(msg.sender, address(0), withdrawAmount, fee);
    }

    /**
     * @dev Withdraw ERC20 tokens with fee collection
     */
    function withdrawToken(address token, uint256 amount)
        external
        whenNotPaused
        nonReentrant
        validToken(token)
        notBlacklisted(msg.sender)
    {
        if (amount == 0) revert InvalidAmount();
        if (token == address(0)) revert TokenNotSupported();

        UserAccount storage user = userAccounts[msg.sender];
        if (user.tokenBalances[token] < amount) revert InsufficientBalance();

        IERC20 tokenContract = IERC20(token);

        uint256 fee = 0;
        if (treasuryConfig.feeCollectionActive && !emergencyWithdrawalsOnly) {
            fee = (amount * treasuryConfig.withdrawalFeePercent) / BASIS_POINTS;
            if (fee > 0) {
                tokenContract.safeTransfer(treasuryConfig.feeCollector, fee);
            }
        }

        uint256 withdrawAmount = amount - fee;
        user.tokenBalances[token] -= amount;
        user.lastActiveTime = block.timestamp;

        tokenContract.safeTransfer(msg.sender, withdrawAmount);

        platformMetrics.totalWithdrawals += withdrawAmount;
        platformMetrics.totalFeesCollected += fee;

        emit Withdrawn(msg.sender, token, withdrawAmount, fee);
    }

    // View functions
    function getUserBalance(address user, address token) external view returns (uint256) {
        if (token == address(0)) {
            return userAccounts[user].ethBalance;
        }
        return userAccounts[user].tokenBalances[token];
    }

    function getUserAccount(address user) external view returns (
        uint256 ethBalance,
        uint256 totalTradingVolume,
        uint256 lastActiveTime,
        bool isBlacklisted,
        uint8 riskLevel,
        uint256 totalPlatformFeesPaid
    ) {
        UserAccount storage account = userAccounts[user];
        return (
            account.ethBalance,
            account.totalTradingVolume,
            account.lastActiveTime,
            account.isBlacklisted,
            account.riskLevel,
            account.totalPlatformFeesPaid
        );
    }

    function getContractBalance(address token) external view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        }
        return IERC20(token).balanceOf(address(this));
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokenList;
    }

    // Admin functions
    function updateTreasuryConfig(
        address newTreasuryWallet,
        address newFeeCollector,
        uint256 newPlatformFeePercent,
        uint256 newWithdrawalFeePercent
    ) external onlyOwner {
        if (newTreasuryWallet == address(0) || newFeeCollector == address(0)) {
            revert InvalidTreasuryAddress();
        }
        if (newPlatformFeePercent > MAX_FEE_PERCENT || newWithdrawalFeePercent > MAX_FEE_PERCENT) {
            revert InvalidFeePercent();
        }

        treasuryConfig.treasuryWallet = newTreasuryWallet;
        treasuryConfig.feeCollector = newFeeCollector;
        treasuryConfig.platformFeePercent = newPlatformFeePercent;
        treasuryConfig.withdrawalFeePercent = newWithdrawalFeePercent;

        emit TreasuryConfigUpdated(newTreasuryWallet, newFeeCollector, newPlatformFeePercent);
    }

    function addSupportedToken(address token) external onlyOwner {
        if (!supportedTokens[token]) {
            supportedTokens[token] = true;
            supportedTokenList.push(token);
            emit TokenSupportAdded(token);
        }
    }

    function removeSupportedToken(address token) external onlyOwner {
        if (supportedTokens[token]) {
            supportedTokens[token] = false;

            for (uint256 i = 0; i < supportedTokenList.length; i++) {
                if (supportedTokenList[i] == token) {
                    supportedTokenList[i] = supportedTokenList[supportedTokenList.length - 1];
                    supportedTokenList.pop();
                    break;
                }
            }

            emit TokenSupportRemoved(token);
        }
    }

    function setUserBlacklist(address user, bool blacklisted) external onlyOwner {
        userAccounts[user].isBlacklisted = blacklisted;
        emit UserBlacklisted(user, blacklisted);
    }

    function setOperatorAuthorization(address operator, bool authorized) external onlyOwner {
        authorizedOperators[operator] = authorized;
        emit OperatorAuthorized(operator, authorized);
    }

    function setUserRiskLevel(address user, uint8 riskLevel) external onlyAuthorized {
        require(riskLevel >= 1 && riskLevel <= 10, "Invalid risk level");

        uint8 oldLevel = userAccounts[user].riskLevel;
        userAccounts[user].riskLevel = riskLevel;

        emit RiskLevelUpdated(user, oldLevel, riskLevel);
    }

    function setDepositLimits(uint256 minAmount, uint256 maxAmount) external onlyOwner {
        treasuryConfig.minDepositAmount = minAmount;
        treasuryConfig.maxDepositAmount = maxAmount;
    }

    function toggleFeeCollection(bool active) external onlyOwner {
        treasuryConfig.feeCollectionActive = active;
    }

    function toggleEmergencyWithdrawals(bool enabled) external onlyOwner {
        emergencyWithdrawalsOnly = enabled;
        emit EmergencyWithdrawalsToggled(enabled);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency functions
    function emergencyWithdrawTreasury(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            (bool success, ) = payable(treasuryConfig.treasuryWallet).call{value: amount}("");
            require(success, "Emergency withdrawal failed");
        } else {
            IERC20(token).safeTransfer(treasuryConfig.treasuryWallet, amount);
        }
    }

    function collectAccumulatedFees(address token) external onlyAuthorized {
        uint256 amount;

        if (token == address(0)) {
            amount = address(this).balance;
            if (amount > 0) {
                (bool success, ) = payable(treasuryConfig.feeCollector).call{value: amount}("");
                require(success, "Fee collection failed");
            }
        } else {
            amount = IERC20(token).balanceOf(address(this));
            if (amount > 0) {
                IERC20(token).safeTransfer(treasuryConfig.feeCollector, amount);
            }
        }

        if (amount > 0) {
            emit FeesCollected(token, amount);
        }
    }

    // Fallback functions
    receive() external payable {
        // Only accept ETH from fee collector or treasury
        require(
            msg.sender == treasuryConfig.feeCollector ||
            msg.sender == treasuryConfig.treasuryWallet ||
            msg.sender == owner(),
            "Direct ETH transfers not allowed"
        );
    }

    fallback() external payable {
        revert("Function not found");
    }
}
