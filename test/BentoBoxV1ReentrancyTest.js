const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BentoBoxV1 Reentrancy Attack Test", function () {
    let deployer, attacker;
    let bentoBox, maliciousContract;

    before(async function () {
        [deployer, attacker] = await ethers.getSigners();

        // Deploy BentoBox and MockWETH contracts here
        // Example:
        const BentoBox = await ethers.getContractFactory("BentoBoxV1");
        bentoBox = await BentoBox.deploy(WETH_ADDRESS);
        await bentoBox.deployed();

        const MaliciousContract = await ethers.getContractFactory("MaliciousContract");
        maliciousContract = await MaliciousContract.deploy(bentoBox.address);
        await maliciousContract.deployed();
    });

    it("should exploit reentrancy vulnerability in withdraw", async function () {
        // Initial balance before the attack
        const initialBalance = await ethers.provider.getBalance(attacker.address);
        console.log("Attacker initial balance:", initialBalance.toString());

        // Initiate the attack
        await maliciousContract.connect(attacker).attack();

        // Final balance after the attack
        const finalBalance = await ethers.provider.getBalance(attacker.address);
        console.log("Attacker final balance:", finalBalance.toString());

        // Assert that the attacker's balance increased
        expect(finalBalance).to.be.gt(initialBalance);
    });
});
