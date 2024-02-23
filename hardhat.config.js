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
        url: "https://rpc.ankr.com/mantle",
        // url: "https://rpc.ankr.com/polygon",
        enabled: true,
      },
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${config.alchemy_key}`,
      accounts: [config.p_key],
    },
    mantle: {
      url: "https://rpc.ankr.com/mantle",
      accounts: [config.mantle_key],
    },
  },
  etherscan: {
    apiKey: config.matic_key,
    // apiKey: config.eth_key,
    customChains: [
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.mantle.xyz"
        }
      }
    ]
  },
};
