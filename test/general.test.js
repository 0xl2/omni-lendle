const { ethers } = require("hardhat");

describe("Bride contract testing", function () {
  before("Deploy contract", async function () {
    [this.signer, this.alice, this.bob] = await ethers.getSigners();

    const router = "0xbB0f1be1E9CE9cB27EA5b0c3a85B7cc3381d8176";

    const TestBridge = await ethers.getContractFactory("L0Bridge");
    this.bridge = await TestBridge.deploy(router);
    await this.bridge.deployed();
  });

  it("check result", async function () {
    console.log(this.signer.address);
    console.log(await this.bridge.checkResult());
  });
});
