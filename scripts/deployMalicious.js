// scripts/deploymalicious.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Set the address of the target contract
    const targetContractAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454"; // Replace with your target contract address

    const MaliciousContract = await ethers.getContractFactory("MaliciousContract");
    const maliciousContract = await MaliciousContract.deploy(targetContractAddress);

    console.log("MaliciousContract deployed to:", maliciousContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
