const { expect } = require("chai");
const { ethers } = require("hardhat");

const unlockAccount = async (address) => {
    await hre.network.provider.send("hardhat_impersonateAccount", [address]);
    return hre.ethers.provider.getSigner(address);
};

const usdtAddr = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
const mantleUSDT = "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"
// const router = "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd";
const composerRouter = "0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9"
const whaleAddr = "0xaAD15d9017F800CdF67C968aE520DcA76e233531"

describe("Bride contract testing", function () {
    before("Deploy contract", async function () {
        [this.signer, this.alice, this.bob, this.tom] = await ethers.getSigners();

        const TestBridge = await ethers.getContractFactory("L0Bridge");
        this.bridge = await TestBridge.deploy(composerRouter);
        await this.bridge.deployed();

        // init usdt
        this.usdt = await ethers.getContractAt(
            "IERC20",
            usdtAddr
        );

        console.log(`deployed address: ${this.bridge.address}`);

        this.whale = await unlockAccount(whaleAddr)
    });

    it("Check senrequest", async function () {
        const tokenAmt = ethers.utils.parseUnits("10", "6");
        this.usdt.connect(this.whale).approve(this.bridge.address, tokenAmt);
        await this.bridge.connect(this.whale).sendRequest(
            {
                dstChainId: 181, // mantle
                dstPoolId: 2,
                srcPoolId: 2,
                tokenAmt,
                token: usdtAddr,
                depositToken: mantleUSDT,
            },
            {
                dstGasForCall: 4000000,
                dstNativeAmount: 0,
                dstNativeAddr: "0x"
            },
            whaleAddr,
            {
                value: ethers.utils.parseEther("5")
            }
        )
    }).timeout(50000000)
});

