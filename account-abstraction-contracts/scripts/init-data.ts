import { ethers } from "hardhat";
import { PlanManagement, TradeManagement } from "../typechain-types";

async function main() {
  // Lấy các contract instances
  const planManagement = await ethers.getContract<PlanManagement>("PlanManagement");
  const tradeManagement = await ethers.getContract<TradeManagement>("TradeManagement");

  // Tạo các kế hoạch mẫu
  const plans = [
    {
      plant_id: 1,
      yield_id: 1,
      expert_id: 1,
      plan_name: "Kế hoạch trồng rau sạch mùa xuân 2024",
      start_date: Math.floor(Date.now() / 1000),
      end_date: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60, // 90 ngày
      estimated_product: 1000, // kg
      qr_code: "PLAN_001"
    },
    {
      plant_id: 2,
      yield_id: 2,
      expert_id: 2,
      plan_name: "Kế hoạch trồng hoa quả mùa hè 2024",
      start_date: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // Bắt đầu sau 30 ngày
      end_date: Math.floor(Date.now() / 1000) + 120 * 24 * 60 * 60, // 120 ngày
      estimated_product: 2000, // kg
      qr_code: "PLAN_002"
    }
  ];

  // Tạo các kế hoạch
  for (const plan of plans) {
    const tx = await planManagement.createPlan(
      plan.plant_id,
      plan.yield_id,
      plan.expert_id,
      plan.plan_name,
      plan.start_date,
      plan.end_date,
      plan.estimated_product,
      plan.qr_code
    );
    await tx.wait();
    console.log(`Đã tạo kế hoạch: ${plan.plan_name}`);
  }

  // Tạo các đơn hàng mẫu
  const orders = [
    {
      retailer_id: 1,
      plan_id: 1,
      packaging_type_id: 1,
      deposit_price: ethers.parseEther("0.1"), // 0.1 VET
      estimated_pickup_date: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60
    },
    {
      retailer_id: 2,
      plan_id: 2,
      packaging_type_id: 2,
      deposit_price: ethers.parseEther("0.2"), // 0.2 VET
      estimated_pickup_date: Math.floor(Date.now() / 1000) + 120 * 24 * 60 * 60
    }
  ];

  // Tạo các đơn hàng
  for (const order of orders) {
    const tx = await tradeManagement.createOrder(
      order.retailer_id,
      order.plan_id,
      order.packaging_type_id,
      order.deposit_price,
      order.estimated_pickup_date
    );
    await tx.wait();
    console.log(`Đã tạo đơn hàng cho kế hoạch ${order.plan_id}`);
  }

  // Tạo các biểu mẫu kiểm tra mẫu
  const inspections = [
    {
      plan_id: 1,
      inspector_id: 1,
      start_date: Math.floor(Date.now() / 1000),
      end_date: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      images: ["https://example.com/inspection1.jpg"]
    },
    {
      plan_id: 2,
      inspector_id: 2,
      start_date: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      end_date: Math.floor(Date.now() / 1000) + 37 * 24 * 60 * 60,
      images: ["https://example.com/inspection2.jpg"]
    }
  ];

  // Tạo các biểu mẫu kiểm tra
  for (const inspection of inspections) {
    const tx = await tradeManagement.createInspection(
      inspection.plan_id,
      inspection.inspector_id,
      inspection.start_date,
      inspection.end_date,
      inspection.images
    );
    await tx.wait();
    console.log(`Đã tạo biểu mẫu kiểm tra cho kế hoạch ${inspection.plan_id}`);
  }

  console.log("Đã hoàn thành khởi tạo dữ liệu mẫu!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 
