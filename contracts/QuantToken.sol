// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title QuantToken
 * @dev ERC20 token for the QuantTrade AI platform with advanced features
 */
contract QuantToken is ERC20, Ownable, Pausable, ERC20Permit {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens

    // Trading rewards pool
    uint256 public tradingRewardsPool;

    // Events
    event TradingRewardsDeposited(uint256 amount);
    event TradingRewardsDistributed(address indexed user, uint256 amount);

    constructor(
        address initialOwner
    ) ERC20("QuantTrade AI Token", "QUANT") ERC20Permit("QuantTrade AI Token") Ownable(initialOwner) {
        // Mint initial supply to owner
        _mint(initialOwner, 100_000_000 * 10**18); // 100 million tokens initial supply
    }

    /**
     * @dev Mint new tokens (only owner, up to max supply)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "QuantToken: exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Pause token transfers (emergency use)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Deposit tokens to trading rewards pool
     */
    function depositTradingRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "QuantToken: amount must be greater than 0");
        _transfer(msg.sender, address(this), amount);
        tradingRewardsPool += amount;
        emit TradingRewardsDeposited(amount);
    }

    /**
     * @dev Distribute trading rewards to users
     */
    function distributeTradingRewards(address user, uint256 amount) external onlyOwner {
        require(amount > 0, "QuantToken: amount must be greater than 0");
        require(amount <= tradingRewardsPool, "QuantToken: insufficient rewards pool");

        tradingRewardsPool -= amount;
        _transfer(address(this), user, amount);
        emit TradingRewardsDistributed(user, amount);
    }

    /**
     * @dev Override transfer functions to check pause status
     */
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }

    /**
     * @dev Get available trading rewards
     */
    function getAvailableRewards() external view returns (uint256) {
        return tradingRewardsPool;
    }
}