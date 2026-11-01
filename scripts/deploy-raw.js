// Robust deploy: signs transactions locally and broadcasts raw txs with
// minimal RPC calls (works around slow/flaky RPC round-trips).
// Usage: node scripts/deploy-raw.js <rpcUrl>
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitReceipt(provider, hash, label) {
  for (let i = 0; i < 60; i++) {
    const rc = await provider.getTransactionReceipt(hash);
    if (rc) {
      console.log(label, "confirmed in block", rc.blockNumber, "status", rc.status);
      return rc;
    }
    await sleep(4000);
  }
  throw new Error("Timeout waiting for receipt: " + hash);
}

async function main() {
  const rpc = process.argv[2];
  const provider = new ethers.JsonRpcProvider(rpc);
  const walletData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", ".testnet-wallet.json"), "utf8")
  );
  const wallet = new ethers.Wallet(walletData.privateKey, provider);
  const chainId = (await provider.getNetwork()).chainId;
  console.log("chainId:", chainId.toString(), "deployer:", wallet.address);

  const gasPrice = BigInt(await provider.send("eth_gasPrice", []));
  console.log("gasPrice (wei):", gasPrice.toString());
  let nonce = await provider.getTransactionCount(wallet.address, "pending");
  console.log("start nonce:", nonce);

  const artifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "artifacts", "contracts", "DemoToken.sol", "DemoToken.json"),
      "utf8"
    )
  );
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // 1) Deploy
  const deployTxReq = await factory.getDeployTransaction();
  const predicted = ethers.getCreateAddress({ from: wallet.address, nonce });
  const signedDeploy = await wallet.signTransaction({
    ...deployTxReq, chainId, nonce, gasPrice, gasLimit: 6_000_000n, type: 0,
  });
  const deployHash = await provider.send("eth_sendRawTransaction", [signedDeploy]);
  console.log("deploy broadcast:", deployHash, "predicted address:", predicted);
  const deployRc = await waitReceipt(provider, deployHash, "deploy");
  const tokenAddress = deployRc.contractAddress || predicted;
  console.log("TOKEN_ADDRESS:", tokenAddress);
  nonce++;

  const token = new ethers.Contract(tokenAddress, artifact.abi, wallet);
  console.log("name:", await token.name(), "| symbol:", await token.symbol());
  console.log("totalSupply:", ethers.formatEther(await token.totalSupply()));
  console.log("owner:", await token.owner());

  // Helper to send a token call as legacy raw tx
  async function sendCall(data, label) {
    const gp = BigInt(await provider.send("eth_gasPrice", []));
    const signed = await wallet.signTransaction({
      to: tokenAddress, data, value: 0n, chainId, nonce, gasPrice: gp, gasLimit: 120_000n, type: 0,
    });
    const hash = await provider.send("eth_sendRawTransaction", [signed]);
    console.log(label, "broadcast:", hash);
    nonce++;
    return waitReceipt(provider, hash, label);
  }

  // 2) Transfer 1000 DEMO to a fresh receiver
  const receiver = ethers.Wallet.createRandom();
  const iface = new ethers.Interface(artifact.abi);
  await sendCall(iface.encodeFunctionData("transfer", [receiver.address, ethers.parseEther("1000")]), "transfer");
  console.log("receiver:", receiver.address, "balance:", ethers.formatEther(await token.balanceOf(receiver.address)));

  // 3) Burn 100 DEMO from deployer
  await sendCall(iface.encodeFunctionData("burn", [ethers.parseEther("100")]), "burn");
  console.log("totalSupply after burn:", ethers.formatEther(await token.totalSupply()));
  console.log("deployer DEMO balance:", ethers.formatEther(await token.balanceOf(wallet.address)));
  console.log("deployer native balance:", ethers.formatEther(await provider.getBalance(wallet.address)));
  console.log("DONE");
}

main().catch((e) => { console.error("ERR:", e.shortMessage || e.message); process.exit(1); });
