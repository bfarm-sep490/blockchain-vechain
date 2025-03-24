import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying PlanManagement with account:", deployer);

  await deploy("PlanManagement", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  console.log("PlanManagement deployed");
};

func.tags = ["PlanManagement"];
export default func; 