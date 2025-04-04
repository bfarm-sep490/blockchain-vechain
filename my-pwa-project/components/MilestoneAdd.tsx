import React, { useState, useEffect } from 'react';
import { useVeChainAccount } from '@/lib/useVeChainAccount';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MilestoneAddProps {
	onSubmit: () => Promise<void>;
}

const MilestoneAdd: React.FC<MilestoneAddProps> = ({ onSubmit }) => {
	const { sendTransaction, address } = useVeChainAccount();
	const { toast } = useToast();
	const [activeTab, setActiveTab] = useState("task");
	const [isPlanInitialized, setIsPlanInitialized] = useState(false);

	const PLAN_MANAGEMENT_ADDRESS = '0x4020af892540328fd9966e3a496129cc2a729a01';

	// Form data cho task milestone
	const [taskFormData, setTaskFormData] = useState({
		task_id: '',
		task_type: '',
		status: '',
		data: JSON.stringify({
			d: '', // description
			f: { id: '', n: '' }, // farmer info
			ft: [], // fertilizers
			p: [], // pesticides
			i: [], // items
			t: Math.floor(Date.now() / 1000)
		})
	});

	// Form data cho inspection milestone
	const [inspectionFormData, setInspectionFormData] = useState({
		inspection_id: '',
		inspection_type: '0',
		data: JSON.stringify({
			d: '', // description
			i: { id: '', n: '' }, // inspector info
			r: { a: 0, e: 0, n: 0, p: 0, o: 0 }, // results
			s: { n: 0, w: 0, u: '' }, // sample info
			t: Math.floor(Date.now() / 1000)
		})
	});

	useEffect(() => {
		checkPlanInitialization();
	}, []);

	const checkPlanInitialization = async () => {
		try {
			const result = await sendTransaction({
				to: PLAN_MANAGEMENT_ADDRESS,
				data: {
					abi: [{
						name: 'getPlanInfo',
						type: 'function',
						inputs: [],
						outputs: [
							{
								name: 'planData', type: 'tuple', components: [
									{ name: 'planId', type: 'uint256' },
									{ name: 'plantId', type: 'uint256' },
									{ name: 'yieldId', type: 'uint256' },
									{ name: 'expertId', type: 'uint256' },
									{ name: 'planName', type: 'string' },
									{ name: 'startDate', type: 'uint256' },
									{ name: 'endDate', type: 'uint256' },
									{ name: 'estimatedProduct', type: 'uint256' },
									{ name: 'estimatedUnit', type: 'string' },
									{ name: 'status', type: 'string' }
								]
							},
							{
								name: 'taskList', type: 'tuple[]', components: [
									{ name: 'taskId', type: 'uint256' },
									{ name: 'taskType', type: 'string' },
									{ name: 'timestamp', type: 'uint256' },
									{ name: 'status', type: 'string' },
									{ name: 'data', type: 'string' }
								]
							},
							{
								name: 'inspectionList', type: 'tuple[]', components: [
									{ name: 'inspectionId', type: 'uint256' },
									{ name: 'timestamp', type: 'uint256' },
									{ name: 'inspectionType', type: 'uint8' },
									{ name: 'data', type: 'string' }
								]
							}
						]
					}],
					functionName: 'getPlanInfo',
					args: []
				}
			});
			setIsPlanInitialized(true);
		} catch (error) {
			setIsPlanInitialized(false);
			toast({
				title: "Lỗi",
				description: "Kế hoạch chưa được khởi tạo. Vui lòng tạo kế hoạch trước khi thêm milestone.",
				variant: "destructive",
			});
		}
	};

	const handleAddTask = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!address) {
			toast({
				title: "Lỗi",
				description: "Vui lòng kết nối ví VeChain trước",
				variant: "destructive",
			});
			return;
		}

		if (!isPlanInitialized) {
			toast({
				title: "Lỗi",
				description: "Kế hoạch chưa được khởi tạo. Vui lòng tạo kế hoạch trước khi thêm milestone.",
				variant: "destructive",
			});
			return;
		}

		try {
			await sendTransaction({
				to: PLAN_MANAGEMENT_ADDRESS,
				data: {
					abi: [{
						name: 'addTaskMilestone',
						type: 'function',
						inputs: [
							{ name: '_taskId', type: 'uint256' },
							{ name: '_taskType', type: 'string' },
							{ name: '_status', type: 'string' },
							{ name: '_data', type: 'string' }
						],
						outputs: []
					}],
					functionName: 'addTaskMilestone',
					args: [
						BigInt(taskFormData.task_id),
						taskFormData.task_type,
						taskFormData.status,
						taskFormData.data
					]
				}
			});

			toast({
				title: "Đang xử lý",
				description: "Đang thêm công việc mới...",
			});

			// Reset form
			setTaskFormData({
				task_id: '',
				task_type: '',
				status: '',
				data: JSON.stringify({
					d: '',
					f: { id: '', n: '' },
					ft: [],
					p: [],
					i: [],
					t: Math.floor(Date.now() / 1000)
				})
			});

			toast({
				title: "Thành công",
				description: "Đã thêm công việc mới",
				variant: "default",
			});

			await onSubmit();
		} catch (error) {
			console.error('Lỗi khi thêm công việc:', error);
			toast({
				title: "Lỗi",
				description: "Không thể thêm công việc mới",
				variant: "destructive",
			});
		}
	};

	const handleAddInspection = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!address) {
			toast({
				title: "Lỗi",
				description: "Vui lòng kết nối ví VeChain trước",
				variant: "destructive",
			});
			return;
		}

		if (!isPlanInitialized) {
			toast({
				title: "Lỗi",
				description: "Kế hoạch chưa được khởi tạo. Vui lòng tạo kế hoạch trước khi thêm milestone.",
				variant: "destructive",
			});
			return;
		}

		try {
			await sendTransaction({
				to: PLAN_MANAGEMENT_ADDRESS,
				data: {
					abi: [{
						name: 'addInspectionMilestone',
						type: 'function',
						inputs: [
							{ name: '_inspectionId', type: 'uint256' },
							{ name: '_inspectionType', type: 'uint8' },
							{ name: '_data', type: 'string' }
						],
						outputs: []
					}],
					functionName: 'addInspectionMilestone',
					args: [
						BigInt(inspectionFormData.inspection_id),
						Number(inspectionFormData.inspection_type),
						inspectionFormData.data
					]
				}
			});

			toast({
				title: "Đang xử lý",
				description: "Đang thêm kiểm định mới...",
			});

			// Reset form
			setInspectionFormData({
				inspection_id: '',
				inspection_type: '0',
				data: JSON.stringify({
					d: '',
					i: { id: '', n: '' },
					r: { a: 0, e: 0, n: 0, p: 0, o: 0 },
					s: { n: 0, w: 0, u: '' },
					t: Math.floor(Date.now() / 1000)
				})
			});

			toast({
				title: "Thành công",
				description: "Đã thêm kiểm định mới",
				variant: "default",
			});

			await onSubmit();
		} catch (error) {
			console.error('Lỗi khi thêm kiểm định:', error);
			toast({
				title: "Lỗi",
				description: "Không thể thêm kiểm định mới",
				variant: "destructive",
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Thêm Công Việc/Kiểm Định</CardTitle>
			</CardHeader>
			<CardContent>
				{!isPlanInitialized && (
					<div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
						<p>Kế hoạch chưa được khởi tạo. Vui lòng tạo kế hoạch trước khi thêm milestone.</p>
					</div>
				)}
				<Tabs defaultValue="task" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="task">Công Việc</TabsTrigger>
						<TabsTrigger value="inspection">Kiểm Định</TabsTrigger>
					</TabsList>
					<TabsContent value="task">
						<form onSubmit={handleAddTask} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="task_id">ID Công Việc</Label>
									<Input
										id="task_id"
										type="number"
										value={taskFormData.task_id}
										onChange={(e) => setTaskFormData({ ...taskFormData, task_id: e.target.value })}
										placeholder="Nhập ID công việc"
										required
									/>
								</div>
								<div>
									<Label htmlFor="task_type">Loại Công Việc</Label>
									<Input
										id="task_type"
										value={taskFormData.task_type}
										onChange={(e) => setTaskFormData({ ...taskFormData, task_type: e.target.value })}
										placeholder="Nhập loại công việc"
										required
									/>
								</div>
								<div>
									<Label htmlFor="status">Trạng Thái</Label>
									<Input
										id="status"
										value={taskFormData.status}
										onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
										placeholder="Nhập trạng thái"
										required
									/>
								</div>
							</div>
							<Button type="submit" disabled={!address || !isPlanInitialized}>
								Thêm Công Việc
							</Button>
						</form>
					</TabsContent>
					<TabsContent value="inspection">
						<form onSubmit={handleAddInspection} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="inspection_id">ID Kiểm Định</Label>
									<Input
										id="inspection_id"
										type="number"
										value={inspectionFormData.inspection_id}
										onChange={(e) => setInspectionFormData({ ...inspectionFormData, inspection_id: e.target.value })}
										placeholder="Nhập ID kiểm định"
										required
									/>
								</div>
								<div>
									<Label htmlFor="inspection_type">Loại Kiểm Định</Label>
									<Input
										id="inspection_type"
										type="number"
										value={inspectionFormData.inspection_type}
										onChange={(e) => setInspectionFormData({ ...inspectionFormData, inspection_type: e.target.value })}
										placeholder="Nhập loại kiểm định (0-2)"
										required
									/>
								</div>
							</div>
							<Button type="submit" disabled={!address || !isPlanInitialized}>
								Thêm Kiểm Định
							</Button>
						</form>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default MilestoneAdd;