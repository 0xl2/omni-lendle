// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.4;

interface ILendle {
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(address asset, uint256 amount, address to) external;
}
