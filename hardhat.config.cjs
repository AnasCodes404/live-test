require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.6.12", // Update to match your Solidity version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    fantomMainnet: {
      url: process.env.FANTOM_RPC_URL || "https://rpc.ftm.tools",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 250,
    },
  },
};
