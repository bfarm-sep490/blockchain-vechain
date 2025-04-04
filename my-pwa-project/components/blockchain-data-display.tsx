import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useVeChainAccount } from '@/lib/useVeChainAccount'
import { clauseBuilder, FunctionFragment } from '@vechain/sdk-core'
import { ethers } from 'ethers'
import MilestoneAdd from './MilestoneAdd'

interface PlanData {
	planId: bigint
	plantId: bigint
	yieldId: bigint
	expertId: bigint
	planName: string
	startDate: bigint
	endDate: bigint
	estimatedProduct: bigint
	estimatedUnit: string
	status: string
}

interface TaskMilestone {
	taskId: bigint
	taskType: string
	timestamp: bigint
	status: string
	data: string
}

interface InspectionMilestone {
	inspectionId: bigint
	timestamp: bigint
	inspectionType: number
	data: string
}

interface TaskMetadata {
	d: string; // description - mô tả công việc
	f: { // farmer - thông tin nông dân
		id: string; // farmerId - mã nông dân
		n: string; // name - tên nông dân
	};
	ft?: Array<{ // fertilizers - danh sách phân bón
		id: string; // fertilizerId - mã phân bón
		n: string; // name - tên phân bón
		q: number; // quantity - số lượng
		u: string; // unit - đơn vị
	}>;
	p?: Array<{ // pesticides - danh sách thuốc trừ sâu
		id: string; // pesticideId - mã thuốc trừ sâu
		n: string; // name - tên thuốc trừ sâu
		q: number; // quantity - số lượng
		u: string; // unit - đơn vị
	}>;
	i?: Array<{ // items - danh sách vật dụng
		id: string; // itemId - mã vật dụng
		n: string; // name - tên vật dụng
		q: number; // quantity - số lượng
		u: string; // unit - đơn vị
	}>;
	t: number; // timestamp - thời gian thực hiện
}

interface InspectionMetadata {
	d: string; // description - mô tả kiểm định
	i: { // inspector - thông tin người kiểm định
		id: string; // inspectorId - mã người kiểm định
		n: string; // name - tên người kiểm định
	};
	r: { // results - kết quả kiểm định
		a: number; // arsenic - hàm lượng asen
		e: number; // ecoli - hàm lượng e.coli
		n: number; // nitrate - hàm lượng nitrate
		p: number; // pH - độ pH
		o: number; // organic matter - hàm lượng chất hữu cơ
	};
	s: { // sample - thông tin mẫu
		n: number; // numberOfSample - số lượng mẫu
		w: number; // sampleWeight - trọng lượng mẫu
		u: string; // unit - đơn vị
	};
	t: number; // timestamp - thời gian kiểm định
}

