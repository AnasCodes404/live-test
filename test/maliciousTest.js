// scripts/deployMalicious.js
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    const BentoBoxAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454"; // Deployed BentoBox address

    const MaliciousContract = await ethers.getContractFactory("MaliciousContract");
    const maliciousContract = await MaliciousContract.deploy(BentoBoxAddress);
    await maliciousContract.deployed();

    console.log("MaliciousContract deployed to:", maliciousContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
