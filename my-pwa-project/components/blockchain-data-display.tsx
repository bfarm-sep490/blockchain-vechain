import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useVeChainAccount } from '@/lib/useVeChainAccount'
import { clauseBuilder, FunctionFragment } from '@vechain/sdk-core'
import { ethers } from 'ethers'

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
	dataHash: string
}

interface InspectionMilestone {
	inspectionId: bigint
	timestamp: bigint
	inspectionType: number
	dataHash: string
}

interface TaskMetadata {
	description: string;
	farmerInfo: {
		farmerId: string;
		farmerName: string;
	};
	fertilizers?: Array<{
		fertilizerId: string;
		name: string;
		quantity: number;
		unit: string;
	}>;
	pesticides?: Array<{
		pesticideId: string;
		name: string;
		quantity: number;
		unit: string;
	}>;
	items?: Array<{
		itemId: string;
		name: string;
		quantity: number;
		unit: string;
	}>;
	web2Timestamp: number;
}

interface InspectionMetadata {
	description: string;
	inspectorInfo: {
		inspectorId: string;
		inspectorName: string;
	};
	results: Record<string, string | number>;
	sampleInfo: {
		numberOfSample: number;
		sampleWeight: number;
		unit: string;
	};
	web2Timestamp: number;
}

const BlockchainDataDisplay = () => {
	const [plans, setPlans] = useState<{
		planData: PlanData,
		taskList: TaskMilestone[],
		inspectionList: InspectionMilestone[]
	}[]>([])
	const [loading, setLoading] = useState(true)
	const { thor, address } = useVeChainAccount()

	const PLAN_MANAGEMENT_ADDRESS = '0x2f7c45c44e7b8c4b03b44215b754508d89d2440a'

	useEffect(() => {
		const loadBlockchainData = async () => {
			try {
				if (!thor || !address) {
					console.log('Thor or address not available yet')
					return
				}

				const planResult = await thor.contracts.executeCall(
					PLAN_MANAGEMENT_ADDRESS,
					'function getPlanInfo() view returns (tuple(uint256 planId, uint256 plantId, uint256 yieldId, uint256 expertId, string planName, uint256 startDate, uint256 endDate, uint256 estimatedProduct, string estimatedUnit, string status) planData, tuple(uint256 taskId, string taskType, uint256 timestamp, string status, bytes32 dataHash)[] taskList, tuple(uint256 inspectionId, uint256 timestamp, uint8 inspectionType, bytes32 dataHash)[] inspectionList)' as unknown as FunctionFragment,
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

		loadBlockchainData()
	}, [thor, address])

	const getInspectionTypeString = (type: number) => {
		const typeMap = [
			'Kiểm định chất lượng đất',
			'Kiểm định hạt giống',
			'Kiểm định sản phẩm'
		]
		return typeMap[Number(type)] || 'Không xác định'
	}

	const decodeDataHash = (dataHash: string) => {
		try {
			const bytes = ethers.getBytes(dataHash);

			const id = ethers.hexlify(bytes.slice(0, 32));

			const timestamp = ethers.toBigInt(ethers.hexlify(bytes.slice(32, 64)));

			const metadata = ethers.hexlify(bytes.slice(64));
			console.log("🚀 ~ decodeDataHash ~ metadata:", metadata)

			try {
				const metadataStr = ethers.toUtf8String(metadata);
				const metadataObj = JSON.parse(metadataStr);
				return {
					id,
					timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
					metadata: metadataObj
				};
			} catch (e) {
				return {
					id,
					timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
					metadata
				};
			}
		} catch (error) {
			console.error('Error decoding dataHash:', error);
			return null;
		}
	}

	const formatTaskDataHash = (dataHash: string) => {
		const decoded = decodeDataHash(dataHash);
		if (!decoded || !decoded.metadata) return dataHash;

		const metadata = decoded.metadata as TaskMetadata;
		return (
			<div className="mt-2 text-xs space-y-1">
				<p className="font-medium">Chi tiết công việc:</p>
				<p>Mô tả: {metadata.description}</p>
				<p>Nông dân: {metadata.farmerInfo.farmerName} (ID: {metadata.farmerInfo.farmerId})</p>

				{metadata.fertilizers && metadata.fertilizers.length > 0 && (
					<div>
						<p className="font-medium">Phân bón:</p>
						<ul className="list-inside list-disc">
							{metadata.fertilizers.map((f, i) => (
								<li key={i}>{f.name} - {f.quantity} {f.unit}</li>
							))}
						</ul>
					</div>
				)}

				{metadata.pesticides && metadata.pesticides.length > 0 && (
					<div>
						<p className="font-medium">Thuốc trừ sâu:</p>
						<ul className="list-inside list-disc">
							{metadata.pesticides.map((p, i) => (
								<li key={i}>{p.name} - {p.quantity} {p.unit}</li>
							))}
						</ul>
					</div>
				)}

				{metadata.items && metadata.items.length > 0 && (
					<div>
						<p className="font-medium">Vật dụng:</p>
						<ul className="list-inside list-disc">
							{metadata.items.map((item, i) => (
								<li key={i}>{item.name} - {item.quantity} {item.unit}</li>
							))}
						</ul>
					</div>
				)}

				<p className="text-gray-500">Thời gian Web2: {new Date(metadata.web2Timestamp * 1000).toLocaleString()}</p>
			</div>
		);
	}

	const formatInspectionDataHash = (dataHash: string) => {
		const decoded = decodeDataHash(dataHash);
		if (!decoded || !decoded.metadata) return dataHash;

		const metadata = decoded.metadata as InspectionMetadata;
		return (
			<div className="mt-2 text-xs space-y-1">
				<p className="font-medium">Chi tiết kiểm định:</p>
				<p>Mô tả: {metadata.description}</p>
				<p>Người kiểm định: {metadata.inspectorInfo.inspectorName} (ID: {metadata.inspectorInfo.inspectorId})</p>

				<div>
					<p className="font-medium">Kết quả:</p>
					<ul className="list-inside list-disc">
						{Object.entries(metadata.results).map(([key, value]) => (
							<li key={key}>{key}: {value}</li>
						))}
					</ul>
				</div>

				<div>
					<p className="font-medium">Thông tin mẫu:</p>
					<p>Số lượng mẫu: {metadata.sampleInfo.numberOfSample}</p>
					<p>Trọng lượng mẫu: {metadata.sampleInfo.sampleWeight} {metadata.sampleInfo.unit}</p>
				</div>

				<p className="text-gray-500">Thời gian Web2: {new Date(metadata.web2Timestamp * 1000).toLocaleString()}</p>
			</div>
		);
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
														{formatTaskDataHash(task.dataHash)}
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
															{getInspectionTypeString(inspection.inspectionType)}
														</span>
														<span className="text-gray-500 text-xs ml-2">
															({new Date(Number(inspection.timestamp) * 1000).toLocaleDateString()})
														</span>
													</div>
													<div className="mt-1">
														{formatInspectionDataHash(inspection.dataHash)}
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
