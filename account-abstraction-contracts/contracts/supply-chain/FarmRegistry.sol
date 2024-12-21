// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../interfaces/IProductRegistry.sol";

contract FarmRegistry {
    struct Farm {
        address owner;
        string name;
        string location;
        string[] certifications;
        bool isActive;
    }

    mapping(uint256 => Farm) public farms;
    uint256 public nextFarmId = 1;
    IProductRegistry public productRegistry;

    event FarmRegistered(uint256 indexed farmId, address indexed owner);
    event FarmStatusUpdated(uint256 indexed farmId, bool isActive);

    constructor(address _productRegistryAddress) {
        productRegistry = IProductRegistry(_productRegistryAddress);
    }

    function registerFarm(
        address owner,
        string memory name,
        string memory location,
        string[] memory certifications
    ) public returns (uint256) {
        uint256 farmId = nextFarmId++;
        farms[farmId] = Farm(owner, name, location, certifications, true);
        emit FarmRegistered(farmId, owner);
        return farmId;
    }

    function updateFarmStatus(uint256 farmId, bool isActive) public {
        require(farmId < nextFarmId, "Invalid farm ID");
        farms[farmId].isActive = isActive;
        emit FarmStatusUpdated(farmId, isActive);
    }

    function getFarmInfo(uint256 farmId) public view returns (Farm memory) {
        require(farmId < nextFarmId, "Invalid farm ID");
        return farms[farmId];
    }
}