// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interface/ILendle.sol";

contract BaseBridge is Ownable {
    ILendle public lendle;

    function setLendle(address _lendle) public onlyOwner {
        lendle = ILendle(_lendle);
    }
}
