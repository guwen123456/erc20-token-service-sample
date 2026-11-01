const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "chainId:", network.chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("Deployer native balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  const Factory = await ethers.getContractFactory("DemoToken");
  const token = await Factory.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("DemoToken deployed to:", address);
  console.log("Name:", await token.name(), "| Symbol:", await token.symbol());
  console.log("Total supply:", ethers.formatEther(await token.totalSupply()), "DEMO");
  console.log("Owner:", await token.owner());
  console.log("Deployer token balance:", ethers.formatEther(await token.balanceOf(deployer.address)), "DEMO");
}

main().catch((e) => { console.error(e); process.exit(1); });
