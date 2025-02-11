// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IPlanRegistry {
    enum PlanStatus {
        Cancelled,
        InProgress,
        Completed
    }

    enum GTKitColor {
        Green,
        Yellow,
        Red
    }

    struct date {
        uint256 day;
        uint256 month;
        uint256 year;
        uint256 timestamp;
    }

    struct item {
        uint256 item_id;
        uint256 quantity;
    }

    struct fertilizer {
        uint256 fertilizer_id;
        uint256 quantity;
    }

    struct pesticide {
        uint256 pesticide_id;
        uint256 quantity;
    }

    struct item_info {
        uint256 item_id;
        string item_name;
        string item_description;
    }

    struct fertilizer_info {
        uint256 fertilizer_id;
        string fertilizer_name;
        string fertilizer_description;
    }

    struct pesticide_info {
        uint256 pesticide_id;
        string pesticide_name;
        string pesticide_description;
    }

    struct productive_activity {
        uint256 activity_id;
        string activity_name;
        string activity_type;
        uint256 land_id;
        date completed_date;
        item[] items;
        fertilizer[] fertilizers;
        pesticide[] pesticides;
    }

    struct harvesting_activity {
        uint256 activity_id;
        string activity_name;
        string activity_type;
        uint256 land_id;
        date completed_date;
        uint256 quantity;
        string unit;
        item[] items;
    }

    struct inspecting_activity {
        uint256 activity_id;
        string activity_name;
        string activity_type;
        uint256 land_id;
        date completed_date;
        uint256 brix_point;
        uint256 moisture;
        uint256 temperature;
        uint256 humidity;
        GTKitColor test_gt_kit_color;
        uint256 quantity;
        string unit;
        uint256 percent_issue;
        string issue;
    }

    struct packaging_activity {
        uint256 activity_id;
        string activity_name;
        string activity_type;
        uint256 land_id;
        date completed_date;
        item[] items;
        uint256 quantity;
        string unit;
    }

    struct PlanBatch {
        uint256 plan_id;
        string seed_name;
        uint256 yield;
        string unit;
        date start_date;
        date end_date;
        item_info[] items;
        fertilizer_info[] fertilizers;
        pesticide_info[] pesticides;
        productive_activity[] productive_activities;
        harvesting_activity[] harvesting_activities;
        inspecting_activity[] inspecting_activities;
        packaging_activity[] packaging_activities;
        PlanStatus status;
    }
}
