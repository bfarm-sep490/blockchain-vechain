import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deployProductRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts()
  const { deploy } = hre.deployments

  console.log('Deploying ProductRegistry with account:', deployer)

  const productRegistry = await deploy('ProductRegistry', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  })

  console.log('ProductRegistry deployed to:', productRegistry.address)
}

deployProductRegistry.tags = ['ProductRegistry']
export default deployProductRegistry