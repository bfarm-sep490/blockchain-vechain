import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying TradeManagement with account:", deployer);

  await deploy("TradeManagement", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  console.log("TradeManagement deployed");
};

func.tags = ["TradeManagement"];
export default func;