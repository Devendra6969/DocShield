/**
 * ==================================================================================
 * DocShield App.js - Main Application Logic (Updated for Modern Contract)
 * ==================================================================================
 * This file handles all interactions with MetaMask, IPFS (via Infura),
 * and the updated DocumentRegistry smart contract.
 *
 * It has been updated to use the new ABI and function names (e.g., addDocument).
 * ==================================================================================
 */

// Your IPFS API key and secret for Infura
// WARNING: Exposing your project secret in frontend code is a major security risk.
const projectId = "28LuNAotbXzcvtpOcE9F8ayKOeP";
const projectSecret = "3de3d9c099c6c0c168e39b8bc03e2f7a";

window.CONTRACT = {
  // Your Deployed Contract Address on the Sepolia Testnet
  address: "0xaEA7b263150CEd7C72225503624BCB916281ac49",
  network: "Sepolia Testnet",
  explore: "https://sepolia.etherscan.io/",
  // Your Contract ABI (Application Binary Interface) - UPDATED
  abi: [
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_hash",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "_ipfsCid",
          type: "string",
        },
      ],
      name: "addDocument",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_exporterAddress",
          type: "address",
        },
        {
          internalType: "string",
          name: "_info",
          type: "string",
        },
      ],
      name: "addExporter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "docHash",
          type: "bytes32",
        },
      ],
      name: "DocumentAlreadyExists",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "docHash",
          type: "bytes32",
        },
      ],
      name: "DocumentNotFound",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "exporter",
          type: "address",
        },
      ],
      name: "ExporterAlreadyExists",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "exporter",
          type: "address",
        },
      ],
      name: "ExporterNotFound",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidAddress",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_exporterAddress",
          type: "address",
        },
      ],
      name: "removeExporter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_hash",
          type: "bytes32",
        },
      ],
      name: "revokeDocument",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "Unauthorized",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "exporter",
          type: "address",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "docHash",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "ipfsCid",
          type: "string",
        },
      ],
      name: "DocumentAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "revoker",
          type: "address",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "docHash",
          type: "bytes32",
        },
      ],
      name: "DocumentRevoked",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_exporterAddress",
          type: "address",
        },
        {
          internalType: "string",
          name: "_newInfo",
          type: "string",
        },
      ],
      name: "updateExporterInfo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "documentCount",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "exporterCount",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "exporters",
      outputs: [
        {
          internalType: "string",
          name: "info",
          type: "string",
        },
        {
          internalType: "bool",
          name: "isAuthorized",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_hash",
          type: "bytes32",
        },
      ],
      name: "findDocument",
      outputs: [
        {
          internalType: "uint256",
          name: "blockNum",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "issuer",
          type: "string",
        },
        {
          internalType: "string",
          name: "ipfsCid",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_exporterAddress",
          type: "address",
        },
      ],
      name: "getExporterInfo",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};

// Connects to user's MetaMask wallet
async function connect() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) {
        console.warn("No account selected by user.");
        return;
      }
      window.userAddress = accounts[0];
      console.log("Wallet connected:", window.userAddress);
      window.localStorage.setItem("userAddress", window.userAddress);
      window.location.reload(); // Reload to reflect the connected state everywhere
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      $("#note").html(
        `<h5 class="text-danger">Error connecting wallet: ${error.message}</h5>`
      );
    }
  } else {
    // Advise user to install MetaMask
    console.log("MetaMask not detected.");
    $("#metamaskAlert").removeClass("hidden");
    $("#loginButton").hide();
  }
}

// Disconnects the wallet and clears stored data
function disconnect() {
  console.log("Disconnecting wallet.");
  window.userAddress = null;
  window.localStorage.removeItem("userAddress");
  window.location.reload();
}

