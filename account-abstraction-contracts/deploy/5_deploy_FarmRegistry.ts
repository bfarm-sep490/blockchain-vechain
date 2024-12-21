import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deployFarmRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts()
  const { deploy, get } = hre.deployments

  // Get ProductRegistry address
  const productRegistry = await get('ProductRegistry')
  console.log('ProductRegistry address:', productRegistry.address)

  console.log('Deploying FarmRegistry with account:', deployer)

  const farmRegistry = await deploy('FarmRegistry', {
    from: deployer,
    args: [productRegistry.address],
    log: true,
    waitConfirmations: 1,
  })

  console.log('FarmRegistry deployed to:', farmRegistry.address)
  // Remove return statement hoặc return void/boolean
}

deployFarmRegistry.tags = ['FarmRegistry']
deployFarmRegistry.dependencies = ['ProductRegistry']
export default deployFarmRegistry