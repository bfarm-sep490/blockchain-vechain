// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IFarmRegistry {
    struct Farm {
        address owner;
        string name;
        string location;
        string[] certifications;
        bool isActive;
    }

    function registerFarm(
        address owner,
        string memory name,
        string memory location,
        string[] memory certifications
    ) external returns (uint256);

    function updateFarmStatus(uint256 farmId, bool isActive) external;
    function getFarmInfo(uint256 farmId) external view returns (Farm memory);
}