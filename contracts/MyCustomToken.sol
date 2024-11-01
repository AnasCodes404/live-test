// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // Importing ERC20 interface

contract MyCustomToken is ERC20 {
    // Constructor visibility is set to public
    constructor(uint256 initialSupply) public ERC20("My Custom Token", "MCT") {
        _mint(msg.sender, initialSupply);
    }
}
