// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Script, console, stdJson } from "forge-std/Script.sol";
import { ArcID } from "src/ArcId.contract.sol";

contract DeployArcID is Script {
  using stdJson for string;

  function run() external {
    // --- Load environment variables ---
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address verifier = vm.envAddress("VERIFIER_ADDRESS");
    address owner = vm.envAddress("OWNER_ADDRESS");

    console.log("Deploying ArcID...");
    console.log("Deployer:", vm.addr(deployerPrivateKey));
    console.log("Verifier:", verifier);
    console.log("Owner:", owner);

    // --- Start deployment broadcast ---
    vm.startBroadcast(deployerPrivateKey);
    ArcID arcid = new ArcID(verifier, owner);
    vm.stopBroadcast();

    address deployedAddress = address(arcid);
    console.log("ArcID deployed at:", deployedAddress);

    string memory path = string.concat(vm.projectRoot(), "/broadcast/arcid.json");
    console.log("Deployment saved to:", path);
  }
}

