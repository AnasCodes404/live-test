// scripts/deployERC20.js
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const initialSupply = ethers.utils.parseUnits("1000000", 18); // Example: 1 million tokens
    const token = await ERC20Token.deploy(initialSupply);
    await token.deployed();

    console.log("ERC20Token deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
