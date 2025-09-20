// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AccessRegistry
 * @dev Role-based access control for the QuantTrade AI platform
 */
contract AccessRegistry is AccessControl, Pausable {
    // Custom roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TRADING_MANAGER_ROLE = keccak256("TRADING_MANAGER_ROLE");
    bytes32 public constant RISK_MANAGER_ROLE = keccak256("RISK_MANAGER_ROLE");
    bytes32 public constant USER_MANAGER_ROLE = keccak256("USER_MANAGER_ROLE");

    // User status tracking
    mapping(address => bool) public verifiedUsers;
    mapping(address => bool) public suspendedUsers;
    mapping(address => uint256) public userTiers; // 0 = basic, 1 = premium, 2 = pro

    // Events
    event UserVerified(address indexed user);
    event UserSuspended(address indexed user);
    event UserUnsuspended(address indexed user);
    event UserTierUpdated(address indexed user, uint256 tier);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    /**
     * @dev Verify a user account
     */
    function verifyUser(address user) external onlyRole(USER_MANAGER_ROLE) {
        verifiedUsers[user] = true;
        emit UserVerified(user);
    }

    /**
     * @dev Suspend a user account
     */
    function suspendUser(address user) external onlyRole(USER_MANAGER_ROLE) {
        suspendedUsers[user] = true;
        emit UserSuspended(user);
    }

    /**
     * @dev Unsuspend a user account
     */
    function unsuspendUser(address user) external onlyRole(USER_MANAGER_ROLE) {
        suspendedUsers[user] = false;
        emit UserUnsuspended(user);
    }

    /**
     * @dev Update user tier
     */
    function updateUserTier(address user, uint256 tier) external onlyRole(USER_MANAGER_ROLE) {
        require(tier <= 2, "AccessRegistry: invalid tier");
        userTiers[user] = tier;
        emit UserTierUpdated(user, tier);
    }

    /**
     * @dev Check if user can trade
     */
    function canTrade(address user) external view returns (bool) {
        return verifiedUsers[user] && !suspendedUsers[user] && !paused();
    }

    /**
     * @dev Check if user is verified
     */
    function isVerified(address user) external view returns (bool) {
        return verifiedUsers[user];
    }

    /**
     * @dev Check if user is suspended
     */
    function isSuspended(address user) external view returns (bool) {
        return suspendedUsers[user];
    }

    /**
     * @dev Get user tier
     */
    function getUserTier(address user) external view returns (uint256) {
        return userTiers[user];
    }

    /**
     * @dev Pause the system (emergency use)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the system
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Grant trading manager role
     */
    function grantTradingManager(address account) external onlyRole(ADMIN_ROLE) {
        _grantRole(TRADING_MANAGER_ROLE, account);
    }

    /**
     * @dev Grant risk manager role
     */
    function grantRiskManager(address account) external onlyRole(ADMIN_ROLE) {
        _grantRole(RISK_MANAGER_ROLE, account);
    }

    /**
     * @dev Grant user manager role
     */
    function grantUserManager(address account) external onlyRole(ADMIN_ROLE) {
        _grantRole(USER_MANAGER_ROLE, account);
    }
}