const BlockchainDataDisplay = () => {
	const [plans, setPlans] = useState<{
		planData: PlanData,
		taskList: TaskMilestone[],
		inspectionList: InspectionMilestone[]
	}[]>([])
	const [loading, setLoading] = useState(true)
	const { thor, address } = useVeChainAccount()

	const PLAN_MANAGEMENT_ADDRESS = '0x10eddc3846cd0a82fd1ee68c6e44cc26995df237'

	const loadBlockchainData = async () => {
		try {
			if (!thor || !address) {
				console.log('Thor or address not available yet')
				return
			}

			const planResult = await thor.contracts.executeCall(
				PLAN_MANAGEMENT_ADDRESS,
				'function getPlanInfo() view returns (tuple(uint256 planId, uint256 plantId, uint256 yieldId, uint256 expertId, string planName, uint256 startDate, uint256 endDate, uint256 estimatedProduct, string estimatedUnit, string status) planData, tuple(uint256 taskId, string taskType, uint256 timestamp, string status, string data)[] taskList, tuple(uint256 inspectionId, uint256 timestamp, uint8 inspectionType, string data)[] inspectionList)' as unknown as FunctionFragment,
				[]
			)
			setPlans([{
				planData: planResult[0] as PlanData,
				taskList: planResult[1] as TaskMilestone[],
				inspectionList: planResult[2] as InspectionMilestone[]
			}])

			setLoading(false)
		} catch (error) {
			console.error('Error loading blockchain data:', error)
			setLoading(false)
		}
	}

	useEffect(() => {
		loadBlockchainData()
	}, [thor, address])

	const getInspectionTypeString = (type: number) => {
		const typeMap = [
			'1',
			'2',
			'3'
		]
		return typeMap[Number(type)] || 'Không xác định'
	}

	const formatTaskDataHash = (data: string) => {
		try {
			const metadata = JSON.parse(data) as TaskMetadata;
			return (
				<div className="mt-2 text-xs space-y-1">
					<p className="font-medium">Chi tiết công việc:</p>
					<p>Mô tả: {metadata.d}</p>
					<p>Nông dân: {metadata.f.n} (ID: {metadata.f.id})</p>

					{metadata.ft && metadata.ft.length > 0 && (
						<div>
							<p className="font-medium">Phân bón:</p>
							<ul className="list-inside list-disc">
								{metadata.ft.map((f, i) => (
									<li key={i}>{f.n} - {f.q} {f.u}</li>
								))}
							</ul>
						</div>
					)}

					{metadata.p && metadata.p.length > 0 && (
						<div>
							<p className="font-medium">Thuốc trừ sâu:</p>
							<ul className="list-inside list-disc">
								{metadata.p.map((p, i) => (
									<li key={i}>{p.n} - {p.q} {p.u}</li>
								))}
							</ul>
						</div>
					)}

					{metadata.i && metadata.i.length > 0 && (
						<div>
							<p className="font-medium">Vật dụng:</p>
							<ul className="list-inside list-disc">
								{metadata.i.map((item, i) => (
									<li key={i}>{item.n} - {item.q} {item.u}</li>
								))}
							</ul>
						</div>
					)}

					<p className="text-gray-500">Thời gian: {new Date(metadata.t * 1000).toLocaleString()}</p>
				</div>
			);
		} catch (error) {
			console.error('Error parsing task data:', error);
			return <div className="text-red-500">Error displaying task data</div>;
		}
	}

	const formatInspectionDataHash = (data: string) => {
		try {
			const metadata = JSON.parse(data) as InspectionMetadata;
			return (
				<div className="mt-2 text-xs space-y-1">
					<p className="font-medium">Chi tiết kiểm định:</p>
					<p>Mô tả: {metadata.d}</p>
					<p>Người kiểm định: {metadata.i.n} (ID: {metadata.i.id})</p>

					<div>
						<p className="font-medium">Kết quả:</p>
						<ul className="list-inside list-disc">
							<li>Asen: {metadata.r.a} mg/kg</li>
							<li>E.coli: {metadata.r.e} CFU/g</li>
							<li>Nitrate: {metadata.r.n} mg/kg</li>
							<li>pH: {metadata.r.p}</li>
							<li>Chất hữu cơ: {metadata.r.o}%</li>
						</ul>
					</div>

					<div>
						<p className="font-medium">Thông tin mẫu:</p>
						<p>Số lượng mẫu: {metadata.s.n}</p>
						<p>Trọng lượng mẫu: {metadata.s.w} {metadata.s.u}</p>
					</div>

					<p className="text-gray-500">Thời gian: {new Date(metadata.t * 1000).toLocaleString()}</p>
				</div>
			);
		} catch (error) {
			console.error('Error parsing inspection data:', error);
			return <div className="text-red-500">Error displaying inspection data</div>;
		}
	}

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				Loading...
			</div>
		)
	}

	return (
		<div className='container mx-auto space-y-8 p-4'>
			{/* Add Milestone Section */}
			<MilestoneAdd onSubmit={loadBlockchainData} />

			{/* Plans Section */}
			<Card>
				<CardHeader>
					<CardTitle>Kế hoạch sản xuất</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{plans.map((plan, index) => (
							<Card key={index} className='p-4'>
								<h3 className='mb-2 font-bold'>{plan.planData.planName}</h3>
								<p className='text-sm'>Mã kế hoạch: {plan.planData.planId.toString()}</p>
								<p className='text-sm'>Mã cây trồng: {plan.planData.plantId.toString()}</p>
								<p className='text-sm'>Mã vụ mùa: {plan.planData.yieldId.toString()}</p>
								<p className='text-sm'>Mã chuyên gia: {plan.planData.expertId.toString()}</p>
								<p className='text-sm'>
									Ngày bắt đầu: {new Date(Number(plan.planData.startDate) * 1000).toLocaleDateString()}
								</p>
								<p className='text-sm'>
									Ngày kết thúc: {new Date(Number(plan.planData.endDate) * 1000).toLocaleDateString()}
								</p>
								<p className='text-sm'>
									Sản lượng dự kiến: {plan.planData.estimatedProduct.toString()} {plan.planData.estimatedUnit}
								</p>
								<p className='text-sm'>Trạng thái: {plan.planData.status}</p>

								{plan.taskList.length > 0 && (
									<div className='mt-4'>
										<h4 className='font-semibold'>Công việc:</h4>
										<ul className='list-inside list-disc text-sm'>
											{plan.taskList.map((task, i) => (
												<li key={i} className="mb-4">
													<div>
														<span className="font-medium">{task.taskType}</span> -
														<span className={task.status === "Hoàn thành" ? "text-green-600" :
															task.status === "Đang thực hiện" ? "text-yellow-600" :
																"text-gray-600"}>
															{" "}{task.status}
														</span>
														<span className="text-gray-500 text-xs ml-2">
															({new Date(Number(task.timestamp) * 1000).toLocaleDateString()})
														</span>
													</div>
													<div className="mt-1">
														{formatTaskDataHash(task.data)}
													</div>
												</li>
											))}
										</ul>
									</div>
								)}

								{plan.inspectionList.length > 0 && (
									<div className='mt-4'>
										<h4 className='font-semibold'>Kiểm định:</h4>
										<ul className='list-inside list-disc text-sm'>
											{plan.inspectionList.map((inspection, i) => (
												<li key={i} className="mb-4">
													<div>
														<span className="font-medium">
															Loại	{getInspectionTypeString(inspection.inspectionType)}
														</span>
														<span className="text-gray-500 text-xs ml-2">
															({new Date(Number(inspection.timestamp) * 1000).toLocaleDateString()})
														</span>
													</div>
													<div className="mt-1">
														{formatInspectionDataHash(inspection.data)}
													</div>
												</li>
											))}
										</ul>
									</div>
								)}
							</Card>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default BlockchainDataDisplay
