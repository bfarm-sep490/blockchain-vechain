// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IPlanManagement {
    struct Plan {
        uint id;
        uint plant_id;
        uint yield_id;
        uint expert_id;
        string plan_name;
        uint start_date;
        uint end_date;
        string status;
        uint estimated_product;
        string qr_code;
        bool is_approved;
        uint caring_task_count;
        uint harvesting_task_count;
        uint packaging_task_count;
    }

    struct CaringTaskSummary {
        uint plan_id;
        uint total_tasks;
        string overall_status;
        uint last_updated;
    }

    struct HarvestingTaskSummary {
        uint plan_id;
        uint total_tasks;
        string overall_status;
        uint total_harvested_quantity;
        uint last_updated;
    }

    struct PackagingTaskSummary {
        uint plan_id;
        uint total_tasks;
        uint total_packed_quantity;
        string overall_status;
        uint last_updated;
    }

    event PlanCreated(uint indexed id, string plan_name);
    event PlanUpdated(uint indexed id);
    event TaskSummaryUpdated(uint indexed plan_id, string task_type);

    function createPlan(
        uint plant_id,
        uint yield_id,
        uint expert_id,
        string memory plan_name,
        uint start_date,
        uint end_date,
        uint estimated_product,
        string memory qr_code
    ) external returns (uint);

    function updatePlanStatus(uint plan_id, string memory status) external;

    function approvePlan(uint plan_id) external;

    function getPlan(uint plan_id) external view returns (Plan memory);
}
