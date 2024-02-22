const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ETH Bride contract testing", function () {
  before("Deploy contract", async function () {
    [this.signer, this.alice, this.bob] = await ethers.getSigners();

    const router = "0x7612aE2a34E5A363E137De748801FB4c86499152";

    const TestBridge = await ethers.getContractFactory("L0Bridge");
    this.bridge = await TestBridge.deploy(router);
    await this.bridge.deployed();

    // // eth bridge
    // this.bridge = await ethers.getContractAt("L0Bridge", "0xb789A6A76aC85A51Be4B0059695d217DbBf1d576")

    // init usdt
    this.usdt = await ethers.getContractAt(
      "IToken",
      "0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951"
    );

    console.log(`deployed address: ${this.bridge.address}`);
  });

  it("check bridge", async function () {
    const tokenAmt = await ethers.utils.parseUnits("10000", 6);

    // mint token
    await this.usdt.connect(this.alice).mint(this.alice.address, tokenAmt);
    await this.usdt.connect(this.alice).approve(this.bridge.address, tokenAmt);

    const payload = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256"],
      [this.alice.address, 10]
    );

    const toBytes = ethers.utils.defaultAbiCoder.encode(
      ["address"],
      ["0x1d9b85e5abcE5EEeE9895a48F564EFaD7359FA7E"]
    );

    console.log(`toBytes: ${toBytes}`);

    console.log(`payload: ${payload}`);

    // do bridge
    await this.bridge.connect(this.alice).sendRequest(
      10102, // BNB testnet id
      2,
      2,
      tokenAmt,
      this.usdt.address,
      this.alice.address,
      payload,
      {
        value: ethers.utils.parseEther("0.3"),
      }
    );
  });
});
