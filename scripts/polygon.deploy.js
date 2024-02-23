const { ethers } = require("hardhat");

async function main() {
  const router = "0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9";

  const [owner] = await ethers.getSigners();

  const TestBridge = await ethers.getContractFactory("L0Bridge");
  const bridge = await TestBridge.deploy(router);
  await bridge.deployed();

  console.log(`deployed address: ${bridge.address}`);
  console.log(`owner address: ${owner.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// 0x08c9a0be12b3eb39b8e3f8507d6bbcc6dfba04a3