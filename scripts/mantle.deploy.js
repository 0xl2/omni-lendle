const { ethers } = require("hardhat");

async function main() {
  const router = "0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97";

  const [owner] = await ethers.getSigners();

  const TestBridge = await ethers.getContractFactory("L0Bridge");
  const bridge = await TestBridge.deploy(router);
  await bridge.deployed();

  console.log(`deployed address: ${bridge.address}`);

  // set lendle and swap router
  await bridge.connect(owner).setLendle("0xCFa5aE7c2CE8Fadc6426C1ff872cA45378Fb7cF3")

  await bridge.connect(owner).setAgniRouter("0x319B69888b0d11cEC22caA5034e25FfFBDc88421")

  console.log(`owner address: ${owner.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// 0x317371f126680734D7dB2aCe2D751Ffc0Bd4b771