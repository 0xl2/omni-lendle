const { ethers } = require("hardhat");

async function main() {
  const router = "0x7612aE2a34E5A363E137De748801FB4c86499152";

  const [owner] = await ethers.getSigners();

  // const TestBridge = await ethers.getContractFactory("L0Bridge");
  // const bridge = await TestBridge.deploy(router);
  // await bridge.deployed();

  // console.log(`deployed address: ${bridge.address}`);

  const usdt = await ethers.getContractAt(
    "IToken",
    "0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951"
  );

  // await usdt
  //   .connect(owner)
  //   .mint(owner.address, ethers.utils.parseEther("10000000"));
  // await usdt
  //   .connect(owner)
  //   .approve(bridge.address, ethers.constants.MaxUint256);

  console.log(await usdt.allowance(owner.address, "0x2F0C6002f5A977CaC1A262Ebf3D07b82eb53adC7"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// 0x2F0C6002f5A977CaC1A262Ebf3D07b82eb53adC7
