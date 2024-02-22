const { ethers } = require("hardhat");

async function main() {
  // const router = "0x817436a076060D158204d955E5403b6Ed0A5fac0";

  const router = "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd";

  const [owner] = await ethers.getSigners();

  // const TestBridge = await ethers.getContractFactory("L0Bridge");
  // const bridge = await TestBridge.deploy(router, ethers.constants.AddressZero);
  // await bridge.deployed();

  // console.log(`deployed address: ${bridge.address}`);

  const bridge = await ethers.getContractAt(
    "L0Bridge",
    "0x4Cb1Cf6AaF1e430C87C4a13Eec7CA250bf767ADA"
  );

  const usdt = await ethers.getContractAt(
    "IToken",
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  );

  // await usdt
  //   .connect(owner)
  //   .mint(owner.address, ethers.utils.parseEther("10000000"));
  // console.log(
  //   await usdt
  //     .connect(owner)
  //     .approve(
  //       "0x4Cb1Cf6AaF1e430C87C4a13Eec7CA250bf767ADA",
  //       ethers.constants.MaxUint256
  //     )
  // );

  const toBytes = ethers.utils.defaultAbiCoder.encode(
    ["address", "uint256"],
    [owner.address, 1]
  );

  console.log(
    await bridge.connect(owner).sendRequest(
      102,
      5,
      1,
      ethers.utils.parseUnits("2", 6),
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      {
        dstGasForCall: 4000000,
        dstNativeAmount: 0,
        dstNativeAddr: "0x",
      },
      "0x1B5471D40E4c9950eCb9A54caB794FA2bf19b9Bc",
      toBytes,
      {
        value: ethers.utils.parseEther("7"),
      }
    )
  );

  //   console.log(await usdt.allowance(owner.address, "0x1d9b85e5abcE5EEeE9895a48F564EFaD7359FA7E"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// testnet
// 0x1d9b85e5abcE5EEeE9895a48F564EFaD7359FA7E

// mainnet
// 0x5535e10DD859d21EFCFdd5CaaFBA55887D4A3A24
// 0x4Cb1Cf6AaF1e430C87C4a13Eec7CA250bf767ADA
