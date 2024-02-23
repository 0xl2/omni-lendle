const { expect } = require("chai");
const { ethers } = require("hardhat");

const unlockAccount = async (address) => {
  await hre.network.provider.send("hardhat_impersonateAccount", [address]);
  return hre.ethers.provider.getSigner(address);
};

const usdtAddr = "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"
const WETH = "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
const WMNT =
  "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8"

describe("Bride contract testing", function () {
  before("Deploy contract", async function () {
    [this.signer, this.alice, this.bob, this.tom] = await ethers.getSigners();

    const router = "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590";

    const TestBridge = await ethers.getContractFactory("L0Bridge");
    this.bridge = await TestBridge.deploy(router);
    await this.bridge.deployed();

    // init usdt
    this.usdt = await ethers.getContractAt(
      "IERC20",
      usdtAddr
    );

    console.log(`deployed address: ${this.bridge.address}`);

    // set lendle and swap router
    await this.bridge.connect(this.signer).setLendle("0xCFa5aE7c2CE8Fadc6426C1ff872cA45378Fb7cF3")

    await this.bridge.connect(this.signer).setAgniRouter("0x319B69888b0d11cEC22caA5034e25FfFBDc88421")

    this.whale = await unlockAccount("0xf89d7b9c864f589bbF53a82105107622B35EaA40")

    this.lendle = await ethers.getContractAt(
      "ILendle", "0xCFa5aE7c2CE8Fadc6426C1ff872cA45378Fb7cF3"
    );
  });

  it("Transfer USDT then test the receive function then deposit on Lendle", async function () {
    const tokenAmt = ethers.utils.parseUnits("1000", "6");
    this.usdt.connect(this.whale).transfer(this.bridge.address, tokenAmt)

    const abi = ethers.utils.defaultAbiCoder
    const payload = abi.encode(
      ["address", "address"],
      [this.alice.address, usdtAddr]);

    await this.bridge.connect(this.alice).sgReceive(
      0,
      "0x",
      0,
      usdtAddr,
      tokenAmt,
      payload
    )
  })

  it("Check lendle account info", async function () {
    console.log(await this.lendle.getUserAccountData(this.alice.address));
  })

  it("Transfer USDT then test the receive function with USDT -> WETH swap then deposit on Lendle", async function () {
    const tokenAmt = ethers.utils.parseUnits("1000", "6");
    this.usdt.connect(this.whale).transfer(this.bridge.address, tokenAmt)

    const abi = ethers.utils.defaultAbiCoder
    const payload = abi.encode(
      ["address", "address"],
      [this.bob.address, WETH]);

    await this.bridge.connect(this.bob).sgReceive(
      0,
      "0x",
      0,
      usdtAddr,
      tokenAmt,
      payload
    )
  })

  it("Check lendle account info", async function () {
    console.log(await this.lendle.getUserAccountData(this.bob.address));
  })

  it("Transfer USDT then test the receive function with USDT -> WMNT swap then deposit on Lendle", async function () {
    const tokenAmt = ethers.utils.parseUnits("1000", "6");
    this.usdt.connect(this.whale).transfer(this.bridge.address, tokenAmt)

    const abi = ethers.utils.defaultAbiCoder
    const payload = abi.encode(
      ["address", "address"],
      [this.tom.address, WMNT]);

    await this.bridge.connect(this.tom).sgReceive(
      0,
      "0x",
      0,
      usdtAddr,
      tokenAmt,
      payload
    )
  })

  it("Check lendle account info", async function () {
    console.log(await this.lendle.getUserAccountData(this.tom.address));
  })
});
