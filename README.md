# Omnichain feature for [Lendle](https://app.lendle.xyz/)

### To run

```shell
// for test
npx hardhat test
REPORT_GAS=true npx hardhat test

// for deployment
npx hardhat run scripts/deploy.js
```

### Contract addresses

Contract on Polygon: [0xa3DfdAe3E5F9Ced1e8af169E9aB279Bd2eB8CC13](https://polygonscan.com/address/0xa3DfdAe3E5F9Ced1e8af169E9aB279Bd2eB8CC13#writeContract)

Contract on Mantle: [0x317371f126680734D7dB2aCe2D751Ffc0Bd4b771](https://explorer.mantle.xyz/address/0x317371f126680734D7dB2aCe2D751Ffc0Bd4b771)

### POC

- 1st Tx(Polygon USDT -> Mantle USDT -> Lendle):
  [Layerzero scan url](https://layerzeroscan.com/tx/0xa030052e4876b745455f2ca38533b9f99c46b0eda529ff32b88e10c02ab13d3a)
  [Tx on Polygon](https://polygonscan.com/tx/0xa030052e4876b745455f2ca38533b9f99c46b0eda529ff32b88e10c02ab13d3a)
  [Tx on Mantle](https://explorer.mantle.xyz/tx/0xa82b441029236111ca822327f5d25e5ae8f058e9cefcd6363d5c7bf1ad89eae3)

- 2nd Tx(Polygon USDT -> Mantle USDT -> Mantle MNT(using [Agmiswap](https://agni.finance/swap)) -> Lendle)
  [Layerzero scan url](https://layerzeroscan.com/tx/0x5a4a40a5005bbcc98c6656e1b76023d9ee7a833cbd496b3f14d948fafffc1544)
  [Tx on Polygon](https://polygonscan.com/tx/0xa030052e4876b745455f2ca38533b9f99c46b0eda529ff32b88e10c02ab13d3a)
  [Tx on Mantle](https://explorer.mantle.xyz/tx/0x8413d833f9f6e339d681354374af0625625ebb211633631cbe2ccdaf214c1c7e)
