const { ethers } = require("hardhat");

const unlockAccount = async (address) => {
  await hre.network.provider.send("hardhat_impersonateAccount", [address]);
  return hre.ethers.provider.getSigner(address);
};

describe.only("PKS contract testing", function () {
  before("Deploy contract", async function () {
    [this.signer, this.alice, this.bob] = await ethers.getSigners();

    const router = "0xbB0f1be1E9CE9cB27EA5b0c3a85B7cc3381d8176";

    this.whale = await unlockAccount(
      "0xdF1Fd1Ea608F910B1bD6Ca68163f9E817F752af0"
    );

    // deploy ybnft
    const TestNFT = await ethers.getContractFactory("TestNFT");
    this.testnft = await TestNFT.deploy();
    await this.testnft.deployed();

    // deploy investor
    const Investor = await ethers.getContractFactory("Investor");
    this.investor = await Investor.deploy(this.testnft.address);
    await this.investor.deployed();

    const TestBridge = await ethers.getContractFactory("L0Bridge");
    this.bridge = await TestBridge.deploy(router, this.investor.address);
    await this.bridge.deployed();

    this.busd = await ethers.getContractAt(
      "IToken",
      "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
    );

    this.stakingToken1 = await ethers.getContractAt(
      "IToken",
      "0x66FDB2eCCfB58cF098eaa419e5EfDe841368e489"
    );
  });

  it("mint nft", async function () {
    await this.testnft.connect(this.alice).mint([
      {
        pid: 19,
        percent: 2000,
        strategy: "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652",
        stakingToken: "0x66FDB2eCCfB58cF098eaa419e5EfDe841368e489",
      },
      {
        pid: 20,
        percent: 2000,
        strategy: "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652",
        stakingToken: "0x2354ef4DF11afacb85a5C7f98B624072ECcddbB1",
      },
      {
        pid: 39,
        percent: 2000,
        strategy: "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652",
        stakingToken: "0x804678fa97d91B974ec2af3c843270886528a9E6",
      },
      {
        pid: 73,
        percent: 2000,
        strategy: "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652",
        stakingToken: "0xe98ac95A1dB2fCaaa9c7D4ba7ecfCE4877ca2bEa",
      },
      {
        pid: 116,
        percent: 2000,
        strategy: "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652",
        stakingToken: "0xe68D05418A8d7969D9CA6761ad46F449629d928c",
      },
    ]);
  });

  it("test deposit", async function () {
    const busdAmt = ethers.utils.parseEther("4");
    await this.busd.connect(this.whale).transfer(this.bridge.address, busdAmt);

    const toBytes = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256"],
      [this.alice.address, 1]
    );
    const tx = await this.bridge
      .connect(this.alice)
      .sgReceive(0, "0x", 0, this.busd.address, busdAmt, toBytes);
    const txResp = await tx.wait();

    console.log(txResp, txResp.gasUsed);

    console.log(await this.investor.userDeposit(1, this.alice.address, 0));
  }).timeout(2000000000);

  it("test withdraw", async function () {
    await this.investor.connect(this.alice).withdraw(this.alice.address, 1);

    console.log(await this.investor.userDeposit(1, this.alice.address, 0));

    console.log(await this.stakingToken1.balanceOf(this.alice.address));
  });
});
