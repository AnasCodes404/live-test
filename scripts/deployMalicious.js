// scripts/deploymalicious.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Set the address of the target contract and the token address
    const targetContractAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454"; // Replace with your target contract address
    const tokenAddress = "0xd28C2A902E61a850372c88BC44F2A1e9Ca0CC755"; // Replace with your ERC20 token address

    const MaliciousContract = await ethers.getContractFactory("MaliciousContract");
    const maliciousContract = await MaliciousContract.deploy(targetContractAddress, tokenAddress);

    console.log("MaliciousContract deployed to:", maliciousContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