// Main function that runs when the page loads
window.onload = async () => {
  // Hide page loader
  $(".loader-wraper").fadeOut("slow");

  // Disable action buttons by default
  $("#upload_file_button").attr("disabled", true);
  $("#doc-file").attr("disabled", true);

  // Retrieve stored user address
  window.userAddress = window.localStorage.getItem("userAddress");

  if (window.ethereum) {
    // Initialize web3 and contract instance using MetaMask's provider
    window.web3 = new Web3(window.ethereum);
    try {
      window.contract = new window.web3.eth.Contract(
        window.CONTRACT.abi,
        window.CONTRACT.address
      );
      console.log("Contract initialized successfully.");
    } catch (error) {
      console.error(
        "CRITICAL: Failed to initialize contract. Check ABI and address.",
        error
      );
      $("#note").html(
        `<h5 class="text-danger">Error: Could not initialize smart contract. Please check console.</h5>`
      );
      return;
    }

    // Check if user was previously connected
    if (window.userAddress && window.userAddress.length > 10) {
      console.log("User previously connected:", window.userAddress);
      $("#logoutButton").show();
      $("#loginButton").hide();

      // Enable file input now that user is connected
      $("#doc-file").attr("disabled", false);

      // Display user's address
      $("#userAddress").html(
        `Address: <span class="font-semibold text-gray-600">${truncateAddress(
          window.userAddress
        )}</span>`
      );

      // Fetch and display blockchain data
      await get_ChainID();
      await get_ethBalance();
      await getExporterInfo();

      if (window.location.pathname.endsWith("admin.html")) {
        await getCounters();
      }
      if (window.location.pathname.endsWith("upload.html")) {
        listen(); // Fetch recent transactions
      }
      if (window.location.pathname.endsWith("verify.html")) {
        checkURL(); // Check for hash in URL to auto-verify
      }
    } else {
      // User is not logged in
      console.log("User not connected.");
      $("#logoutButton").hide();
      $("#loginButton").show();
    }
  } else {
    // MetaMask is not installed
    console.log("MetaMask not detected on page load.");
    $("#metamaskAlert").removeClass("hidden");
    $("#loginButton").hide();
    $("#logoutButton").hide();
  }
};

// Set up listeners for MetaMask account or network changes
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    console.log("MetaMask account changed. Reloading...");
    window.location.reload();
  });

  window.ethereum.on("chainChanged", (chainId) => {
    console.log("MetaMask network changed. Reloading...");
    window.location.reload();
  });
}

