// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../interfaces/ITradeManagement.sol";

contract TradeManagement is ITradeManagement {
    mapping(uint => InspectingForm) private inspections;
    mapping(uint => Order) private orders;
    mapping(uint => Transaction) private transactions;
    mapping(uint => PackagingProduct) private packagingProducts;

    uint private nextInspectionId = 1;
    uint private nextOrderId = 1;
    uint private nextTransactionId = 1;
    uint private nextPackagingProductId = 1;

    function createInspection(
        uint plan_id,
        uint inspector_id,
        uint start_date,
        uint end_date,
        string[] memory images
    ) external override returns (uint) {
        uint inspectionId = nextInspectionId++;

        inspections[inspectionId] = InspectingForm({
            id: inspectionId,
            plan_id: plan_id,
            inspector_id: inspector_id,
            start_date: start_date,
            end_date: end_date,
            can_harvest: false,
            evaluated_result: "",
            images: images
        });

        emit InspectionCreated(inspectionId, plan_id);
        return inspectionId;
    }

    function createOrder(
        uint retailer_id,
        uint plan_id,
        uint packaging_type_id,
        uint deposit_price,
        uint estimated_pickup_date
    ) external override returns (uint) {
        uint orderId = nextOrderId++;

        orders[orderId] = Order({
            id: orderId,
            retailer_id: retailer_id,
            plan_id: plan_id,
            packaging_type_id: packaging_type_id,
            deposit_price: deposit_price,
            status: "created",
            estimated_pickup_date: estimated_pickup_date
        });

        emit OrderCreated(orderId, retailer_id);
        return orderId;
    }

    function createTransaction(
        uint order_id,
        uint price
    ) external override returns (uint) {
        require(orders[order_id].id != 0, "Order does not exist");

        uint transactionId = nextTransactionId++;

        transactions[transactionId] = Transaction({
            id: transactionId,
            order_id: order_id,
            price: price,
            status: "pending",
            payment_date: block.timestamp
        });

        emit TransactionCompleted(transactionId, order_id);
        return transactionId;
    }

    function createPackagingProduct(
        uint packaging_task_id,
        uint harvesting_task_id,
        uint order_id,
        uint packaging_quantity,
        string memory qr_code
    ) external returns (uint) {
        uint productId = nextPackagingProductId++;

        packagingProducts[productId] = PackagingProduct({
            id: productId,
            packaging_task_id: packaging_task_id,
            harvesting_task_id: harvesting_task_id,
            order_id: order_id,
            packaging_quantity: packaging_quantity,
            qr_code: qr_code,
            status: "created"
        });

        emit PackagingProductCreated(productId, qr_code);
        return productId;
    }

    // Getter functions
    function getInspection(
        uint inspection_id
    ) external view returns (InspectingForm memory) {
        require(
            inspections[inspection_id].id != 0,
            "Inspection does not exist"
        );
        return inspections[inspection_id];
    }

    function getOrder(uint order_id) external view returns (Order memory) {
        require(orders[order_id].id != 0, "Order does not exist");
        return orders[order_id];
    }

    function getTransaction(
        uint transaction_id
    ) external view returns (Transaction memory) {
        require(
            transactions[transaction_id].id != 0,
            "Transaction does not exist"
        );
        return transactions[transaction_id];
    }

    function getPackagingProduct(
        uint product_id
    ) external view returns (PackagingProduct memory) {
        require(
            packagingProducts[product_id].id != 0,
            "Product does not exist"
        );
        return packagingProducts[product_id];
    }
}
