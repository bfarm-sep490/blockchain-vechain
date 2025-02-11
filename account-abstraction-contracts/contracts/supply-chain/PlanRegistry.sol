// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "../interfaces/IPlan.sol";

contract PlanRegistry is IPlanRegistry {
    mapping(uint256 => PlanBatch) private plans;
    uint256 private planCounter;

    event PlanCreated(uint256 indexed planId);
    event PlanUpdated(uint256 indexed planId);

    // Constructor
    constructor() {
        planCounter = 0;
    }

    function createPlan(
        string memory _seedName,
        uint256 _yield,
        string memory _unit,
        date memory _startDate,
        date memory _endDate
    ) external returns (uint256) {
        planCounter++;

        PlanBatch storage newPlan = plans[planCounter];

        newPlan.plan_id = planCounter;
        newPlan.seed_name = _seedName;
        newPlan.yield = _yield;
        newPlan.unit = _unit;
        newPlan.start_date = _startDate;
        newPlan.end_date = _endDate;
        newPlan.status = PlanStatus.InProgress;
        emit PlanCreated(planCounter);
        return planCounter;
    }

    function addItemInfo(
        uint256 _planId,
        uint256 _itemId,
        string memory _itemName,
        string memory _itemDescription
    ) external {
        require(_planId <= planCounter && _planId > 0, "Invalid plan ID");

        item_info memory newItem = item_info({
            item_id: _itemId,
            item_name: _itemName,
            item_description: _itemDescription
        });

        plans[_planId].items.push(newItem);
    }

    function addFertilizerInfo(
        uint256 _planId,
        uint256 _fertilizerId,
        string memory _fertilizerName,
        string memory _fertilizerDescription
    ) external {
        require(_planId <= planCounter && _planId > 0, "Invalid plan ID");

        fertilizer_info memory newFertilizer = fertilizer_info({
            fertilizer_id: _fertilizerId,
            fertilizer_name: _fertilizerName,
            fertilizer_description: _fertilizerDescription
        });

        plans[_planId].fertilizers.push(newFertilizer);
    }

    function getPlan(uint256 _planId) external view returns (PlanBatch memory) {
        require(_planId <= planCounter && _planId > 0, "Invalid plan ID");
        return plans[_planId];
    }
}
