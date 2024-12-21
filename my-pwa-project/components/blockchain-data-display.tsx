import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useVeChainAccount } from '@/lib/useVeChainAccount'
import { clauseBuilder, FunctionFragment } from '@vechain/sdk-core'

interface Farm {
	owner: string
	name: string
	location: string
	certifications: string[]
	isActive: boolean
}

interface Product {
	farmId: bigint
	productType: string
	quantity: bigint
	unit: string
	harvestDate: bigint
	certifications: string[]
	additionalInfo: string
	status: number
	supplyChainActors: string[]
}

const BlockchainDataDisplay = () => {
	// Sử dụng interfaces trong useState
	const [farms, setFarms] = useState<Farm[]>([])
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const { thor, address } = useVeChainAccount()

	// Contract addresses
	const FARM_REGISTRY_ADDRESS = '0xF170bd1C9c77173D8f64A1f8679834fB2B9Da2a0'
	const PRODUCT_REGISTRY_ADDRESS = '0xf82A60FdaF07B7D29895c65305f0fB4d2295ea79'

	useEffect(() => {
		const loadBlockchainData = async () => {
			try {
				if (!thor || !address) {
					console.log('Thor or address not available yet')
					return
				}

				// Get farm count
				const farmCountResult = await thor.contracts.executeCall(
					FARM_REGISTRY_ADDRESS,
					'function nextFarmId() view returns (uint256)' as unknown as FunctionFragment,
					[]
				)
				const farmCount = Number(farmCountResult[0])

				// Load farms
				const farmPromises = []
				for (let i = 1; i < farmCount; i++) {
					const promise = thor.contracts.executeCall(
						FARM_REGISTRY_ADDRESS,
						'function getFarmInfo(uint256) view returns (tuple(address owner, string name, string location, string[] certifications, bool isActive))' as unknown as FunctionFragment,
						[BigInt(i)]
					)
					farmPromises.push(promise)
				}
				const farmResults = await Promise.all(farmPromises)
				setFarms(farmResults.map((result) => result[0] as Farm))

				// Get product count
				const productCountResult = await thor.contracts.executeCall(
					PRODUCT_REGISTRY_ADDRESS,
					'function nextProductId() view returns (uint256)' as unknown as FunctionFragment,
					[]
				)
				const productCount = Number(productCountResult[0])

				// Load products
				const productPromises = []
				for (let i = 1; i < productCount; i++) {
					const promise = thor.contracts.executeCall(
						PRODUCT_REGISTRY_ADDRESS,
						'function getProductBatch(uint256) view returns (tuple(uint256 farmId, string productType, uint256 quantity, string unit, uint256 harvestDate, string[] certifications, string additionalInfo, uint8 status, address[] supplyChainActors))' as unknown as FunctionFragment,
						[BigInt(i)]
					)
					productPromises.push(promise)
				}
				const productResults = await Promise.all(productPromises)
				setProducts(productResults.map((result) => result[0] as Product))

				setLoading(false)
			} catch (error) {
				console.error('Error loading blockchain data:', error)
				setLoading(false)
			}
		}

		loadBlockchainData()
	}, [thor, address])

	const getStatusString = (status: number) => {
		const statusMap = [
			'Created',
			'InTransit',
			'AtDistributor',
			'AtRetailer',
			'Sold',
		]
		return statusMap[Number(status)] || 'Unknown'
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
			{/* Farms Section */}
			<Card>
				<CardHeader>
					<CardTitle>Registered Farms</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{farms.map((farm, index) => (
							<Card key={index} className='p-4'>
								<h3 className='mb-2 font-bold'>{farm.name}</h3>
								<p className='text-sm'>Location: {farm.location}</p>
								<p className='text-sm'>
									Owner: {farm.owner.slice(0, 6)}...{farm.owner.slice(-4)}
								</p>
								<p className='text-sm'>
									Status: {farm.isActive ? 'Active' : 'Inactive'}
								</p>
								{farm.certifications.length > 0 && (
									<div className='mt-2'>
										<p className='text-sm font-semibold'>Certifications:</p>
										<ul className='list-inside list-disc text-sm'>
											{farm.certifications.map((cert, i) => (
												<li key={i}>{cert}</li>
											))}
										</ul>
									</div>
								)}
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Products Section */}
			<Card>
				<CardHeader>
					<CardTitle>Product Batches</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{products.map((product, index) => (
							<Card key={index} className='p-4'>
								<h3 className='mb-2 font-bold'>{product.productType}</h3>
								<p className='text-sm'>Farm ID: {product.farmId.toString()}</p>
								<p className='text-sm'>
									Quantity: {product.quantity.toString()} {product.unit}
								</p>
								<p className='text-sm'>
									Status: {getStatusString(product.status)}
								</p>
								<p className='text-sm'>
									Harvest Date:{' '}
									{new Date(
										Number(product.harvestDate) * 1000
									).toLocaleDateString()}
								</p>
								{product.certifications.length > 0 && (
									<div className='mt-2'>
										<p className='text-sm font-semibold'>Certifications:</p>
										<ul className='list-inside list-disc text-sm'>
											{product.certifications.map((cert, i) => (
												<li key={i}>{cert}</li>
											))}
										</ul>
									</div>
								)}
								<p className='mt-2 text-sm'>
									Additional Info: {product.additionalInfo}
								</p>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default BlockchainDataDisplay
