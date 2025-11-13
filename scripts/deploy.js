const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying IdentityRegistry contract...");

  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();

  await identityRegistry.waitForDeployment();

  const contractAddress = await identityRegistry.getAddress();
  console.log("IdentityRegistry deployed to:", contractAddress);

  // Save contract address and ABI
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  // Save to a JSON file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Copy ABI to client and api
  const artifactPath = path.join(__dirname, "../artifacts/contracts/IdentityRegistry.sol/IdentityRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Save to API
  const apiDir = path.join(__dirname, "../api/contracts");
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(apiDir, "IdentityRegistry.json"),
    JSON.stringify({ abi: artifact.abi, address: contractAddress }, null, 2)
  );

  // Save to Client
  const clientDir = path.join(__dirname, "../client/src/contracts");
  if (!fs.existsSync(clientDir)) {
    fs.mkdirSync(clientDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(clientDir, "IdentityRegistry.json"),
    JSON.stringify({ abi: artifact.abi, address: contractAddress }, null, 2)
  );

  console.log("Contract ABI and address saved to api/contracts and client/src/contracts");

  // If deploying to testnet, wait for verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await identityRegistry.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
