import { ethers } from "hardhat";
import { PlanManagement } from "../typechain-types";

async function main() {
    try {
        const [deployer] = await ethers.getSigners();
        console.log("Deploying mock data with account:", deployer.address);

        const deployments = await ethers.getContractFactory("PlanManagement");
        const planManagement = await deployments.deploy();
        await planManagement.waitForDeployment();

        const planManagementAddress = await planManagement.getAddress();
        console.log("PlanManagement deployed to:", planManagementAddress);

        console.log("Creating new plan...");
        const tx1 = await planManagement.createPlan(
            1,
            1,
            1,
            1,
            "Kế hoạch sản xuất cây ngắn hạn 2025",
            Math.floor(Date.now() / 1000),
            Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
            1000, 
            "kg", 
            "Đang thực hiện" 
        );
        await tx1.wait();
        console.log("Plan created successfully!");

        console.log("Adding task milestones...");
        const tasks = [
            {
                taskId: 1,
                taskType: "Chuẩn bị đất",
                status: "Hoàn thành",
                dataHash: ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify({
                    description: "Chuẩn bị đất trồng lúa mùa 2024",
                    farmerInfo: {
                        farmerId: "F001",
                        farmerName: "Nguyễn Văn A"
                    },
                    fertilizers: [
                        {
                            fertilizerId: "FT001",
                            name: "Phân NPK",
                            quantity: 50,
                            unit: "kg"
                        }
                    ],
                    pesticides: [
                        {
                            pesticideId: "PS001",
                            name: "Thuốc trừ sâu sinh học",
                            quantity: 2,
                            unit: "lít"
                        }
                    ],
                    items: [
                        {
                            itemId: "IT001",
                            name: "Máy cày",
                            quantity: 1,
                            unit: "cái"
                        }
                    ],
                    web2Timestamp: Math.floor(Date.now() / 1000)
                })))
            },
            {
                taskId: 2,
                taskType: "Gieo hạt",
                status: "Đang thực hiện",
                dataHash: ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify({
                    description: "Gieo hạt giống lúa mùa 2024",
                    farmerInfo: {
                        farmerId: "F001",
                        farmerName: "Nguyễn Văn A"
                    },
                    fertilizers: [
                        {
                            fertilizerId: "FT002",
                            name: "Phân hữu cơ",
                            quantity: 100,
                            unit: "kg"
                        }
                    ],
                    pesticides: [],
                    items: [
                        {
                            itemId: "IT002",
                            name: "Máy gieo hạt",
                            quantity: 1,
                            unit: "cái"
                        }
                    ],
                    web2Timestamp: Math.floor(Date.now() / 1000)
                })))
            },
            {
                taskId: 3,
                taskType: "Chăm sóc",
                status: "Chưa bắt đầu",
                dataHash: ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify({
                    description: "Chăm sóc lúa mùa 2024",
                    farmerInfo: {
                        farmerId: "F001",
                        farmerName: "Nguyễn Văn A"
                    },
                    fertilizers: [
                        {
                            fertilizerId: "FT003",
                            name: "Phân bón lá",
                            quantity: 5,
                            unit: "lít"
                        }
                    ],
                    pesticides: [
                        {
                            pesticideId: "PS002",
                            name: "Thuốc trừ cỏ",
                            quantity: 1,
                            unit: "lít"
                        }
                    ],
                    items: [
                        {
                            itemId: "IT003",
                            name: "Bình phun",
                            quantity: 2,
                            unit: "cái"
                        }
                    ],
                    web2Timestamp: Math.floor(Date.now() / 1000)
                })))
            }
        ];

        for (const task of tasks) {
            const tx2 = await planManagement.addTaskMilestone(
                task.taskId,
                task.taskType,
                task.status,
                task.dataHash
            );
            await tx2.wait();
        }
        console.log("Task milestones added successfully!");

        console.log("Adding inspection milestones...");
        const inspections = [
            {
                inspectionId: 1,
                inspectionType: 0,
                dataHash: ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify({
                    description: "Kiểm tra chất lượng đất trước khi gieo hạt",
                    inspectorInfo: {
                        inspectorId: "I001",
                        inspectorName: "Trần Thị B"
                    },
                    results: {
                        arsenic: 0.05,
                        ecoli: 0,
                        nitrate: 10,
                        pH: 6.5,
                        organicMatter: 2.5
                    },
                    sampleInfo: {
                        numberOfSample: 5,
                        sampleWeight: 1000,
                        unit: "gram"
                    },
                    web2Timestamp: Math.floor(Date.now() / 1000)
                })))
            },
            {
                inspectionId: 2,
                inspectionType: 1, // Type2
                dataHash: ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify({
                    description: "Kiểm tra chất lượng hạt giống",
                    inspectorInfo: {
                        inspectorId: "I002",
                        inspectorName: "Lê Văn C"
                    },
                    results: {
                        germinationRate: 95,
                        moisture: 12,
                        purity: 99,
                        weight: 25,
                        unit: "gram/1000 hạt"
                    },
                    sampleInfo: {
                        numberOfSample: 3,
                        sampleWeight: 500,
                        unit: "gram"
                    },
                    web2Timestamp: Math.floor(Date.now() / 1000)
                })))
            }
        ];

        for (const inspection of inspections) {
            const tx3 = await planManagement.addInspectionMilestone(
                inspection.inspectionId,
                inspection.inspectionType,
                inspection.dataHash
            );
            await tx3.wait();
        }
        console.log("Inspection milestones added successfully!");

        // Lấy thông tin kế hoạch để kiểm tra
        const planInfo = await planManagement.getPlanInfo();
        console.log("Plan Info:", {
            planName: planInfo.planData.planName,
            status: planInfo.planData.status,
            taskCount: planInfo.taskList.length,
            inspectionCount: planInfo.inspectionList.length
        });
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 
