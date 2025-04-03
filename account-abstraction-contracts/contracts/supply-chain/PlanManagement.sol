// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../interfaces/IPlanManagement.sol";

contract PlanManagement is IPlanManagement {
    bool public isInitialized;

    PlanData public plan;
    TaskMilestone[] public tasks;
    InspectionMilestone[] public inspections;

    constructor() {
        isInitialized = false;
    }

    modifier notInitialized() {
        require(!isInitialized, "Plan already initialized");
        _;
    }

    function createPlan(
        uint256 _planId,
        uint256 _plantId,
        uint256 _yieldId,
        uint256 _expertId,
        string calldata _planName,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _estimatedProduct,
        string calldata _estimatedUnit,
        string calldata _status
    ) external override notInitialized returns (uint256) {
        plan = PlanData({
            planId: _planId,
            plantId: _plantId,
            yieldId: _yieldId,
            expertId: _expertId,
            planName: _planName,
            startDate: _startDate,
            endDate: _endDate,
            estimatedProduct: _estimatedProduct,
            estimatedUnit: _estimatedUnit,
            status: _status
        });
        isInitialized = true;

        emit PlanCreated(_planId, _planName);
        return _planId;
    }

    function addTaskMilestone(
        uint256 _taskId,
        string calldata _taskType,
        string calldata _status,
        bytes32 _dataHash
    ) external override {
        require(isInitialized, "Plan not initialized");
        tasks.push(
            TaskMilestone({
                taskId: _taskId,
                taskType: _taskType,
                timestamp: block.timestamp,
                status: _status,
                dataHash: _dataHash
            })
        );

        emit TaskMilestoneAdded(
            plan.planId,
            _taskId,
            _taskType,
            block.timestamp
        );
    }

    function addInspectionMilestone(
        uint256 _inspectionId,
        uint8 _inspectionType,
        bytes32 _dataHash
    ) external override {
        require(isInitialized, "Plan not initialized");
        require(_inspectionType <= 2, "Invalid inspection type");
        inspections.push(
            InspectionMilestone({
                inspectionId: _inspectionId,
                timestamp: block.timestamp,
                inspectionType: InspectionType(_inspectionType),
                dataHash: _dataHash
            })
        );

        emit InspectionMilestoneAdded(
            plan.planId,
            _inspectionId,
            _inspectionType,
            block.timestamp
        );
    }

    function getPlanInfo()
        external
        view
        override
        returns (
            PlanData memory planData,
            TaskMilestone[] memory taskList,
            InspectionMilestone[] memory inspectionList
        )
    {
        require(isInitialized, "Plan not initialized");
        return (plan, tasks, inspections);
    }

    function updateStatus(string calldata _status) external override {
        require(isInitialized, "Plan not initialized");
        plan.status = _status;
        emit PlanUpdated(plan.planId, _status);
    }
}
