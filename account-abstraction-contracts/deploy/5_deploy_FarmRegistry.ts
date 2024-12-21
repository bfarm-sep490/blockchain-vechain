import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deployFarmRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts()

  const productRegistry = await hre.deployments.get('ProductRegistry')
  const ret = await hre.deployments.deploy('FarmRegistry', {
    from: deployer,
    args: [productRegistry.address],
    log: true,
    gasLimit: 8000000,
    waitConfirmations: 1
  })
  
  console.log('==FarmRegistry addr=', ret.address)
}

deployFarmRegistry.tags = ['FarmRegistry']
deployFarmRegistry.dependencies = ['ProductRegistry'] 
export default deployFarmRegistry