import React from 'react';

interface Plan {
    id: bigint;
    plant_id: bigint;
    yield_id: bigint;
    expert_id: bigint;
    plan_name: string;
    start_date: bigint;
    end_date: bigint;
    status: string;
    estimated_product: bigint;
    qr_code: string;
    is_approved: boolean;
    caring_task_count: bigint;
    harvesting_task_count: bigint;
    packaging_task_count: bigint;
}

interface PlanDisplayProps {
    plan: Plan;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
    const formatDate = (timestamp: bigint) => {
        return new Date(Number(timestamp) * 1000).toLocaleDateString('vi-VN');
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h3 className="text-xl font-bold mb-4">{plan.plan_name}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-600">ID Kế hoạch: {Number(plan.id)}</p>
                    <p className="text-gray-600">ID Cây trồng: {Number(plan.plant_id)}</p>
                    <p className="text-gray-600">ID Thu hoạch: {Number(plan.yield_id)}</p>
                    <p className="text-gray-600">Chuyên gia: {Number(plan.expert_id)}</p>
                </div>
                <div>
                    <p className="text-gray-600">Ngày bắt đầu: {formatDate(plan.start_date)}</p>
                    <p className="text-gray-600">Ngày kết thúc: {formatDate(plan.end_date)}</p>
                    <p className="text-gray-600">Trạng thái: {plan.status}</p>
                    <p className="text-gray-600">Sản lượng dự kiến: {Number(plan.estimated_product)}</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-600">Mã QR: {plan.qr_code}</p>
                <p className="text-gray-600">Đã duyệt: {plan.is_approved ? 'Có' : 'Chưa'}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="font-bold">{Number(plan.caring_task_count)}</p>
                    <p className="text-sm text-gray-600">Nhiệm vụ chăm sóc</p>
                </div>
                <div className="text-center">
                    <p className="font-bold">{Number(plan.harvesting_task_count)}</p>
                    <p className="text-sm text-gray-600">Nhiệm vụ thu hoạch</p>
                </div>
                <div className="text-center">
                    <p className="font-bold">{Number(plan.packaging_task_count)}</p>
                    <p className="text-sm text-gray-600">Nhiệm vụ đóng gói</p>
                </div>
            </div>
        </div>
    );
};

export default PlanDisplay;