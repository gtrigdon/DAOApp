// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [owner] = await hre.ethers.getSigners();
  const RigdonhouseFundRaiserDAOContractFactory = await hre.ethers.getContractFactory("RigdonhouseFundRaiserDAO");
  const RigdonhouseFundRaiserDAOContract = await RigdonhouseFundRaiserDAOContractFactory.deploy();
  await RigdonhouseFundRaiserDAOContract.deployed();

  console.log("RigdonhouseFundRaiserDAOContract deployed to:", RigdonhouseFundRaiserDAOContract.address);
  console.log("RigdonhouseFundRaiserDAOContract owner address:", owner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


//Open a new terminal and deploy the smart contract in the localhost network
//npx hardhat run scripts/deploy.js

//Open a new terminal and deploy the smart contract in the Rinkeby Test network
//npx hardhat run scripts/deploy.js --network rinkeby

//local host
//RigdonhouseFundRaiserDAOContract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
//RigdonhouseFundRaiserDAOContract owner address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

//PS C:\BlockChainDev\cadena\rigdonhouseDAO-smartcontract> npx hardhat run scripts/deploy.js --network rinkeby
//RigdonhouseFundRaiserDAOContract deployed to: 0x8a25c5D0c8ab0E29B37590EC05A19B8cc4e63CeB
//RigdonhouseFundRaiserDAOContract owner address: 0xEB3759F9539fB2DC1810b22eFfe3bA2c1e06e80E