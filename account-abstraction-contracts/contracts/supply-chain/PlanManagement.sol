// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../interfaces/IPlanManagement.sol";

contract PlanManagement is IPlanManagement {
    mapping(uint => Plan) private plans;
    mapping(uint => CaringTaskSummary) public caring_task_summaries;
    mapping(uint => HarvestingTaskSummary) public harvesting_task_summaries;
    mapping(uint => PackagingTaskSummary) public packaging_task_summaries;

    uint private nextPlanId = 1;

    function createPlan(
        uint plant_id,
        uint yield_id,
        uint expert_id,
        string memory plan_name,
        uint start_date,
        uint end_date,
        uint estimated_product,
        string memory qr_code
    ) external override returns (uint) {
        uint planId = nextPlanId++;

        plans[planId] = Plan({
            id: planId,
            plant_id: plant_id,
            yield_id: yield_id,
            expert_id: expert_id,
            plan_name: plan_name,
            start_date: start_date,
            end_date: end_date,
            status: "created",
            estimated_product: estimated_product,
            qr_code: qr_code,
            is_approved: false,
            caring_task_count: 0,
            harvesting_task_count: 0,
            packaging_task_count: 0
        });

        emit PlanCreated(planId, plan_name);
        return planId;
    }

    function updatePlanStatus(
        uint plan_id,
        string memory status
    ) external override {
        require(plans[plan_id].id != 0, "Plan does not exist");
        plans[plan_id].status = status;
        emit PlanUpdated(plan_id);
    }

    function approvePlan(uint plan_id) external override {
        require(plans[plan_id].id != 0, "Plan does not exist");
        plans[plan_id].is_approved = true;
        emit PlanUpdated(plan_id);
    }

    function getPlan(
        uint plan_id
    ) external view override returns (Plan memory) {
        require(plans[plan_id].id != 0, "Plan does not exist");
        return plans[plan_id];
    }
}
