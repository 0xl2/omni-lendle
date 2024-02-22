// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interface/IAgni.sol";
import "./interface/ILendle.sol";

contract BaseBridge is Ownable {
    ILendle public lendle;

    IAgni public agni;

    event SetLendle(address lendle);
    event SetAgniRouter(address agniRouter);

    function setLendle(address _lendle) external onlyOwner {
        lendle = ILendle(_lendle);

        emit SetLendle(_lendle);
    }

    function setAgniRouter(address _router) external onlyOwner {
        agni = IAgni(_router);

        emit SetAgniRouter(_router);
    }
}
