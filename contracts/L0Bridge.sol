// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./BaseBridge.sol";

interface IStargateRouter {
    struct lzTxObj {
        uint256 dstGasForCall;
        uint256 dstNativeAmount;
        bytes dstNativeAddr;
    }

    function swap(
        uint16 _dstChainId,
        uint256 _srcPoolId,
        uint256 _dstPoolId,
        address payable _refundAddress,
        uint256 _amountLD,
        uint256 _minAmountLD,
        lzTxObj memory _lzTxParams,
        bytes calldata _to,
        bytes calldata _payload
    ) external payable;

    function addLiquidity(
        uint256 _poolId,
        uint256 _amountLD,
        address _to
    ) external;
}

interface IStargateReceiver {
    function sgReceive(
        uint16 _chainId,
        bytes memory _srcAddress,
        uint256 _nonce,
        address _token,
        uint256 amountLD,
        bytes memory payload
    ) external payable;
}

contract L0Bridge is IStargateReceiver, BaseBridge {
    address public immutable sgRouter;

    struct RequestParam {
        uint16 dstChainId;
        uint256 dstPoolId;
        uint256 srcPoolId;
        uint256 tokenAmt;
        address token;
    }

    constructor(address _sgRouter, address _lendle) {
        sgRouter = _sgRouter;

        setLendle(_lendle);
    }

    function sgReceive(
        uint16,
        bytes memory,
        uint256,
        address token,
        uint256 amountLD,
        bytes memory payload
    ) external payable override {
        address sender = abi.decode(payload, (address));

        IERC20(token).approve(address(lendle), amountLD);
        lendle.deposit(token, amountLD, sender, 0);
    }

    function sendRequest(
        RequestParam calldata _param,
        IStargateRouter.lzTxObj calldata _params,
        bytes calldata _to,
        bytes calldata _payload
    ) external payable {
        IERC20(_param.token).transferFrom(
            msg.sender,
            address(this),
            _param.tokenAmt
        );

        IERC20(_param.token).approve(sgRouter, _param.tokenAmt);

        IStargateRouter(sgRouter).swap{value: msg.value}(
            _param.dstChainId,
            _param.srcPoolId, // 1 => USDC
            _param.dstPoolId,
            payable(msg.sender),
            _param.tokenAmt,
            0,
            _params,
            _to,
            _payload
        );
    }
}
