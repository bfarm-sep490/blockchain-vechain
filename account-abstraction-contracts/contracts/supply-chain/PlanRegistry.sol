// contracts/supply-chain/PlanRegistry.sol

pragma solidity ^0.8.0;
import "../interfaces/IPlan.sol";

contract PlanRegistry is IPlanRegistry {
    // State variables
    mapping(uint256 => PlanBatch) private plans;
    uint256 private planCounter;

    // Events
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

        // Khởi tạo plan mới
        PlanBatch storage newPlan = plans[planCounter];

        // Gán các giá trị cơ bản
        newPlan.plan_id = planCounter;
        newPlan.seed_name = _seedName;
        newPlan.yield = _yield;
        newPlan.unit = _unit;
        newPlan.start_date = _startDate;
        newPlan.end_date = _endDate;
        newPlan.status = PlanStatus.InProgress;

        // Không khởi tạo trực tiếp mảng rỗng
        // Các mảng sẽ được thêm vào sau thông qua các function riêng

        emit PlanCreated(planCounter);
        return planCounter;
    }

    // Function để thêm item_info
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

    // Function để thêm fertilizer_info
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

    // Tương tự cho các function thêm pesticide_info và các activities khác

    // Function để lấy thông tin plan
    function getPlan(uint256 _planId) external view returns (PlanBatch memory) {
        require(_planId <= planCounter && _planId > 0, "Invalid plan ID");
        return plans[_planId];
    }
}
