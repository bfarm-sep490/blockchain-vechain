import "@nomicfoundation/hardhat-toolbox";
import '@nomicfoundation/hardhat-ethers';
import '@vechain/sdk-hardhat-plugin';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@typechain/hardhat';
import 'dotenv/config';

if (!process.env.PRIVATE_KEY) {
  throw new Error('Please set your PRIVATE_KEY in a .env file or in your environment variables');
}

const accounts = [
  process.env.PRIVATE_KEY, // deployer
  process.env.DEPLOYER_PRIVATE_KEY ?? process.env.PRIVATE_KEY, // proxyOwner
  process.env.OWNER_PRIVATE_KEY ?? process.env.PRIVATE_KEY, // owner
];

// see https://github.com/wighawag/hardhat-deploy?tab=readme-ov-file#1-namedaccounts-ability-to-name-addresses
const namedAccounts = {
  deployer: { default: 0 },
  proxyOwner: { default: 1 },
  owner: { default: 2 },
};

const config = {
  solidity:{
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 128,
          },
          viaIR: false
        },
      }
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 10000000
    },
    vechain_testnet: {
      allowUnlimitedContractSize: true,
      url: "https://testnet.vechain.org",
      accounts,

      // optionally use fee delegation to let someone else pay the gas fees
      delegator: {
        delegatorUrl: "https://sponsor-testnet.vechain.energy/by/769"
      },
      enableDelegation: true,
      loggingEnabled: true,
    },
    vechain_mainnet: {
      url: "https://mainnet.vechain.org",
      accounts,
    },
  },
  namedAccounts,
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
    alwaysGenerateOverloads: false,
    dontOverrideCompile: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
    deployments: "./deployments",
  }
};

export default config;