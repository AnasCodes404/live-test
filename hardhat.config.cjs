require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.6.12",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    networks: {
        hardhat: {},
        fantomMainnet: {
            url: process.env.FANTOM_RPC_URL || "https://rpc.ftm.tools",
            accounts: [process.env.PRIVATE_KEY], // Remove `0x` prefix if already present in .env
            chainId: 250,
        },
    },
};
