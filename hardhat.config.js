require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

const config = require("./config/config.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        // url: "https://bsc-testnet.public.blastapi.io",
        // url: "https://rpc.ankr.com/eth_goerli",
        // url: "https://rpc.ankr.com/polygon_mumbai",
        url: "https://1rpc.io/bnb",
        enabled: true,
        // blockNumber: 25710942,
      },
    },
    bnb_test: {
      url: "https://bsc-testnet.public.blastapi.io",
      accounts: [config.p_key],
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [config.p_key],
    },
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [config.p_key],
    },
    bsc: {
      url: "https://1rpc.io/bnb",
      accounts: [config.p_key],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${config.alchemy_key}`,
      accounts: [config.p_key],
    },
  },
  etherscan: {
    apiKey: config.matic_key,
  },
};
