// scripts/deploy.js

const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy MockWETH if required
    const MockWETH = await ethers.getContractFactory("MockWETH");
    const mockWETH = await MockWETH.deploy();
    await mockWETH.deployed();
    console.log("MockWETH deployed to:", mockWETH.address);

    // Deploy BentoBoxV1 with the address of MockWETH
    const BentoBox = await ethers.getContractFactory("BentoBoxV1");
    const bentoBox = await BentoBox.deploy(mockWETH.address); // Ensure you provide the required argument
    await bentoBox.deployed();
    console.log("BentoBox deployed to:", bentoBox.address);

    // If you have other contracts to deploy, follow the same pattern
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
