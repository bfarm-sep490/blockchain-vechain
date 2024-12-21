import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deployProductRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts()

  const ret = await hre.deployments.deploy('ProductRegistry', {
    from: deployer,
    args: [],
    log: true,
    gasLimit: 8000000,
    waitConfirmations: 1
  })
  
  console.log('==ProductRegistry addr=', ret.address)
}

deployProductRegistry.tags = ['ProductRegistry']
export default deployProductRegistry