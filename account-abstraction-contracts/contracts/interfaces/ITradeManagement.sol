// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface ITradeManagement {
    struct InspectingForm {
        uint id;
        uint plan_id;
        uint inspector_id;
        uint start_date;
        uint end_date;
        bool can_harvest;
        string evaluated_result;
        string[] images;
    }

    struct Order {
        uint id;
        uint retailer_id;
        uint plan_id;
        uint packaging_type_id;
        uint deposit_price;
        string status;
        uint estimated_pickup_date;
    }

    struct Transaction {
        uint id;
        uint order_id;
        uint price;
        string status;
        uint payment_date;
    }

    struct PackagingProduct {
        uint id;
        uint packaging_task_id;
        uint harvesting_task_id;
        uint order_id;
        uint packaging_quantity;
        string qr_code;
        string status;
    }

    event InspectionCreated(uint indexed id, uint plan_id);
    event OrderCreated(uint indexed id, uint retailer_id);
    event TransactionCompleted(uint indexed id, uint order_id);
    event PackagingProductCreated(uint indexed id, string qr_code);

    function createInspection(
        uint plan_id,
        uint inspector_id,
        uint start_date,
        uint end_date,
        string[] memory images
    ) external returns (uint);

    function createOrder(
        uint retailer_id,
        uint plan_id,
        uint packaging_type_id,
        uint deposit_price,
        uint estimated_pickup_date
    ) external returns (uint);

    function createTransaction(
        uint order_id,
        uint price
    ) external returns (uint);
}
