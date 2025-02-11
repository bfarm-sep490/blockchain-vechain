import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deployPlanRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts()

  await hre.deployments.deploy('PlanRegistry', {
    from: deployer,
    args: [],
    log: true,
    gasLimit: 6e6,
  })
}

deployPlanRegistry.tags = ['PlanRegistry']
export default deployPlanRegistry
