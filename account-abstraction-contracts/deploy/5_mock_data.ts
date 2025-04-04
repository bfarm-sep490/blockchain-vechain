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
                data: JSON.stringify({
                    d: "Chuẩn bị đất trồng lúa mùa 2024",
                    f: { id: "F001", n: "Nguyễn Văn A" },
                    ft: [{ id: "FT001", n: "Phân NPK", q: 50, u: "kg" }],
                    p: [{ id: "PS001", n: "Thuốc trừ sâu sinh học", q: 2, u: "lít" }],
                    i: [{ id: "IT001", n: "Máy cày", q: 1, u: "cái" }],
                    t: Math.floor(Date.now() / 1000)
                })
            },
            {
                taskId: 2,
                taskType: "Gieo hạt",
                status: "Đang thực hiện",
                data: JSON.stringify({
                    d: "Gieo hạt giống lúa mùa 2024",
                    f: { id: "F001", n: "Nguyễn Văn A" },
                    ft: [{ id: "FT002", n: "Phân hữu cơ", q: 100, u: "kg" }],
                    p: [],
                    i: [{ id: "IT002", n: "Máy gieo hạt", q: 1, u: "cái" }],
                    t: Math.floor(Date.now() / 1000)
                })
            }
        ];

        for (const task of tasks) {
            const tx2 = await planManagement.addTaskMilestone(
                task.taskId,
                task.taskType,
                task.status,
                task.data,
                { gasLimit: 1000000 }
            );
            await tx2.wait();
        }
        console.log("Task milestones added successfully!");

        console.log("Adding inspection milestones...");
        const inspections = [
            {
                inspectionId: 1,
                inspectionType: 0,
                data: JSON.stringify({
                    d: "Kiểm tra chất lượng đất trước khi gieo hạt",
                    i: { id: "I001", n: "Trần Thị B" },
                    r: { a: 0.05, e: 0, n: 10, p: 6.5, o: 2.5 },
                    s: { n: 5, w: 1000, u: "gram" },
                    t: Math.floor(Date.now() / 1000)
                })
            }
        ];

        for (const inspection of inspections) {
            const tx3 = await planManagement.addInspectionMilestone(
                inspection.inspectionId,
                inspection.inspectionType,
                inspection.data,
                { gasLimit: 1000000 }
            );
            await tx3.wait();
        }
        console.log("Inspection milestones added successfully!");

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