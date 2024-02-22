const { expect } = require("chai");
const { ethers } = require("hardhat");

describe.only("Bride contract testing", function () {
  before("Deploy contract", async function () {
    [this.signer, this.alice, this.bob] = await ethers.getSigners();

    const router = "0xbB0f1be1E9CE9cB27EA5b0c3a85B7cc3381d8176";

    const TestBridge = await ethers.getContractFactory("L0Bridge");
    this.bridge = await TestBridge.deploy(router);
    await this.bridge.deployed();

    // // eth bridge
    // this.bridge = await ethers.getContractAt("L0Bridge", "0xb789A6A76aC85A51Be4B0059695d217DbBf1d576")

    const spool = await ethers.getContractAt(
      "SPool",
      "0x76f5D2D38c1e3CeCeFFcc6ccD0A4FC541f995c5b"
    );
    const cp = await spool.getChainPath(10121, 2);
    expect(cp.dstChainId).to.be.eq(10121);
    expect(cp.dstPoolId).to.be.eq(2);

    // init usdt
    this.usdt = await ethers.getContractAt(
      "IToken",
      "0xF49E250aEB5abDf660d643583AdFd0be41464EfD"
    );

    this.tokenAmt = ethers.utils.parseUnits("1000000");

    console.log(`deployed address: ${this.bridge.address}`);
  });

  it("mint token", async function () {
    // mint token
    await this.usdt.connect(this.alice).mint(this.alice.address, this.tokenAmt);
    await this.usdt
      .connect(this.alice)
      .approve(this.bridge.address, this.tokenAmt);
  });

  it("check liquidity", async function () {
    const toBytes = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256"],
      [this.alice.address, 2]
    );

    await this.usdt
      .connect(this.alice)
      .transfer(this.bridge.address, this.tokenAmt);
    await this.bridge
      .connect(this.alice)
      .sgReceive(0, "0x", 0, this.usdt.address, this.tokenAmt, toBytes);
  });

  // it("check bridge", async function () {
  //   const toBytes = ethers.utils.defaultAbiCoder.encode(
  //     ["address"],
  //     ["0x1d9b85e5abcE5EEeE9895a48F564EFaD7359FA7E"]
  //   );

  //   console.log(`toBytes: ${toBytes}`);

  //   console.log(`payload: ${payload}`);

  //   // do bridge
  //   await this.bridge.connect(this.alice).sendRequest(
  //     10109, // goerli chain id
  //     2,
  //     2,
  //     this.tokenAmt,
  //     this.usdt.address,
  //     this.alice.address,
  //     payload,
  //     {
  //       value: ethers.utils.parseEther("0.5"),
  //     }
  //   );
  // });
});
