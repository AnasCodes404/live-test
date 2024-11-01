require('dotenv').config();

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BentoBoxV1 Reentrancy Attack Test", function () {
    let bentoBox, maliciousContract, attacker;

    beforeEach(async function () {
        [attacker] = await ethers.getSigners();

        // Connect to BentoBox and deploy the MaliciousContract
        bentoBox = await ethers.getContractAt("BentoBoxV1", process.env.BENTOBOX_ADDRESS, attacker);
        const MaliciousContract = await ethers.getContractFactory("MaliciousContract", attacker);
        maliciousContract = await MaliciousContract.deploy(process.env.BENTOBOX_ADDRESS);
        await maliciousContract.deployed();

        console.log("Connected to BentoBox at:", bentoBox.address);
        console.log("MaliciousContract deployed at:", maliciousContract.address);
    });

    it("should exploit reentrancy vulnerability in withdraw and drain funds", async function () {
        // Test logic here
    });
});
