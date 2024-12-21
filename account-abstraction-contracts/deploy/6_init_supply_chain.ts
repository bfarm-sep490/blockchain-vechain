import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import type { FarmRegistry, ProductRegistry } from "../typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { owner } = await hre.getNamedAccounts();
  const { ethers } = hre;

  try {
    // Get deployed contracts with proper typing
    const farmRegistry = await ethers.getContract<FarmRegistry>(
      "FarmRegistry",
      owner
    );
    const productRegistry = await ethers.getContract<ProductRegistry>(
      "ProductRegistry",
      owner
    );

    console.log("Registering farm...");
    const farmTx = await farmRegistry.registerFarm(
      owner,
      "Nông Trại Xanh",
      "Đà Lạt, Lâm Đồng",
      ["VietGAP", "Organic", "GlobalGAP", "UTZ"],
    );
    await farmTx.wait();

    console.log("Creating product batch...");
    const productInfo = {
      farmId: 1n,
      productType: "Cà phê Arabica",
      quantity: 1000n,
      unit: "kg",
      harvestDate: BigInt(Math.floor(Date.now() / 1000)),
      certifications: ["Organic"] as string[],
      additionalInfo: "Canh tác hữu cơ, không thuốc trừ sâu",
      status: 0,
      supplyChainActors: [owner] as string[],
    };

    const productTx = await productRegistry.createProductBatch(productInfo);
    await productTx.wait();

    return true;
  } catch (error) {
    console.error("Error during initialization:", error);
    return false;
  }
};

func.id = "init_supply_chain";
func.tags = ["Init"];
func.dependencies = ["FarmRegistry", "ProductRegistry"];

export default func;
