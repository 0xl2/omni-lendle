// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./BaseBridge.sol";

import "hardhat/console.sol";

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
        address depositToken;
    }

    constructor(address _sgRouter) {
        sgRouter = _sgRouter;
    }

    function _doSwap(
        address _from,
        address _to,
        uint _fromAmt
    ) internal returns (uint) {
        IERC20(_from).approve(address(agni), _fromAmt);

        return
            agni.exactInputSingle(
                IAgni.ExactInputSingleParams(
                    _from,
                    _to,
                    500,
                    address(this),
                    block.timestamp + 2 hours,
                    _fromAmt,
                    0,
                    0
                )
            );
    }

    function sgReceive(
        uint16,
        bytes memory,
        uint256,
        address token,
        uint256 amountLD,
        bytes memory payload
    ) external payable override {
        (address sender, address depositToken) = abi.decode(
            payload,
            (address, address)
        );

        if (token != depositToken)
            amountLD = _doSwap(token, depositToken, amountLD);

        IERC20(depositToken).approve(address(lendle), amountLD);
        lendle.deposit(depositToken, amountLD, sender, 0);
    }

    function sendRequest(
        RequestParam calldata _param,
        IStargateRouter.lzTxObj calldata _params,
        bytes calldata _to
    ) external payable {
        require(msg.value > 0, "Insufficient gas fee");

        IERC20(_param.token).transferFrom(
            msg.sender,
            address(this),
            _param.tokenAmt
        );

        IERC20(_param.token).approve(sgRouter, _param.tokenAmt);

        bytes memory payload = abi.encode(msg.sender, _param.depositToken);

        IStargateRouter(sgRouter).swap{value: msg.value}(
            _param.dstChainId,
            _param.srcPoolId,
            _param.dstPoolId,
            payable(msg.sender),
            _param.tokenAmt,
            0,
            _params,
            _to,
            payload
        );
    }

    function withdrawToken(address token) external onlyOwner {
        IERC20(token).transfer(
            msg.sender,
            IERC20(token).balanceOf(address(this))
        );
    }
}
