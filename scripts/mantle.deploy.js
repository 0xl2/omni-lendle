const { ethers } = require("hardhat");

async function main() {
    const router = "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590";

    const [owner] = await ethers.getSigners();

    const TestBridge = await ethers.getContractFactory("L0Bridge");
    const bridge = await TestBridge.deploy(router);
    await bridge.deployed();

    console.log(`deployed address: ${bridge.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
