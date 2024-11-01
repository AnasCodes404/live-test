require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory for MaliciousContract
    const MaliciousContract = await ethers.getContractFactory("MaliciousContract");

    // Define the address of the BentoBoxV1 contract you want to target
    const targetContractAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454"; // Update with your target contract address

    // Deploy the MaliciousContract
    const maliciousContract = await MaliciousContract.deploy(targetContractAddress);
    await maliciousContract.deployed();

    console.log("MaliciousContract deployed to:", maliciousContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
