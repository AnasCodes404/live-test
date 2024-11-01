require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    // Get the deployer's account
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Set the address of the target contract (BentoBox) from the environment variable
    const targetContractAddress = process.env.BENTOBOX_ADDRESS;

    // Check if the target contract address is defined
    if (!targetContractAddress) {
        console.error("Error: BENTOBOX_ADDRESS not defined in .env file.");
        process.exit(1);
    }

    // Get the contract factory for MaliciousContract
    const MaliciousContract = await ethers.getContractFactory("MaliciousContract");

    // Deploy the malicious contract with the target contract address
    const maliciousContract = await MaliciousContract.deploy(targetContractAddress);

    // Wait for the contract to be deployed
    await maliciousContract.deployed();

    console.log("MaliciousContract deployed to:", maliciousContract.address);
}

// Execute the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
