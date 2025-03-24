import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useVeChainAccount } from '@/lib/useVeChainAccount'
import { clauseBuilder, FunctionFragment } from '@vechain/sdk-core'

interface Plan {
  id: bigint
  plant_id: bigint
  yield_id: bigint
  expert_id: bigint
  plan_name: string
  start_date: bigint
  end_date: bigint
  status: string
  estimated_product: bigint
  qr_code: string
  is_approved: boolean
  caring_task_count: bigint
  harvesting_task_count: bigint
  packaging_task_count: bigint
}

interface Order {
  id: bigint
  retailer_id: bigint
  plan_id: bigint
  packaging_type_id: bigint
  deposit_price: bigint
  status: string
  estimated_pickup_date: bigint
}

interface Inspection {
  id: bigint
  plan_id: bigint
  inspector_id: bigint
  start_date: bigint
  end_date: bigint
  can_harvest: boolean
  evaluated_result: string
  images: string[]
}

const PlanDataDisplay = () => {
  const [plans, setPlans] = useState<Plan[]>([])
  console.log("🚀 ~ PlanDataDisplay ~ plans:", plans)
  const [orders, setOrders] = useState<Order[]>([])
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const { thor, address } = useVeChainAccount()

  const PLAN_MANAGEMENT_ADDRESS = '0x29C4A96225D5AFD91D0FA44973e933eaf1cFcE91'
  const TRADE_MANAGEMENT_ADDRESS = '0xaEe4CF2EFE96634000A2B2d10b8BB7E00fA66a5B'

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
				if (!thor || !address) {
          console.log('Thor hoặc địa chỉ chưa sẵn sàng')
          return
        }

        // Lấy số lượng kế hoạch
        const planCountResult = await thor.contracts.executeCall(
          PLAN_MANAGEMENT_ADDRESS,
          'function nextPlanId() view returns (uint256)' as unknown as FunctionFragment,
          []
        )
        const planCount = Number(planCountResult[0])

        // Tải thông tin kế hoạch
        const planPromises = []
        for (let i = 1; i < planCount; i++) {
          const promise = thor.contracts.executeCall(
            PLAN_MANAGEMENT_ADDRESS,
            'function getPlan(uint256) view returns (tuple(uint256 id, uint256 plant_id, uint256 yield_id, uint256 expert_id, string plan_name, uint256 start_date, uint256 end_date, string status, uint256 estimated_product, string qr_code, bool is_approved, uint256 caring_task_count, uint256 harvesting_task_count, uint256 packaging_task_count))' as unknown as FunctionFragment,
            [BigInt(i)]
          )
          planPromises.push(promise)
        }
        const planResults = await Promise.all(planPromises)
        setPlans(planResults.map((result) => result[0] as Plan))

        // Lấy số lượng đơn hàng
        const orderCountResult = await thor.contracts.executeCall(
          TRADE_MANAGEMENT_ADDRESS,
          'function nextOrderId() view returns (uint256)' as unknown as FunctionFragment,
          []
        )
        const orderCount = Number(orderCountResult[0])

        // Tải thông tin đơn hàng
        const orderPromises = []
        for (let i = 1; i < orderCount; i++) {
          const promise = thor.contracts.executeCall(
            TRADE_MANAGEMENT_ADDRESS,
            'function getOrder(uint256) view returns (tuple(uint256 id, uint256 retailer_id, uint256 plan_id, uint256 packaging_type_id, uint256 deposit_price, string status, uint256 estimated_pickup_date))' as unknown as FunctionFragment,
            [BigInt(i)]
          )
          orderPromises.push(promise)
        }
        const orderResults = await Promise.all(orderPromises)
        setOrders(orderResults.map((result) => result[0] as Order))

        // Lấy số lượng biểu mẫu kiểm tra
        const inspectionCountResult = await thor.contracts.executeCall(
          TRADE_MANAGEMENT_ADDRESS,
          'function nextInspectionId() view returns (uint256)' as unknown as FunctionFragment,
          []
        )
        const inspectionCount = Number(inspectionCountResult[0])

        // Tải thông tin biểu mẫu kiểm tra
        const inspectionPromises = []
        for (let i = 1; i < inspectionCount; i++) {
          const promise = thor.contracts.executeCall(
            TRADE_MANAGEMENT_ADDRESS,
            'function getInspection(uint256) view returns (tuple(uint256 id, uint256 plan_id, uint256 inspector_id, uint256 start_date, uint256 end_date, bool can_harvest, string evaluated_result, string[] images))' as unknown as FunctionFragment,
            [BigInt(i)]
          )
          inspectionPromises.push(promise)
        }
        const inspectionResults = await Promise.all(inspectionPromises)
        setInspections(inspectionResults.map((result) => result[0] as Inspection))

        setLoading(false)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu blockchain:', error)
        setLoading(false)
      }
    }

    loadBlockchainData()
  }, [thor, address])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        Đang tải...
      </div>
    )
  }

  return (
    <div className='container mx-auto space-y-8 p-4'>
      {/* Phần Kế hoạch */}
      <Card>
        <CardHeader>
          <CardTitle>Kế hoạch sản xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {plans.map((plan) => (
              <Card key={Number(plan.id)} className='p-4'>
                <h3 className='mb-2 font-bold'>{plan.plan_name}</h3>
                <p className='text-sm'>ID: {plan.id.toString()}</p>
                <p className='text-sm'>Trạng thái: {plan.status}</p>
                <p className='text-sm'>
                  Thời gian: {new Date(Number(plan.start_date) * 1000).toLocaleDateString()} -{' '}
                  {new Date(Number(plan.end_date) * 1000).toLocaleDateString()}
                </p>
                <p className='text-sm'>
                  Sản lượng ước tính: {plan.estimated_product.toString()} kg
                </p>
                <p className='text-sm'>QR Code: {plan.qr_code}</p>
                <p className='text-sm'>
                  Đã duyệt: {plan.is_approved ? 'Có' : 'Chưa'}
                </p>
                <div className='mt-2'>
                  <p className='text-sm font-semibold'>Số lượng công việc:</p>
                  <ul className='list-inside list-disc text-sm'>
                    <li>Chăm sóc: {plan.caring_task_count.toString()}</li>
                    <li>Thu hoạch: {plan.harvesting_task_count.toString()}</li>
                    <li>Đóng gói: {plan.packaging_task_count.toString()}</li>
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phần Đơn hàng */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {orders.map((order) => (
              <Card key={Number(order.id)} className='p-4'>
                <h3 className='mb-2 font-bold'>Đơn hàng #{order.id.toString()}</h3>
                <p className='text-sm'>Kế hoạch ID: {order.plan_id.toString()}</p>
                <p className='text-sm'>Trạng thái: {order.status}</p>
                <p className='text-sm'>
                  {/* Tiền đặt cọc: {ethers.formatEther(order.deposit_price)} VET */}
                </p>
                <p className='text-sm'>
                  Ngày nhận hàng dự kiến:{' '}
                  {new Date(Number(order.estimated_pickup_date) * 1000).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phần Biểu mẫu kiểm tra */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu mẫu kiểm tra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {inspections.map((inspection) => (
              <Card key={Number(inspection.id)} className='p-4'>
                <h3 className='mb-2 font-bold'>
                  Biểu mẫu kiểm tra #{inspection.id.toString()}
                </h3>
                <p className='text-sm'>Kế hoạch ID: {inspection.plan_id.toString()}</p>
                <p className='text-sm'>
                  Thời gian: {new Date(Number(inspection.start_date) * 1000).toLocaleDateString()} -{' '}
                  {new Date(Number(inspection.end_date) * 1000).toLocaleDateString()}
                </p>
                <p className='text-sm'>
                  Có thể thu hoạch: {inspection.can_harvest ? 'Có' : 'Không'}
                </p>
                {inspection.evaluated_result && (
                  <p className='text-sm'>Kết quả đánh giá: {inspection.evaluated_result}</p>
                )}
                {inspection.images.length > 0 && (
                  <div className='mt-2'>
                    <p className='text-sm font-semibold'>Hình ảnh:</p>
                    <div className='grid grid-cols-2 gap-2'>
                      {inspection.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Hình ảnh kiểm tra ${index + 1}`}
                          className='h-20 w-20 object-cover'
                        />
                      ))}
                    </div>
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

export default PlanDataDisplay
