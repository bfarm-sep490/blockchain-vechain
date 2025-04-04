// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IPlanManagement {
    enum InspectionType {
        Type1,
        Type2,
        Type3
    }

    struct PlanData {
        uint256 planId;
        uint256 plantId;
        uint256 yieldId;
        uint256 expertId;
        string planName;
        uint256 startDate;
        uint256 endDate;
        uint256 estimatedProduct;
        string estimatedUnit;
        string status;
    }

    struct TaskMilestone {
        uint256 taskId;
        string taskType;
        uint256 timestamp;
        string status;
        string data;
    }

    struct InspectionMilestone {
        uint256 inspectionId;
        uint256 timestamp;
        InspectionType inspectionType;
        string data;
    }

    event PlanCreated(uint256 indexed planId, string planName);
    event PlanUpdated(uint256 indexed planId, string status);
    event TaskMilestoneAdded(
        uint256 indexed planId,
        uint256 taskId,
        string taskType,
        uint256 timestamp
    );
    event InspectionMilestoneAdded(
        uint256 indexed planId,
        uint256 inspectionId,
        uint256 inspectionType,
        uint256 timestamp
    );

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
    ) external returns (uint256);

    function addTaskMilestone(
        uint256 _taskId,
        string calldata _taskType,
        string calldata _status,
        string calldata _data
    ) external;

    function addInspectionMilestone(
        uint256 _inspectionId,
        uint8 _inspectionType,
        string calldata _data
    ) external;

    function getPlanInfo()
        external
        view
        returns (
            PlanData memory planData,
            TaskMilestone[] memory taskList,
            InspectionMilestone[] memory inspectionList
        );

    function updateStatus(string calldata _status) external;
}
