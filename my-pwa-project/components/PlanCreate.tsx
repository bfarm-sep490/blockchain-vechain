import React, { useState } from 'react';
import { useVeChainAccount } from '@/lib/useVeChainAccount';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PlanCreateProps {
    onSubmit: (planData: any) => Promise<void>;
}

const PlanCreate: React.FC<PlanCreateProps> = ({ onSubmit }) => {
    const { sendTransaction, address } = useVeChainAccount();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        plant_id: '',
        yield_id: '',
        expert_id: '',
        plan_name: '',
        start_date: '',
        end_date: '',
        estimated_product: '',
        qr_code: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
        toast({
            title: "Lỗi",
            description: "Vui lòng kết nối ví VeChain trước",
            variant: "destructive",
        });
        return;
    }

    try {
        // Chuyển đổi ngày tháng sang timestamp Unix (giây)
        const startDateTimestamp = BigInt(new Date(formData.start_date).getTime() / 1000)
			const endDateTimestamp = BigInt(new Date(formData.end_date).getTime() / 1000)


        await sendTransaction({
            to: process.env.NEXT_PUBLIC_PLAN_MANAGEMENT_ADDRESS,
            data: {
                abi: [{
                    name: 'createPlan',
                    type: 'function',
                    inputs: [
                        { name: 'plant_id', type: 'uint256' },
                        { name: 'yield_id', type: 'uint256' },
                        { name: 'expert_id', type: 'uint256' },
                        { name: 'plan_name', type: 'string' },
                        { name: 'start_date', type: 'uint256' },
                        { name: 'end_date', type: 'uint256' },
                        { name: 'estimated_product', type: 'uint256' },
                        { name: 'qr_code', type: 'string' }
                    ],
                    outputs: [{ type: 'uint256' }]
                }],
                functionName: 'createPlan',
                args: [
                    BigInt(formData.plant_id),
                    BigInt(formData.yield_id),
                    BigInt(formData.expert_id),
                    formData.plan_name,
                    startDateTimestamp,
                    endDateTimestamp,
                    BigInt(formData.estimated_product),
                    formData.qr_code
                ]
            }
        });

        toast({
            title: "Đang xử lý",
            description: "Đang tạo kế hoạch mới...",
        });

        // Reset form
        setFormData({
            plant_id: '',
            yield_id: '',
            expert_id: '',
            plan_name: '',
            start_date: '',
            end_date: '',
            estimated_product: '',
            qr_code: ''
        });

        toast({
            title: "Thành công",
            description: "Đã tạo kế hoạch mới",
            variant: "default",
        });

        await onSubmit(formData);
    } catch (error) {
        console.error('Lỗi khi tạo kế hoạch:', error);
        toast({
            title: "Lỗi",
            description: "Không thể tạo kế hoạch mới",
            variant: "destructive",
        });
    }
};

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tạo Kế Hoạch Mới</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="plan_name">Tên kế hoạch</Label>
                            <Input
                                id="plan_name"
                                value={formData.plan_name}
                                onChange={(e) => setFormData({...formData, plan_name: e.target.value})}
                                placeholder="Nhập tên kế hoạch"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="plant_id">ID Cây trồng</Label>
                            <Input
                                id="plant_id"
                                type="number"
                                value={formData.plant_id}
                                onChange={(e) => setFormData({...formData, plant_id: e.target.value})}
                                placeholder="Nhập ID cây trồng"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="yield_id">ID Thu hoạch</Label>
                            <Input
                                id="yield_id"
                                type="number"
                                value={formData.yield_id}
                                onChange={(e) => setFormData({...formData, yield_id: e.target.value})}
                                placeholder="Nhập ID thu hoạch"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="expert_id">ID Chuyên gia</Label>
                            <Input
                                id="expert_id"
                                type="number"
                                value={formData.expert_id}
                                onChange={(e) => setFormData({...formData, expert_id: e.target.value})}
                                placeholder="Nhập ID chuyên gia"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="start_date">Ngày bắt đầu</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="end_date">Ngày kết thúc</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="estimated_product">Sản lượng dự kiến</Label>
                            <Input
                                id="estimated_product"
                                type="number"
                                value={formData.estimated_product}
                                onChange={(e) => setFormData({...formData, estimated_product: e.target.value})}
                                placeholder="Nhập sản lượng dự kiến"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="qr_code">Mã QR</Label>
                            <Input
                                id="qr_code"
                                type="text"
                                value={formData.qr_code}
                                onChange={(e) => setFormData({...formData, qr_code: e.target.value})}
                                placeholder="Nhập mã QR"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={!address}>
                        Tạo Kế Hoạch
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default PlanCreate;