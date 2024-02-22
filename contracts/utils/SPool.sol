// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.4;

/// Pool contracts on other chains and managed by the Stargate protocol.
contract SPool {
    //---------------------------------------------------------------------------
    // CONSTANTS
    bytes4 private constant SELECTOR =
        bytes4(keccak256(bytes("transfer(address,uint256)")));
    uint256 public constant BP_DENOMINATOR = 10000;

    //---------------------------------------------------------------------------
    // STRUCTS
    struct ChainPath {
        bool ready; // indicate if the counter chainPath has been created.
        uint16 dstChainId;
        uint256 dstPoolId;
        uint256 weight;
        uint256 balance;
        uint256 lkb;
        uint256 credits;
        uint256 idealBalance;
    }

    struct SwapObj {
        uint256 amount;
        uint256 eqFee;
        uint256 eqReward;
        uint256 lpFee;
        uint256 protocolFee;
        uint256 lkbRemove;
    }

    struct CreditObj {
        uint256 credits;
        uint256 idealBalance;
    }

    //---------------------------------------------------------------------------
    // VARIABLES

    // chainPath
    ChainPath[] public chainPaths; // list of connected chains with shared pools
    mapping(uint16 => mapping(uint256 => uint256)) public chainPathIndexLookup; // lookup for chainPath by chainId => poolId =>index

    bool public stopSwap; // flag to stop swapping in extreme cases

    // Fee and Liquidity
    uint256 public totalLiquidity; // the total amount of tokens added on this side of the chain (fees + deposits - withdrawals)
    uint256 public totalWeight; // total weight for pool percentages
    uint256 public mintFeeBP; // fee basis points for the mint/deposit
    uint256 public protocolFeeBalance; // fee balance created from dao fee
    uint256 public mintFeeBalance; // fee balance created from mint fee
    uint256 public eqFeePool; // pool rewards in Shared Decimal format. indicate the total budget for reverse swap incentive
    address public feeLibrary; // address for retrieving fee params for swaps

    // Delta related
    uint256 public deltaCredit; // credits accumulated from txn
    bool public batched; // flag to indicate if we want batch processing.
    bool public defaultSwapMode; // flag for the default mode for swap
    bool public defaultLPMode; // flag for the default mode for lp
    uint256 public swapDeltaBP; // basis points of poolCredits to activate Delta in swap
    uint256 public lpDeltaBP; // basis points of poolCredits to activate Delta in liquidity events

    function getAndCheckCP(
        uint16 _dstChainId,
        uint256 _dstPoolId
    ) internal view returns (ChainPath storage) {
        require(chainPaths.length > 0, "Stargate: no chainpaths exist");
        ChainPath storage cp = chainPaths[
            chainPathIndexLookup[_dstChainId][_dstPoolId]
        ];
        require(
            cp.dstChainId == _dstChainId && cp.dstPoolId == _dstPoolId,
            "Stargate: local chainPath does not exist"
        );
        return cp;
    }

    function getChainPath(
        uint16 _dstChainId,
        uint256 _dstPoolId
    ) external view returns (ChainPath memory) {
        ChainPath memory cp = chainPaths[
            chainPathIndexLookup[_dstChainId][_dstPoolId]
        ];
        require(
            cp.dstChainId == _dstChainId && cp.dstPoolId == _dstPoolId,
            "Stargate: local chainPath does not exist"
        );
        return cp;
    }
}
