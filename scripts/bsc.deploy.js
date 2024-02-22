const { ethers } = require("hardhat");

async function main() {
  // const router = "0xbB0f1be1E9CE9cB27EA5b0c3a85B7cc3381d8176";

  const router = "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8";

  const [owner] = await ethers.getSigners();

  // deploy ybnft
  const TestNFT = await ethers.getContractFactory("TestNFT");
  const testnft = await TestNFT.deploy();
  await testnft.deployed();

  // deploy investor
  const Investor = await ethers.getContractFactory("Investor");
  const investor = await Investor.deploy(testnft.address);
  await investor.deployed();

  // deploy test bridge
  const TestBridge = await ethers.getContractFactory("L0Bridge");
  const bridge = await TestBridge.deploy(router, investor.address);
  await bridge.deployed();

  console.log(`deployed testnft address: ${testnft.address}`);
  console.log(`deployed investor address: ${investor.address}`);
  console.log(`deployed bridge address: ${bridge.address}`);

  // const testnft = await ethers.getContractAt(
  //   "TestNFT",
  //   "0x691362e4d0E9B5E8622bf48F6C61c52f9F2B738E"
  // );
  await testnft.connect(owner).mint([
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// testnet
// 0xE8c9937356aFbF86347e526f1081F2C1694189D1

// mainnet
// 0xA76d5090461Cfefa333d16CC1078E24D1a3f5229
// 0x11B80D78c57C73E47Cf5dCabF645E2247D64A0c6

// deployed testnft address: 0x691362e4d0E9B5E8622bf48F6C61c52f9F2B738E
// deployed investor address: 0xBB391C83272764E5B592760D425F7e9bF82c7053
// deployed bridge address: 0xB4318b9C32AD1d35C32fe7fB1622A6cD512e3905

// deployed testnft address: 0xD627484c43331aE9D2951a4390162E63B514A73b
// deployed investor address: 0x25D4270258Ae26AC8E50F97d684d146235248543
// deployed bridge address: 0x1B5471D40E4c9950eCb9A54caB794FA2bf19b9Bc