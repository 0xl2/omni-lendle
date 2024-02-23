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
        // url: "https://rpc.ankr.com/mantle",
        url: "https://rpc.ankr.com/polygon",
        enabled: true,
      },
    },
    polygon: {
      url: `https://rpc.ankr.com/polygon`,
      accounts: [config.p_key],
    },
    mantle: {
      url: `https://rpc.ankr.com/mantle`,
      accounts: [config.mantle_key],
    },
  },
  etherscan: {
    apiKey: config.matic_key,
  },
};
