// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QuantTradeAI
 * @dev A smart contract for the QuantTrade AI platform
 */
contract QuantTradeAI {
    // Owner of the contract
    address public owner;
    
    // Mapping to store user balances
    mapping(address => uint256) public balances;
    
    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    // Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Constructor sets the owner as the contract deployer
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Deposit funds into the contract
     */
    function deposit() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    /**
     * @dev Withdraw funds from the contract
     * @param amount The amount to withdraw
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Get the contract's balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get the user's balance
     */
    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
    
    // Fallback function
    fallback() external payable {}
}
