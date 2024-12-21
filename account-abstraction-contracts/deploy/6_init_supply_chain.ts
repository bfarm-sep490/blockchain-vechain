import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { Contract } from 'ethers'

const initSupplyChain: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { owner } = await hre.getNamedAccounts()
    
    const farmRegistry = await hre.ethers.getContract('FarmRegistry') as Contract
    const productRegistry = await hre.ethers.getContract('ProductRegistry') as Contract

    console.log('Initializing supply chain contracts...')

    try {
        // Register farm with gas limit & delegator
        const farmTx = await farmRegistry.registerFarm(
            owner,
            "Nông Trại Ackerman",
            "Đà Lạt, Lâm Đồng",
            ["VietGAP", "Organic"],
            {
                gasLimit: 8000000,
                delegator: {
                    delegatorUrl: "https://sponsor-testnet.vechain.energy/by/769"
                }
            }
        )
        await farmTx.wait()
        console.log('Sample farm registered')

        // Create product batch with gas limit & delegator
        const productInfo = {
            farmId: 1,
            productType: "Cà Chua Cherry",
            quantity: 1000,
            unit: "kg",
            harvestDate: Math.floor(Date.now() / 1000),
            certifications: ["Organic"],
            additionalInfo: "Canh tác hữu cơ, không thuốc trừ sâu",
            status: 0,
            supplyChainActors: [owner]
        }
        
        const productTx = await productRegistry.createProductBatch(
            productInfo,
            {
                gasLimit: 8000000,
                delegator: {
                    delegatorUrl: "https://sponsor-testnet.vechain.energy/by/769"
                }
            }
        )
        await productTx.wait()
        console.log('Sample product batch created')

        // Get farm and product info
        const farmInfo = await farmRegistry.getFarmInfo(1)
        const productBatch = await productRegistry.getProductBatch(1)
        
        console.log('Farm Info:', farmInfo)
        console.log('Product Batch:', productBatch)
        
    } catch (error) {
        console.error('Error during initialization:', error)
        throw error
    }
}

initSupplyChain.tags = ['SupplyChain', 'Init']
initSupplyChain.dependencies = ['FarmRegistry', 'ProductRegistry']
export default initSupplyChain