// Calculates Sha3 (keccak256) hash of the selected file
async function get_Sha3() {
  hide_txInfo();
  $("#note").html(
    `<h5 class="text-yellow-400">Hashing document... Please wait.</h5>`
  );
  $("#upload_file_button").attr("disabled", true);
  window.hashedfile = null;

  const fileInput = document.getElementById("doc-file");
  if (!fileInput.files.length) {
    $("#note").html(
      `<h5 class="text-red-400">Please select a file first.</h5>`
    );
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = (event) => {
    try {
      const buffer = event.target.result;
      const dataBuffer = Buffer.from(buffer); // Convert ArrayBuffer to Buffer
      window.hashedfile = web3.utils.soliditySha3({
        type: "bytes",
        value: dataBuffer,
      });

      console.log(`Document Hash (keccak256): ${window.hashedfile}`);
      $("#note").html(
        `<h5 class="text-cyan-400">Document Hashed Successfully!</h5>`
      );
      $("#upload_file_button").attr("disabled", false); // Enable action button
    } catch (hashError) {
      console.error("Error hashing file:", hashError);
      $("#note").html(`<h5 class="text-red-400">Error hashing file.</h5>`);
    }
  };

  reader.onerror = (error) => {
    console.error("Error reading file:", error);
    $("#note").html(`<h5 class="text-red-400">Error reading file.</h5>`);
  };
}

// Uploads the selected file to IPFS via Infura
async function uploadFileToIpfs() {
  const fileInput = document.getElementById("doc-file");
  if (!fileInput.files.length) {
    throw new Error("No file selected for IPFS upload.");
  }
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  console.log("Attempting to upload to IPFS via Infura...");
  const auth = "Basic " + btoa(`${projectId}:${projectSecret}`);

  try {
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      method: "POST",
      body: formData,
      headers: { Authorization: auth },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("IPFS upload failed:", response.status, errorBody);
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ IPFS upload successful. CID:", data.Hash);
    return data.Hash; // Return the IPFS Content Identifier (CID)
  } catch (error) {
    console.error("Error during IPFS upload fetch:", error);
    throw error;
  }
}

// Main function to send the document hash and IPFS CID to the blockchain
async function sendHash() {
  if (!window.hashedfile) {
    $("#note").html(
      `<h5 class="text-yellow-400">Please select and hash a file first.</h5>`
    );
    return;
  }
  if (!window.contract || !window.userAddress) {
    $("#note").html(
      `<h5 class="text-red-400">Please connect your wallet first.</h5>`
    );
    return;
  }

  $("#loader").removeClass("hidden");
  $("#upload_file_button").slideUp();
  $("#note").html(
    `<h5 class="text-cyan-400">1/2: Uploading file to IPFS...</h5>`
  );
  $("#upload_file_button").attr("disabled", true);

  try {
    // Step 1: Upload file to IPFS and get the CID
    const CID = await uploadFileToIpfs();

    $("#note").html(
      `<h5 class="text-cyan-400">2/2: Awaiting transaction confirmation in MetaMask...</h5>`
    );

    // Step 2: Send transaction to the smart contract
    // UPDATED: from addDocHash to addDocument
    await window.contract.methods
      .addDocument(window.hashedfile, CID)
      .send({ from: window.userAddress })
      .on("transactionHash", (hash) => {
        console.log("Transaction Hash:", hash);
        $("#note").html(
          `<h5 class="text-cyan-400">Transaction submitted. Waiting for confirmation...</h5>`
        );
      })
      .on("receipt", (receipt) => {
        console.log("✅ Transaction Receipt:", receipt);
        printUploadInfo(receipt);
        generateQRCode();
      })
      .on("error", (error, receipt) => {
        console.error("❌ Blockchain transaction error:", error);
        $("#note").html(
          `<h5 class="text-red-400 text-center">Transaction Failed: ${error.message}</h5>`
        );
        if (receipt) console.error("Failed Transaction Receipt:", receipt);
        resetUploadUI();
      });
  } catch (error) {
    // Catch errors from IPFS upload or transaction initiation
    console.error("Error in sendHash process:", error);
    $("#note").html(
      `<h5 class="text-red-400 text-center">Error: ${error.message}</h5>`
    );
    resetUploadUI();
  }
}

// Verifies a document hash against the blockchain record
async function verify_Hash() {
  if (!window.hashedfile) {
    $("#note").html(
      `<h5 class="text-yellow-400">Please select a file to verify.</h5>`
    );
    return;
  }
  if (!window.contract) {
    $("#note").html(
      `<h5 class="text-red-400">Contract not initialized. Connect wallet.</h5>`
    );
    return;
  }

  console.log("Verifying hash:", window.hashedfile);
  $("#loader").show();
  $("#note").html(
    `<h5 class="text-cyan-400">Verifying document on the blockchain...</h5>`
  );
  $(".transaction-status").addClass("hidden");

  try {
    // UPDATED: from findDocHash to findDocument
    const result = await window.contract.methods
      .findDocument(window.hashedfile)
      .call();
    console.log("Verification result from contract:", result);

    // UPDATED: result[0] is now blockNum
    if (result && result.blockNum !== "0") {
      // Block number is a good indicator of existence
      print_verification_info(result, true);
    } else {
      print_verification_info(result, false);
    }
  } catch (error) {
    console.error("Error verifying hash:", error);
    $("#loader").hide();
    $("#note").html(
      `<h5 class="text-red-400">Error during verification: ${error.message}</h5>`
    );
    print_verification_info(null, false);
  }
}

// Deletes a document hash record from the contract
// UPDATED: Function name changed from deleteHash to revokeDocument
async function revokeDocument() {
  if (!window.hashedfile) {
    $("#note").html(
      `<h5 class="text-yellow-400">Please select the file you want to revoke.</h5>`
    );
    return;
  }
  if (!window.contract || !window.userAddress) {
    $("#note").html(
      `<h5 class="text-red-400">Please connect your wallet first.</h5>`
    );
    return;
  }

  $("#loader").removeClass("hidden");
  $("#upload_file_button").slideUp(); // Assumes the button ID is shared
  $("#note").html(
    `<h5 class="text-cyan-400">Awaiting revocation confirmation in MetaMask...</h5>`
  );
  $("#upload_file_button").attr("disabled", true);

  try {
    // UPDATED: from deleteHash to revokeDocument
    await window.contract.methods
      .revokeDocument(window.hashedfile)
      .send({ from: window.userAddress })
      .on("receipt", (receipt) => {
        console.log("✅ Revoke Receipt:", receipt);
        $("#note").html(
          `<h5 class="text-cyan-400">Document Record Revoked Successfully.</h5>`
        );
        $("#loader").addClass("hidden");
        $("#upload_file_button").slideDown().attr("disabled", false);
        $("#doc-file").val(""); // Clear file input
      })
      .on("error", (error) => {
        console.error("❌ Revoke transaction error:", error);
        $("#note").html(
          `<h5 class="text-red-400">Revocation Failed: ${error.message}</h5>`
        );
        $("#loader").addClass("hidden");
        $("#upload_file_button").slideDown().attr("disabled", false);
      });
  } catch (error) {
    console.error("Error initiating revoke transaction:", error);
    $("#note").html(`<h5 class="text-red-400">Error: ${error.message}</h5>`);
    $("#loader").addClass("hidden");
    $("#upload_file_button").slideDown().attr("disabled", false);
  }
}

// --- UI Display and Helper Functions ---

function resetUploadUI() {
  $("#loader").addClass("hidden");
  $("#upload_file_button").slideDown().attr("disabled", false);
}

function printUploadInfo(receipt) {
  $("#transaction-hash").html(
    `<a target="_blank" href="${window.CONTRACT.explore}/tx/${
      receipt.transactionHash
    }" class="text-cyan-400 break-all">${truncateAddress(
      receipt.transactionHash
    )}</a>`
  );
  $("#file-hash-info").html(
    `<span class="break-all">${truncateAddress(window.hashedfile)}</span>`
  );
  $("#contract-address-info").html(
    `<span class="break-all">${truncateAddress(receipt.to)}</span>`
  );
  $("#blockNumber-info").html(receipt.blockNumber);
  $("#gas-used-info").html(receipt.gasUsed);

  $("#loader").addClass("hidden");
  show_txInfo();
  get_ethBalance(); // Refresh balance
  $("#note").html(`<h5 class="text-cyan-400">Transaction Confirmed! ✅</h5>`);
  listen(); // Refresh recent transactions list
}

function print_verification_info(result, is_verified) {
  const docPreview = $("#student-document");
  const notValidImagePath = "../files/notvalid.svg";

  $("#loader").hide();
  $(".transaction-status").removeClass("hidden");

  if (is_verified) {
    $("#doc-status").html(
      `<h3 class="text-cyan-400">Certificate Verified Successfully 😊</h3>`
    );
    $("#file-hash").text(truncateAddress(window.hashedfile));
    $("#contract-address").text(truncateAddress(window.CONTRACT.address));
    // UPDATED: result[1] is now timestamp
    const timestampMs = parseInt(result.timestamp) * 1000;
    $("#time-stamps").text(new Date(timestampMs).toLocaleString());
    // UPDATED: result[0] is now blockNum
    $("#blockNumber").text(result.blockNum);
    // UPDATED: result[2] is now issuer
    $("#college-name").text(result.issuer);
    // UPDATED: result[3] is now ipfsCid
    const ipfsUrl = `https://ipfs.io/ipfs/${result.ipfsCid}`;
    docPreview.attr("src", ipfsUrl);
    $("#download-document").attr("href", ipfsUrl).removeClass("hidden");
  } else {
    $("#doc-status").html(
      `<h3 class="text-red-400">Certificate Not Verified 😕</h3>`
    );
    $("#file-hash").text(truncateAddress(window.hashedfile || "N/A"));
    $("#contract-address, #time-stamps, #blockNumber, #college-name").text(
      "N/A"
    );
    docPreview.attr("src", notValidImagePath);
    $("#download-document").addClass("hidden");
  }
}

function checkURL() {
  const params = new URLSearchParams(window.location.search);
  const hashFromUrl = params.get("hash");
  if (hashFromUrl) {
    console.log("Hash found in URL:", hashFromUrl);
    window.hashedfile = hashFromUrl;
    // Need to wait for contract to be initialized by window.onload
    setTimeout(() => {
      if (window.contract) {
        verify_Hash();
      } else {
        $("#note").html(
          `<h5 class="text-yellow-400">Connect wallet to auto-verify hash.</h5>`
        );
      }
    }, 500);
  }
}

function hide_txInfo() {
  $(".transaction-status").addClass("hidden");
}

function show_txInfo() {
  $(".transaction-status").removeClass("hidden");
}

async function get_ethBalance() {
  if (window.web3 && window.userAddress) {
    const balanceWei = await window.web3.eth.getBalance(window.userAddress);
    const balanceEth = window.web3.utils.fromWei(balanceWei, "ether");
    $("#userBalance").html(
      `Balance: <span class="font-semibold text-gray-600">${parseFloat(
        balanceEth
      ).toFixed(4)} ETH</span>`
    );
  }
}

async function get_ChainID() {
  if (window.web3) {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    let networkName = `Unknown (ID: ${chainId})`;
    if (chainId === "0xaa36a7") networkName = "Sepolia Testnet"; // 11155111
    if (chainId === "0x1") networkName = "Ethereum Mainnet";
    $("#network").html(
      `Network: <span class="font-semibold text-gray-600">${networkName}</span>`
    );
  }
}

function truncateAddress(address) {
  if (!address || address.length < 15) return address;
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

// --- Admin Panel Functions ---

async function getCounters() {
  if (window.contract) {
    // UPDATED: from count_Exporters to exporterCount
    const exporterCount = await window.contract.methods.exporterCount().call();
    $("#num-exporters").html(
      `Total Exporters: <span class="font-semibold text-gray-600">${exporterCount}</span>`
    );
    // UPDATED: from count_hashes to documentCount
    const hashCount = await window.contract.methods.documentCount().call();
    $("#num-hashes").html(
      `Total Documents: <span class="font-semibold text-gray-600">${hashCount}</span>`
    );
  }
}

async function getExporterInfo() {
  if (window.contract && window.userAddress) {
    const info = await window.contract.methods
      .getExporterInfo(window.userAddress)
      .call();
    window.info = info || "Not an Exporter";
    $("#Exporter-info").html(
      `Info: <span class="font-semibold text-yellow-400">${window.info}</span>`
    );
  }
}

async function addExporter() {
  // UPDATED: from add_Exporter to addExporter
  performAdminAction("addExporter", "Exporter Added Successfully 😇");
}
async function editExporter() {
  // UPDATED: from alter_Exporter to updateExporterInfo
  performAdminAction("updateExporterInfo", "Exporter Updated Successfully 😊");
}
async function deleteExporter() {
  const address = $("#Exporter-address").val();
  if (!address) {
    $("#note").html(
      `<h5 class="text-yellow-400">Exporter Address is required.</h5>`
    );
    return;
  }
  // UPDATED: from delete_Exporter to removeExporter
  performAdminAction("removeExporter", "Exporter Deleted Successfully 🙂", [
    address,
  ]);
}

async function performAdminAction(methodName, successMessage, extraArgs = []) {
  const address = $("#Exporter-address").val();
  const info = $("#info").val();

  // UPDATED: Logic updated for new function names
  const args =
    methodName === "updateExporterInfo"
      ? [address, info]
      : methodName === "addExporter"
      ? [address, info]
      : [...extraArgs];

  if (!address || (args.length > 1 && !info)) {
    $("#note").html(
      `<h5 class="text-yellow-400">Please fill all required fields.</h5>`
    );
    return;
  }
  if (!web3.utils.isAddress(address)) {
    $("#note").html(`<h5 class="text-red-400">Invalid Ethereum address.</h5>`);
    return;
  }

  $("#loader").removeClass("hidden");
  $("#ExporterBtn, #edit, #delete").prop("disabled", true);
  $("#note").html(
    `<h5 class="text-cyan-400">Awaiting transaction confirmation...</h5>`
  );

  try {
    await window.contract.methods[methodName](...args)
      .send({ from: window.userAddress })
      .on("receipt", (receipt) => {
        console.log(`✅ ${methodName} Receipt:`, receipt);
        $("#note").html(`<h5 class="text-cyan-400">${successMessage}</h5>`);
        $("#Exporter-address, #info").val(""); // Clear inputs
        getCounters(); // Refresh stats
      })
      .on("error", (error) => {
        console.error(`❌ ${methodName} Error:`, error);
        $("#note").html(
          `<h5 class="text-red-400">Action Failed: ${error.message}</h5>`
        );
      });
  } catch (error) {
    console.error(`Error initiating ${methodName}:`, error);
    $("#note").html(`<h5 class="text-red-400">Error: ${error.message}</h5>`);
  } finally {
    $("#loader").addClass("hidden");
    $("#ExporterBtn, #edit, #delete").prop("disabled", false);
  }
}

// --- Event Listening and Display for Recent Transactions ---

async function listen() {
  if (
    !window.contract ||
    !window.userAddress ||
    !window.location.pathname.endsWith("upload.html")
  ) {
    return;
  }

  console.log(
    "Listening for past 'DocumentAdded' events for user:", // UPDATED
    window.userAddress
  );
  $(".loading-tx").removeClass("d-none");
  const transactionsContainer = $(".transactions");
  transactionsContainer.html("");

  try {
    // UPDATED: from addHash to DocumentAdded
    const events = await window.contract.getPastEvents("DocumentAdded", {
      filter: { exporter: window.userAddress },
      fromBlock: 0,
      toBlock: "latest",
    });

    console.log(`Found ${events.length} past events.`);
    printTransactions(events);
  } catch (error) {
    console.error("Error fetching past events:", error);
    transactionsContainer.html(
      `<p class="text-red-400 text-center">Error loading past transactions.</p>`
    );
  } finally {
    $(".loading-tx").addClass("d-none");
  }
}

function printTransactions(events) {
  const container = $(".transactions");
  $("#recent-header").toggle(events.length > 0);
  container.html(""); // Clear previous

  // Sort by most recent first
  events.sort((a, b) => b.blockNumber - a.blockNumber);

  events.forEach((event) => {
    const { transactionHash, returnValues } = event;
    // UPDATED: from _ipfsHash to ipfsCid
    const ipfsCID = returnValues.ipfsCid;
    const txUrl = `${window.CONTRACT.explore}/tx/${transactionHash}`;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsCID}`;

    // Create a card for each transaction
    const cardHtml = `
      <a href="${txUrl}" target="_blank" rel="noopener noreferrer" title="View Transaction" class="block border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-200 bg-gray-800">
        <object data="${ipfsUrl}" type="image/svg+xml" class="w-full h-48 object-contain bg-gray-700">
          <p class="text-xs text-gray-400 p-2 text-center">Preview for ${truncateAddress(
            ipfsCID
          )}</p>
        </object>
      </a>
    `;
    container.append(cardHtml);
  });
}

// --- QR Code Generation (Requires a QR Code library like qrcode.min.js) ---

function generateQRCode() {
  const qrCodeElement = document.getElementById("qrcode");
  if (!qrCodeElement || typeof QRCode === "undefined") {
    console.warn(
      "QRCode element or library not found. Skipping QR code generation."
    );
    return;
  }
  qrCodeElement.innerHTML = ""; // Clear previous QR code

  if (!window.hashedfile) return;

  // Construct the verification URL
  const verifyPagePath = "verify.html";
  const url = `${window.location.origin}${window.location.pathname.substring(
    0,
    window.location.pathname.lastIndexOf("/")
  )}/${verifyPagePath}?hash=${window.hashedfile}`;

  console.log("Generating QR Code for URL:", url);

  new QRCode(qrCodeElement, {
    text: url,
    width: 128,
    height: 128,
    correctLevel: QRCode.CorrectLevel.H,
  });

  // Show download/verify links
  $("#download-link, #verfiy").show();
  $("#verfiy").attr("href", url);

  // Set up download link for the QR image
  setTimeout(() => {
    const qrImage = qrCodeElement.querySelector("img");
    if (qrImage) {
      $("#download-link")
        .attr("href", qrImage.src)
        .attr("download", `DocShield-QR.png`);
    }
  }, 500);
}
