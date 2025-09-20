// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title QuantMissionAI
 * @dev Smart contract for mission-based contributions where funds are immediately
 *      transferred to treasury wallet for institutional control and mission allocation
 */
contract QuantMissionAI is Ownable, ReentrancyGuard, Pausable {

    struct MissionContribution {
        address contributor;
        uint256 amount;
        uint256 gasBuffer;
        uint256 timestamp;
        string missionType; // "AI Development", "Research", "Operations", etc.
        bool agreementConfirmed;
        bytes32 agreementHash; // Hash of the agreement terms
    }

    struct TreasuryConfig {
        address treasuryWallet;
        uint256 gasBufferPercent; // Percentage kept as gas buffer (e.g., 100 = 1%)
        uint256 minContributionAmount;
        uint256 maxContributionAmount;
        bool contributionsActive;
    }

    struct PlatformMetrics {
        uint256 totalContributions;
        uint256 totalContributors;
        uint256 totalMissionFunding;
        uint256 totalGasBufferReserved;
    }

    // State variables
    mapping(address => MissionContribution[]) public userContributions;
    mapping(string => uint256) public missionFunding; // Track funding per mission type
    mapping(address => bool) public authorizedOperators;
    mapping(bytes32 => bool) public validAgreements; // Valid agreement hashes

    TreasuryConfig public treasuryConfig;
    PlatformMetrics public platformMetrics;

    address[] public contributors;
    string[] public availableMissions;

    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MAX_GAS_BUFFER = 500; // Max 5% gas buffer

    // Events
    event MissionContribution(
        address indexed contributor,
        uint256 amount,
        uint256 gasBuffer,
        string missionType,
        bytes32 agreementHash
    );

    event FundsTransferredToTreasury(
        address indexed contributor,
        uint256 amount,
        string missionType
    );

    event MissionAdded(string missionType);
    event AgreementRegistered(bytes32 agreementHash);
    event TreasuryConfigUpdated(address treasuryWallet, uint256 gasBufferPercent);

    // Errors
    error InvalidAmount();
    error InvalidTreasuryAddress();
    error InvalidGasBuffer();
    error ContributionsDisabled();
    error UnauthorizedOperator();
    error InvalidMission();
    error AgreementNotValid();
    error BelowMinContribution();
    error ExceedsMaxContribution();
    error TreasuryTransferFailed();

    constructor(
        address _treasuryWallet,
        uint256 _gasBufferPercent
    ) Ownable(msg.sender) {
        if (_treasuryWallet == address(0)) {
            revert InvalidTreasuryAddress();
        }
        if (_gasBufferPercent > MAX_GAS_BUFFER) {
            revert InvalidGasBuffer();
        }

        treasuryConfig = TreasuryConfig({
            treasuryWallet: _treasuryWallet,
            gasBufferPercent: _gasBufferPercent,
            minContributionAmount: 0.01 ether, // $20-30 minimum
            maxContributionAmount: 100 ether,   // $200k-300k maximum
            contributionsActive: true
        });

        // Initialize default mission types
        _addMission("AI Development");
        _addMission("Research & Innovation");
        _addMission("Platform Operations");
        _addMission("Community Growth");
        _addMission("Security & Audits");

        emit TreasuryConfigUpdated(_treasuryWallet, _gasBufferPercent);
    }

    modifier onlyAuthorized() {
        if (!authorizedOperators[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedOperator();
        }
        _;
    }

    modifier contributionsEnabled() {
        if (!treasuryConfig.contributionsActive) {
            revert ContributionsDisabled();
        }
        _;
    }

    /**
     * @dev Main function: User confirms mission agreement and contributes funds
     * @param missionType The type of mission to support
     * @param agreementHash Hash of the agreement terms the user confirmed
     */
    function confirmMissionAndContribute(
        string memory missionType,
        bytes32 agreementHash
    )
        external
        payable
        whenNotPaused
        nonReentrant
        contributionsEnabled
    {
        // Validate inputs
        if (msg.value == 0) revert InvalidAmount();
        if (msg.value < treasuryConfig.minContributionAmount) revert BelowMinContribution();
        if (msg.value > treasuryConfig.maxContributionAmount) revert ExceedsMaxContribution();
        if (!_isValidMission(missionType)) revert InvalidMission();
        if (!validAgreements[agreementHash]) revert AgreementNotValid();

        // Calculate gas buffer (small amount kept for future interactions)
        uint256 gasBuffer = (msg.value * treasuryConfig.gasBufferPercent) / BASIS_POINTS;
        uint256 missionAmount = msg.value - gasBuffer;

        // Record the contribution
        MissionContribution memory contribution = MissionContribution({
            contributor: msg.sender,
            amount: missionAmount,
            gasBuffer: gasBuffer,
            timestamp: block.timestamp,
            missionType: missionType,
            agreementConfirmed: true,
            agreementHash: agreementHash
        });

        userContributions[msg.sender].push(contribution);

        // Update metrics
        if (userContributions[msg.sender].length == 1) {
            contributors.push(msg.sender);
            platformMetrics.totalContributors++;
        }

        platformMetrics.totalContributions += msg.value;
        platformMetrics.totalMissionFunding += missionAmount;
        platformMetrics.totalGasBufferReserved += gasBuffer;
        missionFunding[missionType] += missionAmount;

        // 🔥 CRITICAL: Transfer funds immediately to treasury (institutional control)
        (bool success, ) = payable(treasuryConfig.treasuryWallet).call{value: missionAmount}("");
        if (!success) revert TreasuryTransferFailed();

        // Emit events
        emit MissionContribution(msg.sender, missionAmount, gasBuffer, missionType, agreementHash);
        emit FundsTransferredToTreasury(msg.sender, missionAmount, missionType);
    }

    /**
     * @dev Get user's contribution history
     */
    function getUserContributions(address user)
        external
        view
        returns (MissionContribution[] memory)
    {
        return userContributions[user];
    }

    /**
     * @dev Get total funding for a specific mission
     */
    function getMissionFunding(string memory missionType)
        external
        view
        returns (uint256)
    {
        return missionFunding[missionType];
    }

    /**
     * @dev Get available mission types
     */
    function getAvailableMissions() external view returns (string[] memory) {
        return availableMissions;
    }

    /**
     * @dev Get platform metrics
     */
    function getPlatformMetrics() external view returns (PlatformMetrics memory) {
        return platformMetrics;
    }

    /**
     * @dev Check if user has contributed to any mission
     */
    function hasUserContributed(address user) external view returns (bool) {
        return userContributions[user].length > 0;
    }

    /**
     * @dev Get total contribution amount by user
     */
    function getUserTotalContribution(address user) external view returns (uint256) {
        uint256 total = 0;
        MissionContribution[] memory contributions = userContributions[user];

        for (uint256 i = 0; i < contributions.length; i++) {
            total += contributions[i].amount + contributions[i].gasBuffer;
        }

        return total;
    }

    // Internal helper functions
    function _isValidMission(string memory missionType) internal view returns (bool) {
        for (uint256 i = 0; i < availableMissions.length; i++) {
            if (keccak256(bytes(availableMissions[i])) == keccak256(bytes(missionType))) {
                return true;
            }
        }
        return false;
    }

    function _addMission(string memory missionType) internal {
        availableMissions.push(missionType);
        emit MissionAdded(missionType);
    }

    // Admin functions (institutional control)
    function addMission(string memory missionType) external onlyOwner {
        _addMission(missionType);
    }

    function registerAgreement(bytes32 agreementHash) external onlyOwner {
        validAgreements[agreementHash] = true;
        emit AgreementRegistered(agreementHash);
    }

    function revokeAgreement(bytes32 agreementHash) external onlyOwner {
        validAgreements[agreementHash] = false;
    }

    function updateTreasuryConfig(
        address newTreasuryWallet,
        uint256 newGasBufferPercent
    ) external onlyOwner {
        if (newTreasuryWallet == address(0)) {
            revert InvalidTreasuryAddress();
        }
        if (newGasBufferPercent > MAX_GAS_BUFFER) {
            revert InvalidGasBuffer();
        }

        treasuryConfig.treasuryWallet = newTreasuryWallet;
        treasuryConfig.gasBufferPercent = newGasBufferPercent;

        emit TreasuryConfigUpdated(newTreasuryWallet, newGasBufferPercent);
    }

    function setContributionLimits(
        uint256 minAmount,
        uint256 maxAmount
    ) external onlyOwner {
        treasuryConfig.minContributionAmount = minAmount;
        treasuryConfig.maxContributionAmount = maxAmount;
    }

    function toggleContributions(bool active) external onlyOwner {
        treasuryConfig.contributionsActive = active;
    }

    function setOperatorAuthorization(address operator, bool authorized) external onlyOwner {
        authorizedOperators[operator] = authorized;
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdrawGasBuffer() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(treasuryConfig.treasuryWallet).call{value: balance}("");
            require(success, "Emergency withdrawal failed");
        }
    }

    // View function for contract balance (should be minimal - only gas buffer)
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Fallback function - should rarely receive direct ETH
    receive() external payable {
        // Allow direct ETH deposits but emit warning
        emit MissionContribution(
            msg.sender,
            msg.value,
            0,
            "Direct Transfer",
            bytes32(0)
        );
    }
}