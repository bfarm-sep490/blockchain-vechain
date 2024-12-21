// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IProductRegistry {
    enum ProductStatus {
        Created,
        InTransit,
        AtDistributor,
        AtRetailer,
        Sold
    }

    struct ProductBatch {
        uint256 farmId;
        string productType;
        uint256 quantity;
        string unit;
        uint256 harvestDate;
        string[] certifications;
        string additionalInfo;
        ProductStatus status;
        address[] supplyChainActors;
    }

    function createProductBatch(ProductBatch memory batch) external returns (uint256);
    function updateProductStatus(uint256 batchId, ProductStatus status) external;
    function addSupplyChainActor(uint256 batchId, address actor) external;
    function getProductBatch(uint256 batchId) external view returns (ProductBatch memory);
}