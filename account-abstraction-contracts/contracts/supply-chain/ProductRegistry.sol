// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../interfaces/IProductRegistry.sol";

contract ProductRegistry is IProductRegistry {
    mapping(uint256 => ProductBatch) public productBatches;
    uint256 public nextProductId = 1;

    event ProductBatchCreated(uint256 indexed batchId, uint256 indexed farmId);
    event ProductStatusUpdated(uint256 indexed batchId, ProductStatus status);
    event ActorAdded(uint256 indexed batchId, address actor);

    function createProductBatch(
        ProductBatch memory batch
    ) public override returns (uint256) {
        uint256 batchId = nextProductId++;
        batch.status = ProductStatus.Created;
        productBatches[batchId] = batch;
        emit ProductBatchCreated(batchId, batch.farmId);
        return batchId;
    }

    function updateProductStatus(uint256 batchId, ProductStatus status) public override {
        require(batchId < nextProductId, "Invalid batch ID");
        productBatches[batchId].status = status;
        emit ProductStatusUpdated(batchId, status);
    }

    function addSupplyChainActor(uint256 batchId, address actor) public override {
        require(batchId < nextProductId, "Invalid batch ID");
        productBatches[batchId].supplyChainActors.push(actor);
        emit ActorAdded(batchId, actor);
    }

    function getProductBatch(uint256 batchId) public view override returns (ProductBatch memory) {
        require(batchId < nextProductId, "Invalid batch ID");
        return productBatches[batchId];
    }
}