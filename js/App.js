// REMOVED: Top-level web3 initialization - rely on window.ethereum from MetaMask

// import { Buffer } from "buffer";
// Your IPFS api key and secret for infura.io
// **IMPORTANT**: Ensure these are your correct and active Infura IPFS credentials!
const projectId = "28LuNAotbXzcvtpOcE9F8ayKOeP";
const projectSecret = "3de3d9c099c6c0c168e39b8bc03e2f7a"; // Be cautious about exposing secrets in frontend code

window.CONTRACT = {
  // Your Deployed Contract Address
  address: "0x3E4b34e1ef59C0f0f394D906FBd442120c745F0e",
  // Network name (informational, connection comes from MetaMask)
  network: "Sepolia Testnet", // Updated for clarity based on RPC URL used previously
  // Block Explorer URL - MUST match the network the contract is deployed on
  explore: "https://sepolia.etherscan.io/", // UPDATED for Sepolia
  // Your Contract ABI (Application Binary Interface)
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address", // FIXED: Removed stray 'ap' here
          name: "_exporter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_ipfsHash",
          type: "string",
        },
      ],
      name: "addHash",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "hash",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "_ipfs",
          type: "string",
        },
      ],
      name: "addDocHash",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_add",
          type: "address",
        },
        {
          internalType: "string",
          name: "_info",
          type: "string",
        },
      ],
      name: "add_Exporter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_add",
          type: "address",
        },
        {
          internalType: "string",
          name: "_newInfo",
          type: "string",
        },
      ],
      name: "alter_Exporter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "changeOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "count_Exporters",
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
      name: "count_hashes",
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
          internalType: "bytes32",
          name: "_hash",
          type: "bytes32",
        },
      ],
      name: "deleteHash",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_add",
          type: "address",
        },
      ],
      name: "delete_Exporter",
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
      name: "findDocHash",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
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
      inputs: [
        {
          internalType: "address",
          name: "_add",
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

//login function
async function connect() {
  if (window.ethereum) {
    try {
      // Request account access
      const selectedAccount = await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => {
          if (accounts.length === 0) {
            throw Error("No account selected 👍");
          }
          return accounts[0];
        })
        .catch((err) => {
          console.error("Error requesting accounts:", err);
          // Don't throw here, let the user try again maybe
          // Or display a message in the UI
          return null; // Indicate failure
        });

      if (!selectedAccount) {
        // Handle case where user closed MetaMask prompt or denied connection
        console.log("User did not select an account.");
        // You might want to update the UI to show 'Login' button again
        return;
      }

      window.userAddress = selectedAccount;
      console.log("Connected account:", selectedAccount);
      window.localStorage.setItem("userAddress", window.userAddress);
      window.location.reload(); // Reload to apply changes across the app state
    } catch (error) {
      console.error("Error connecting wallet:", error);
      // Display error to user in the UI (e.g., in the #note element)
      $("#note").html(
        `<h5 class="text-danger">Error connecting wallet: ${error.message}</h5>`
      );
      // Optionally disable buttons again if connection fails
      $("#upload_file_button").attr("disabled", true);
      $("#doc-file").attr("disabled", true);
    }
  } else {
    // MetaMask (or other EIP-1193 provider) not detected
    console.log("MetaMask not detected.");
    $("#upload_file_button").attr("disabled", true);
    $("#doc-file").attr("disabled", true);
    // Show The Warning for not detecting wallet (ensure '.alert' exists in HTML)
    try {
      const alertBox =
        document.querySelector("#metamaskAlert") ||
        document.querySelector(".alert"); // Try specific ID first
      if (alertBox) {
        alertBox.classList.remove("d-none"); // Or remove Tailwind 'hidden' class
      } else {
        console.warn("Alert box element not found for MetaMask warning.");
      }
    } catch (e) {
      console.error("Error showing MetaMask alert:", e);
    }
  }
}

// Runs when the page finishes loading
window.onload = async () => {
  // Specific logic for verify.html
  if (window.location.pathname.endsWith("verify.html")) {
    // More robust path check
    $("#loader").hide();
    $(".loader-wraper").fadeOut("slow");
    $("#upload_file_button").attr("disabled", true); // Verify button initially disabled
    checkURL(); // Check if hash is passed in URL
  } else {
    // Logic for other pages
    $(".loader-wraper").fadeOut("slow"); // Fade out loader on all pages
    $("#loginButton").hide(); // Assume logged out initially
    $("#recent-header").hide(); // Hide recent tx section
    hide_txInfo(); // Hide tx details box
    $("#upload_file_button").attr("disabled", true); // Action buttons disabled initially
  }

  // Get stored address
  window.userAddress = window.localStorage.getItem("userAddress");

  if (window.ethereum) {
    // Initialize web3 and contract using MetaMask's provider
    window.web3 = new Web3(window.ethereum);
    window.contract = new window.web3.eth.Contract(
      window.CONTRACT.abi,
      window.CONTRACT.address
    );

    // Check if user was previously logged in (address stored)
    if (
      window.userAddress &&
      window.userAddress !== "null" &&
      window.userAddress.length > 10
    ) {
      console.log("User previously connected:", window.userAddress);
      // Update UI for logged-in state
      $("#logoutButton").show();
      $("#loginButton").hide();

      // Display truncated address and block explorer link
      const userAddrElement = $("#userAddress");
      if (userAddrElement.length) {
        userAddrElement.html(`<i class="fa-solid fa-address-card mx-2 text-primary"></i>${truncateAddress(
          window.userAddress
        )}
               <a class="text-info" href="${window.CONTRACT.explore}/address/${
          window.userAddress
        }" target="_blank" rel="noopener noreferrer" title="View Address on Explorer"><i class="fa-solid fa-square-arrow-up-right text-warning"></i></a>`);
      } else {
        console.warn("Element with ID 'userAddress' not found.");
      }

      // Fetch and display blockchain data (needs error handling)
      try {
        await getExporterInfo(); // Get info associated with this address
        await get_ChainID(); // Get current network name
        await get_ethBalance(); // Get account balance

        // Display exporter info (if available)
        const exporterInfoElement = $("#Exporter-info");
        if (exporterInfoElement.length) {
          exporterInfoElement.html(
            `<i class="fa-solid fa-building-columns mx-2 text-warning"></i>${
              window.info || "N/A"
            }`
          );
        } else {
          console.warn("Element with ID 'Exporter-info' not found.");
        }

        // If on admin page, get contract counters
        if (window.location.pathname.endsWith("admin.html")) {
          await getCounters();
        }

        // If on upload page, start listening for past events
        if (window.location.pathname.endsWith("upload.html")) {
          setTimeout(() => {
            listen();
          }, 100); // Slight delay maybe needed
        }

        // Enable relevant buttons if user is connected (e.g., file input)
        $("#doc-file").attr("disabled", false); // Enable file input once connected
      } catch (error) {
        console.error("Error fetching initial data:", error);
        // Display error to user, e.g., in #note
        $("#note").html(
          `<h5 class="text-danger">Error fetching account data: ${error.message}</h5>`
        );
        // Consider calling disconnect() or disabling buttons if essential data fails
        disconnect(); // Log out user if essential info fails
      }
    } else {
      // User not logged in
      console.log("User not connected.");
      $("#logoutButton").hide();
      $("#loginButton").show();
      $("#upload_file_button").attr("disabled", true);
      $("#doc-file").attr("disabled", true);
      try {
        $(".box").addClass("d-none"); // Hide status boxes if relevant
        $(".loading-tx").addClass("d-none"); // Hide tx loader
      } catch (e) {
        console.warn("jQuery error hiding elements:", e);
      }
    }
  } else {
    // MetaMask not detected - handled by connect() function already, but repeat UI changes here
    console.log("MetaMask not detected on page load.");
    $("#logoutButton").hide();
    $("#loginButton").hide();
    $("#upload_file_button").attr("disabled", true);
    $("#doc-file").attr("disabled", true);
    try {
      $(".box").addClass("d-none");
      const alertBox =
        document.querySelector("#metamaskAlert") ||
        document.querySelector(".alert");
      if (alertBox) {
        alertBox.classList.remove("d-none"); // Or remove Tailwind 'hidden' class
      }
    } catch (e) {
      console.error("Error updating UI for no MetaMask:", e);
    }
  }
};

// Verify document hash against the blockchain
async function verify_Hash() {
  if (!window.hashedfile) {
    $("#note").html(
      `<h5 class="text-warning">Please select a file first.</h5>`
    );
    return;
  }
  if (!window.contract) {
    $("#note").html(
      `<h5 class="text-danger">Contract not initialized. Is MetaMask connected?</h5>`
    );
    return;
  }

  console.log("Verifying hash:", window.hashedfile);
  $("#loader").show(); // Show loader
  $("#note").html(
    `<h5 class="text-info">Verifying document on the blockchain...</h5>`
  );
  $(".transaction-status").addClass("d-none"); // Hide previous results

  try {
    // Call the contract's findDocHash function (read-only)
    const result = await window.contract.methods
      .findDocHash(window.hashedfile)
      .call({ from: window.userAddress }); // userAddress might be null if not connected, but call might still work for public data

    console.log("Verification result:", result);
    $(".transaction-status").removeClass("d-none"); // Show results box
    window.newHash = result; // Store result globally (consider better state management)

    // Check if block number and timestamp are valid (non-zero)
    if (
      result &&
      result[0] &&
      result[0] !== "0" &&
      result[1] &&
      result[1] !== "0"
    ) {
      // Doc Verified
      print_verification_info(result, true);
    } else {
      // Doc not Verified (or result structure unexpected)
      print_verification_info(result, false);
    }
  } catch (error) {
    console.error("Error verifying hash:", error);
    $("#loader").hide(); // Hide loader on error
    $("#note").html(
      `<h5 class="text-danger">Error during verification: ${error.message}</h5>`
    );
    print_verification_info(null, false); // Show not verified state on error
    $(".transaction-status").removeClass("d-none"); // Ensure box is visible to show error state
  }
}

// Check URL parameters for a hash to auto-verify
function checkURL() {
  try {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let hashFromUrl = url.searchParams.get("hash");

    if (hashFromUrl) {
      console.log("Hash found in URL:", hashFromUrl);
      window.hashedfile = hashFromUrl; // Set global variable
      // Automatically trigger verification if user is connected or contract allows public reads
      // Need to wait for window.onload to complete contract setup
      // Or check if contract is ready here
      if (window.contract) {
        verify_Hash();
      } else {
        // Wait a moment for onload to potentially finish
        setTimeout(() => {
          if (window.contract) {
            verify_Hash();
          } else {
            console.warn("Cannot auto-verify: Contract not ready.");
            $("#note").html(
              `<h5 class="text-warning">Connect wallet to verify hash from URL.</h5>`
            );
          }
        }, 500);
      }
    } else {
      console.log("No hash found in URL parameters.");
    }
  } catch (error) {
    console.error("Error parsing URL:", error);
  }
}

// Calculate Sha3 hash of the selected file
async function get_Sha3() {
  // Renamed from duplicate
  hide_txInfo(); // Hide previous transaction details
  $("#note").html(`<h5 class="text-warning">Hashing Your Document 😴...</h5>`);
  $("#upload_file_button").attr("disabled", true); // Disable action button until hashing is done
  window.hashedfile = null; // Reset hash

  const fileInput = document.getElementById("doc-file");
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    $("#note").html(`<h5 class="text-warning">No file selected.</h5>`);
    return false;
  }

  const file = fileInput.files[0];
  console.log("File selected:", file.name, file.size, file.type);

  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    // Use readAsArrayBuffer for reliable hashing, especially for non-text files
    reader.readAsArrayBuffer(file);

    reader.onload = async function (evt) {
      if (evt.target.readyState === FileReader.DONE) {
        try {
          const buffer = evt.target.result;
          // Convert ArrayBuffer to Buffer for web3.utils.soliditySha3
          const dataBuffer =
            buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;

          // Calculate hash using web3.js utility
          window.hashedfile = web3.utils.soliditySha3({
            type: "bytes",
            value: dataBuffer,
          });

          console.log(`Document Hash (keccak256): ${window.hashedfile}`);
          $("#note").html(
            `<h5 class="text-center text-info">Document Hashed 😎</h5>`
          );
          $("#upload_file_button").attr("disabled", false); // Re-enable action button
          resolve(window.hashedfile);
        } catch (hashError) {
          console.error("Error hashing file:", hashError);
          $("#note").html(
            `<h5 class="text-danger">Error hashing file: ${hashError.message}</h5>`
          );
          reject(hashError);
        }
      }
    };

    reader.onerror = function (evt) {
      console.error("Error reading file:", evt);
      $("#note").html(`<h5 class="text-danger">Error reading file.</h5>`);
      reject(new Error("Error reading file"));
    };
  });
}

// Display verification results in the UI
function print_verification_info(result, is_verified) {
  const docPreviewElement = document.getElementById("student-document");
  if (!docPreviewElement) {
    console.error("Element 'student-document' not found for preview.");
    return;
  }

  // **IMPORTANT**: Check if the 'files' directory is at the root or inside 'src'
  // Assuming 'files' is at the project root (sibling of 'src' and 'js')
  const notValidImagePath = "../files/notvalid.svg"; // Use '../' if HTML is in 'src'
  // If 'files' is inside 'src', use: const notValidImagePath = "./files/notvalid.svg";

  docPreviewElement.src = notValidImagePath; // Default image

  $("#loader").hide(); // Hide loader
  $("#download-document").hide(); // Hide download link initially

  // Update status text
  const docStatusElement = $("#doc-status");
  if (docStatusElement.length) {
    if (is_verified && result) {
      docStatusElement.html(`<h3 class="text-info">
             Certificate Verified Successfully 😊
             <i class="text-info fa fa-check-circle" aria-hidden="true"></i>
            </h3>`);
    } else {
      docStatusElement.html(`<h3 class="text-danger">
            Certificate not Verified 😕
             <i class="text-danger fa fa-times-circle" aria-hidden="true"></i>
            </h3>`);
    }
  } else {
    console.warn("Element '#doc-status' not found.");
  }

  // Display file hash (if available)
  const fileHashElement = $("#file-hash");
  if (fileHashElement.length) {
    fileHashElement.html(
      `<span class="text-info"><i class="fa-solid fa-hashtag"></i></span> ${
        window.hashedfile ? truncateAddress(window.hashedfile) : "N/A"
      }`
    );
  } else {
    console.warn("Element '#file-hash' not found.");
  }

  // Show/hide details based on verification status
  if (is_verified && result) {
    // Display details for verified document
    $("#download-document").show();
    $("#college-name").show();
    $("#contract-address").show();
    $("#time-stamps").show();
    $("#blockNumber").show();

    // Format timestamp
    let formattedTimestamp = "Invalid Date";
    try {
      // Solidity timestamp is usually in seconds, JS Date needs milliseconds
      const timestampMs = parseInt(result[1]) * 1000;
      if (!isNaN(timestampMs)) {
        var t = new Date(timestampMs);
        // Adjust for timezone if necessary - this example doesn't adjust
        // t.setHours(t.getHours() + 3); // Example timezone adjustment - REMOVED unless needed
        formattedTimestamp = t.toLocaleString(); // Use locale-specific format
      }
    } catch (e) {
      console.error("Error parsing timestamp:", e);
    }

    $("#college-name").html(
      `<span class="text-info"><i class="fa-solid fa-graduation-cap"></i></span> ${
        result[2] || "N/A"
      }` // Issuer info from contract
    );
    $("#contract-address").html(
      `<span class="text-info"><i class="fa-solid fa-file-contract"></i> </span>${truncateAddress(
        window.CONTRACT.address
      )}`
    );
    $("#time-stamps").html(
      `<span class="text-info"><i class="fa-solid fa-clock"></i> </span>${formattedTimestamp}`
    );
    $("#blockNumber").html(
      `<span class="text-info"><i class="fa-solid fa-cube"></i></span> ${
        result[0] || "N/A"
      }` // Block number from contract
    );

    // Set document preview and download link using IPFS CID from contract (result[3])
    const ipfsCID = result[3];
    if (ipfsCID) {
      const ipfsUrl = `https://ipfs.io/ipfs/${ipfsCID}`; // Standard public gateway
      docPreviewElement.src = ipfsUrl;
      document.getElementById("download-document").href = ipfsUrl;
    } else {
      console.warn("IPFS CID not found in verification result.");
      docPreviewElement.src = notValidImagePath; // Fallback if CID missing
      $("#download-document").hide();
    }
  } else {
    // Hide details for non-verified document
    $("#college-name").hide();
    $("#contract-address").hide();
    $("#time-stamps").hide();
    $("#blockNumber").hide();
  }

  // Ensure the result box is visible
  $(".transaction-status").removeClass("d-none");
}

// Hide the transaction details box
function hide_txInfo() {
  // Use try-catch if jQuery might not be loaded
  try {
    $(".transaction-status").addClass("d-none");
  } catch (e) {
    console.warn("jQuery error hiding tx info:", e);
  }
}

// Show the transaction details box
function show_txInfo() {
  try {
    $(".transaction-status").removeClass("d-none");
  } catch (e) {
    console.warn("jQuery error showing tx info:", e);
  }
}

// Get and display the user's native currency balance (ETH, MATIC, etc.)
async function get_ethBalance() {
  if (!window.web3 || !window.userAddress) {
    console.log("Web3 or userAddress not available for get_ethBalance");
    $("#userBalance").html("n/a");
    return;
  }

  try {
    const balanceWei = await window.web3.eth.getBalance(window.userAddress);
    const balanceEth = window.web3.utils.fromWei(balanceWei, "ether");
    $("#userBalance").html(
      "<i class='fa-brands fa-gg-circle mx-2 text-danger'></i>" +
        // Display more precision if needed, e.g., balanceEth.substring(0, 8)
        parseFloat(balanceEth).toFixed(4) + // Show 4 decimal places
        "" // Add currency symbol if desired (e.g., " ETH")
    );
  } catch (error) {
    console.error("Error getting balance:", error);
    $("#userBalance").html("n/a");
  }
}

// Set up listener for account changes in MetaMask
if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (accounts) {
    console.log("MetaMask account changed:", accounts);
    // Re-run connection logic if accounts change
    // Using connect() forces a reload, alternatively update UI directly
    connect();
  });

  // Listen for network changes
  window.ethereum.on("chainChanged", (chainId) => {
    console.log("MetaMask network changed to:", chainId);
    // Reload the page to reflect the new network and potentially different contract state
    window.location.reload();
  });
}

// Display information after a successful document upload transaction
function printUploadInfo(receipt) {
  if (!receipt) return;

  // Transaction Hash Link
  $("#transaction-hash").html(
    `<a target="_blank" title="View Transaction on Explorer" href="${window.CONTRACT.explore}/tx/${receipt.transactionHash}" class="text-info break-all">` + // Added class for better wrapping
      `<i class="fa fa-check-circle font-size-2 mx-1 text-white"></i>${truncateAddress(
        receipt.transactionHash
      )}</a>`
  );

  // File Hash
  $("#file-hash").html(
    `<i class="fa-solid fa-hashtag mx-1"></i> <span class="break-all">${truncateAddress(
      window.hashedfile
    )}</span>` // Added span for wrapping
  );

  // Contract Address
  $("#contract-address").html(
    `<i class="fa-solid fa-file-contract mx-1"></i> <span class="break-all">${truncateAddress(
      receipt.to
    )}</span>`
  );

  // Timestamp (using current time, blockchain time is harder to get reliably here)
  $("#time-stamps").html('<i class="fa-solid fa-clock mx-1"></i>' + getTime());

  // Block Number
  $("#blockNumber").html(
    `<i class="fa-solid fa-link mx-1"></i>${receipt.blockNumber}`
  );

  // Block Hash
  $("#blockHash").html(
    `<i class="fa-solid fa-shield mx-1"></i> <span class="break-all">${truncateAddress(
      receipt.blockHash
    )}</span>`
  );

  // Network Name (should be updated by get_ChainID already)
  $("#to-netowrk").html(
    `<i class="fa-solid fa-chart-network mx-1"></i> ${window.chainID || "N/A"}`
  );
  // $("#to-netowrk").hide(); // Why hide network? Keep it visible.

  // Gas Used
  $("#gas-used").html(
    `<i class="fa-solid fa-gas-pump mx-1"></i> ${receipt.gasUsed} Gwei` // Note: gasUsed is in gas units, not Gwei. Cost depends on gas price.
  );

  $("#loader").addClass("d-none"); // Hide loader
  $("#upload_file_button").slideDown(); // Show upload button again
  // $("#upload_file_button").addClass("d-block"); // This adds class, slideDown is animation
  $("#upload_file_button").attr("disabled", false); // Ensure button is enabled

  show_txInfo(); // Make sure the info box is visible
  get_ethBalance(); // Refresh balance after transaction

  $("#note").html(`<h5 class="text-info">
   Transaction Confirmed! 😊<i class="mx-2 text-info fa fa-check-circle" aria-hidden="true"></i>
   </h5>`);

  // Listen for past events again to update the recent transactions list
  if (window.location.pathname.endsWith("upload.html")) {
    listen();
  }
}

// --- PDFRest/Filebin related functions - appear unused, kept for reference ---
/*
async function getFilebinInfo(filebinUrl, filebinId) {
  // ... (original code) ...
  // This function seems intended to get info about a file stored elsewhere,
  // using the document hash as an identifier? Likely needs revision if used.
}

async function uploadFileToBin() {
    // Placeholder for uploading to a service like Filebin.io
    // This is not standard IPFS upload.
}
*/
// --- End PDFRest/Filebin ---

// Uploads the selected file to IPFS via Infura gateway
async function uploadFileToIpfs() {
  const fileInput = document.getElementById("doc-file");
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    console.error("No file selected for IPFS upload.");
    throw new Error("No file selected."); // Throw error to stop sendHash
  }
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  console.log("Uploading to IPFS via Infura...");
  // Authentication for Infura IPFS endpoint
  const auth = "Basic " + btoa(`${projectId}:${projectSecret}`);

  try {
    // Make POST request to Infura IPFS API
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: auth,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("IPFS upload failed:", response.status, errorBody);
      throw new Error(
        `IPFS upload failed: ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();
    console.log("IPFS upload successful. CID:", data["Hash"]);
    // Return the IPFS Content Identifier (CID)
    return data["Hash"];
  } catch (error) {
    console.error("Error during IPFS upload fetch:", error);
    throw error; // Re-throw the error to be caught by the calling function (sendHash)
  }
}

// Hash the file, upload to IPFS, and send transaction to the smart contract
async function sendHash() {
  if (!window.hashedfile) {
    $("#note").html(
      `<h5 class="text-warning">Please select and hash a file first.</h5>`
    );
    return;
  }
  if (!window.contract || !window.userAddress) {
    $("#note").html(
      `<h5 class="text-danger">Please connect your wallet first.</h5>`
    );
    return;
  }

  $("#loader").removeClass("d-none"); // Show loader
  $("#upload_file_button").slideUp(); // Hide button
  $("#note").html(
    `<h5 class="text-info">1/2: Uploading file to IPFS... Please wait.</h5>`
  );
  $("#upload_file_button").attr("disabled", true);

  try {
    // Step 1: Upload file to IPFS and get the CID
    const CID = await uploadFileToIpfs();
    if (!CID) {
      throw new Error("Failed to get IPFS CID."); // Should be caught by uploadFileToIpfs already
    }

    $("#note").html(
      `<h5 class="text-info">2/2: Please confirm the transaction in MetaMask 🙂</h5>`
    );

    // Step 2: Send transaction to the smart contract with the file hash and IPFS CID
    await window.contract.methods
      .addDocHash(window.hashedfile, CID) // Pass file hash and IPFS CID
      .send({ from: window.userAddress }) // Sender must be the connected user
      .on("transactionHash", function (_hash) {
        console.log("Transaction Hash:", _hash);
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Transaction submitted. Waiting for confirmation...</h5>`
        );
      })
      .on("receipt", function (receipt) {
        console.log("Transaction Receipt:", receipt);
        printUploadInfo(receipt); // Display transaction details
        generateQRCode(); // Generate QR code linking to verification page
      })
      .on("error", function (error, receipt) {
        // error callback might receive receipt if tx mined but failed
        console.error("Blockchain transaction error:", error);
        $("#note").html(
          `<h5 class="text-danger text-center">Transaction Failed: ${error.message}</h5>`
        );
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown().attr("disabled", false); // Show and enable button
        // If receipt exists, it means it was mined but reverted
        if (receipt) {
          console.error("Failed Transaction Receipt:", receipt);
        }
      });
  } catch (error) {
    // Catch errors from IPFS upload or transaction sending initiation
    console.error("Error in sendHash process:", error);
    $("#note").html(
      `<h5 class="text-danger text-center">Error: ${error.message}</h5>`
    );
    $("#loader").addClass("d-none");
    $("#upload_file_button").slideDown().attr("disabled", false); // Show and enable button
  }
}

// Delete a document hash from the contract
async function deleteHash() {
  if (!window.hashedfile) {
    $("#note").html(
      `<h5 class="text-warning">Please select the file you want to delete first.</h5>`
    );
    return;
  }
  if (!window.contract || !window.userAddress) {
    $("#note").html(
      `<h5 class="text-danger">Please connect your wallet first.</h5>`
    );
    return;
  }

  $("#loader").removeClass("d-none");
  $("#upload_file_button").slideUp(); // Assuming the button ID is reused, might need specific ID like #delete_file_button
  $("#note").html(
    `<h5 class="text-info">Please confirm the delete transaction in MetaMask 🙂</h5>`
  );
  $("#upload_file_button").attr("disabled", true);

  try {
    await window.contract.methods
      .deleteHash(window.hashedfile)
      .send({ from: window.userAddress })
      .on("transactionHash", function (hash) {
        console.log("Delete Transaction Hash:", hash);
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Delete transaction submitted. Waiting for confirmation... 😴</h5>`
        );
      })
      .on("receipt", function (receipt) {
        console.log("Delete Receipt:", receipt);
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Document Record Deleted Successfully 😳</h5>`
        );
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown().attr("disabled", false);
        // Clear the selected file hash after successful deletion?
        // window.hashedfile = null;
        // $("#doc-file").val(''); // Clear file input
      })
      .on("error", function (error, receipt) {
        console.error("Delete transaction error:", error);
        $("#note").html(
          `<h5 class="text-danger text-center">Deletion Failed: ${error.message}</h5>`
        );
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown().attr("disabled", false);
        if (receipt) {
          console.error("Failed Delete Receipt:", receipt);
        }
      });
  } catch (error) {
    console.error("Error initiating delete transaction:", error);
    $("#note").html(
      `<h5 class="text-danger text-center">Error initiating deletion: ${error.message}</h5>`
    );
    $("#loader").addClass("d-none");
    $("#upload_file_button").slideDown().attr("disabled", false);
  }
}

// Get current timestamp as a formatted string
function getTime() {
  try {
    let d = new Date();
    // Pad month and day with leading zeros if needed
    const pad = (num) => (num < 10 ? "0" + num : num);
    let formattedDate =
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    let formattedTime =
      pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    return `${formattedDate} ${formattedTime}`;
  } catch (e) {
    console.error("Error formatting time:", e);
    return "N/A";
  }
}

// Get the chain ID from MetaMask and update the network name display
async function get_ChainID() {
  if (!window.web3) {
    console.log("Web3 not available for get_ChainID");
    window.chainID = "N/A";
    updateNetworkDisplay(); // Update UI even if web3 missing
    return;
  }
  try {
    // Use eth_chainId for modern compatibility
    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    const chainIdDec = parseInt(chainIdHex, 16); // Convert hex to decimal
    console.log("Chain ID:", chainIdDec, `(0x${chainIdDec.toString(16)})`);

    switch (chainIdDec) {
      case 1:
        window.chainID = "Ethereum Mainnet";
        break;
      case 11155111:
        window.chainID = "Sepolia Testnet";
        break; // Sepolia ID
      case 80001:
        window.chainID = "Polygon Mumbai Testnet";
        break;
      case 137:
        window.chainID = "Polygon Mainnet";
        break;
      case 5:
        window.chainID = "Goerli Testnet";
        break; // Keep Goerli just in case
      // Add other networks if needed
      case 1337:
        window.chainID = "Localhost (Ganache/Hardhat)";
        break; // Common local ID
      default:
        window.chainID = `Unknown Network (ID: ${chainIdDec})`;
        break;
    }
  } catch (error) {
    console.error("Error getting chain ID:", error);
    window.chainID = "Error fetching Network";
  }
  updateNetworkDisplay();
}

// Helper function to update the network display element
function updateNetworkDisplay() {
  const networkElement = document.getElementById("network");
  if (networkElement) {
    networkElement.innerHTML = `<i class="text-info fa-solid fa-circle-nodes mx-2"></i>${
      window.chainID || "N/A"
    }`;
  } else {
    // console.warn("Element with ID 'network' not found for display.");
  }
}

// REMOVED: Duplicate get_Sha3 function definition was here

// Logout function
function disconnect() {
  console.log("Disconnecting wallet.");
  $("#logoutButton").hide();
  $("#loginButton").show();
  window.userAddress = null;
  window.localStorage.removeItem("userAddress"); // Clear stored address
  // Disable buttons and clear UI elements
  $("#upload_file_button").attr("disabled", true).addClass("disabled"); // Add disabled class too
  $("#doc-file").attr("disabled", true).val(""); // Disable and clear file input
  $("#userAddress").html("n/a"); // Clear address display
  $("#userBalance").html("n/a"); // Clear balance display
  $("#network").html("n/a"); // Clear network display
  $("#Exporter-info").html("n/a"); // Clear exporter info display
  hide_txInfo(); // Hide transaction details
  $(".box").addClass("d-none"); // Hide status boxes
  window.hashedfile = null; // Clear any hashed file state
  // Potentially reload or redirect if state is complex
  // window.location.reload(); // Use if simpler than resetting all UI state
}

// Truncate wallet address for display
function truncateAddress(address) {
  if (!address || typeof address !== "string" || address.length < 15) {
    return address || "N/A"; // Return original if too short or invalid
  }
  // Standard 0xABC...XYZ format
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

// --- Admin Functions ---

// Add a new Exporter (requires contract owner privileges)
async function addExporter() {
  const addressInput = document.getElementById("Exporter-address");
  const infoInput = document.getElementById("info");
  const address = addressInput ? addressInput.value : null;
  const info = infoInput ? infoInput.value : null;

  if (!info || !address) {
    $("#note").html(
      `<h5 class="text-center text-warning">Exporter Address and Information are required.</h5>`
    );
    return;
  }
  if (!window.web3.utils.isAddress(address)) {
    $("#note").html(
      `<h5 class="text-center text-warning">Invalid Ethereum address format.</h5>`
    );
    return;
  }
  if (!window.contract || !window.userAddress) {
    $("#note").html(
      `<h5 class="text-danger">Please connect your wallet first.</h5>`
    );
    return;
  }

  $("#loader").removeClass("d-none");
  $("#ExporterBtn, #edit, #delete").slideUp().attr("disabled", true); // Disable all buttons
  $("#note").html(
    `<h5 class="text-info">Please confirm the transaction in MetaMask 👍...</h5>`
  );

  try {
    await window.contract.methods
      .add_Exporter(address, info)
      .send({ from: window.userAddress })
      .on("transactionHash", function (hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Transaction submitted. Waiting confirmation... 😴</h5>`
        );
      })
      .on("receipt", function (receipt) {
        $("#loader").addClass("d-none");
        $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false); // Re-enable buttons
        console.log("Add Exporter Receipt:", receipt);
        $("#note").html(
          `<h5 class="text-info">Exporter Added Successfully 😇</h5>`
        );
        addressInput.value = ""; // Clear inputs on success
        infoInput.value = "";
        getCounters(); // Refresh counters
      })
      .on("error", function (error, receipt) {
        console.error("Add Exporter error:", error);
        $("#note").html(
          `<h5 class="text-danger text-center">Failed to Add Exporter: ${error.message}</h5>`
        );
        $("#loader").addClass("d-none");
        $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false);
        if (receipt) console.error("Failed Add Exporter Receipt:", receipt);
      });
  } catch (error) {
    console.error("Error initiating Add Exporter tx:", error);
    $("#note").html(
      `<h5 class="text-danger text-center">Error: ${error.message}</h5>`
    );
    $("#loader").addClass("d-none");
    $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false);
  }
}

// Get information associated with the connected user's address
async function getExporterInfo() {
  // Reset global info first
  window.info = "N/A";

  if (!window.contract || !window.userAddress) {
    console.log("Contract or userAddress not available for getExporterInfo");
    updateExporterInfoDisplay(); // Update UI with default
    return;
  }

  try {
    const result = await window.contract.methods
      .getExporterInfo(window.userAddress)
      .call({ from: window.userAddress }); // Specify 'from' even for calls if needed by node/contract logic
    window.info = result || "N/A"; // Use result or default if empty/null
    console.log("Exporter Info for", window.userAddress, ":", window.info);
  } catch (error) {
    console.error("Error getting exporter info:", error);
    window.info = "Error fetching info"; // Indicate error state
  }
  updateExporterInfoDisplay();
}

// Helper to update exporter info display
function updateExporterInfoDisplay() {
  const exporterInfoElement = $("#Exporter-info");
  if (exporterInfoElement.length) {
    exporterInfoElement.html(
      `<i class="fa-solid fa-building-columns mx-2 text-warning"></i>${
        window.info || "N/A"
      }`
    );
  }
}

// Get document and exporter counts from the contract
async function getCounters() {
  if (!window.contract || !window.userAddress) {
    // Need userAddress for 'from' in call
    console.log("Contract or userAddress not available for getCounters");
    $("#num-exporters").html("N/A");
    $("#num-hashes").html("N/A");
    return;
  }
  try {
    // Get Exporter Count
    const exporterCount = await window.contract.methods
      .count_Exporters()
      .call({ from: window.userAddress });
    $("#num-exporters").html(
      `<i class="fa-solid fa-building-columns mx-2 text-info"></i>${exporterCount}`
    );

    // Get Hashes Count
    const hashCount = await window.contract.methods
      .count_hashes()
      .call({ from: window.userAddress });
    $("#num-hashes").html(
      `<i class="fa-solid fa-file mx-2 text-warning"></i>${hashCount}`
    );
  } catch (error) {
    console.error("Error getting counters:", error);
    $("#num-exporters").html("Error");
    $("#num-hashes").html("Error");
  }
}

// Edit an existing Exporter's info (requires contract owner privileges)
async function editExporter() {
  const addressInput = document.getElementById("Exporter-address");
  const infoInput = document.getElementById("info");
  const address = addressInput ? addressInput.value : null;
  const info = infoInput ? infoInput.value : null;

  if (!info || !address) {
    $("#note").html(
      `<h5 class="text-center text-warning">Exporter Address and New Information are required.</h5>`
    );
    return;
  }
  if (!window.web3.utils.isAddress(address)) {
    $("#note").html(
      `<h5 class="text-center text-warning">Invalid Ethereum address format.</h5>`
    );
    return;
  }
  if (!window.contract || !window.userAddress) {
    $("#note").html(
      `<h5 class="text-danger">Please connect your wallet first.</h5>`
    );
    return;
  }

  $("#loader").removeClass("d-none");
  $("#ExporterBtn, #edit, #delete").slideUp().attr("disabled", true);
  $("#note").html(
    `<h5 class="text-info">Please confirm the update transaction in MetaMask 😴...</h5>`
  );

  try {
    await window.contract.methods
      .alter_Exporter(address, info)
      .send({ from: window.userAddress })
      .on("transactionHash", function (hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Update submitted. Waiting confirmation... 😇</h5>`
        );
      })
      .on("receipt", function (receipt) {
        $("#loader").addClass("d-none");
        $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false);
        console.log("Edit Exporter Receipt:", receipt);
        $("#note").html(
          `<h5 class="text-info">Exporter Updated Successfully 😊</h5>`
        );
        addressInput.value = ""; // Clear inputs
        infoInput.value = "";
        // Maybe refresh specific exporter info if needed, or rely on user refresh
      })
      .on("error", function (error, receipt) {
        console.error("Edit Exporter error:", error);
        $("#note").html(
          `<h5 class="text-danger text-center">Failed to Update Exporter: ${error.message}</h5>`
        );
        $("#loader").addClass("d-none");
        $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false);
        if (receipt) console.error("Failed Edit Exporter Receipt:", receipt);
      });
  } catch (error) {
    console.error("Error initiating Edit Exporter tx:", error);
    $("#note").html(
      `<h5 class="text-danger text-center">Error: ${error.message}</h5>`
    );
    $("#loader").addClass("d-none");
    $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false);
  }
}

// Delete an Exporter (requires contract owner privileges)
async function deleteExporter() {
  const addressInput = document.getElementById("Exporter-address");
  const address = addressInput ? addressInput.value : null;

  if (!address) {
    $("#note").html(
      `<h5 class="text-center text-warning">Exporter Address is required to delete.</h5>`
    );
    return;
  }
  if (!window.web3.utils.isAddress(address)) {
    $("#note").html(
      `<h5 class="text-center text-warning">Invalid Ethereum address format.</h5>`
    );
    return;
  }
  if (!window.contract || !window.userAddress) {
    $("#note").html(
      `<h5 class="text-danger">Please connect your wallet first.</h5>`
    );
    return;
  }

  $("#loader").removeClass("d-none");
  $("#ExporterBtn, #edit, #delete").slideUp().attr("disabled", true);
  $("#note").html(
    `<h5 class="text-info">Please confirm the delete transaction in MetaMask 😕...</h5>`
  );

  try {
    await window.contract.methods
      .delete_Exporter(address)
      .send({ from: window.userAddress })
      .on("transactionHash", function (hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Delete submitted. Waiting confirmation... 😴</h5>`
        );
      })
      .on("receipt", function (receipt) {
        $("#loader").addClass("d-none");
        $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false);
        console.log("Delete Exporter Receipt:", receipt);
        $("#note").html(
          `<h5 class="text-info">Exporter Deleted Successfully 🙂</h5>`
        );
        addressInput.value = ""; // Clear input
        getCounters(); // Refresh counters
      })
      .on("error", function (error, receipt) {
        console.error("Delete Exporter error:", error);
        $("#note").html(
          `<h5 class="text-danger text-center">Failed to Delete Exporter: ${error.message}</h5>`
        );
        $("#loader").addClass("d-none");
        $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false);
        if (receipt) console.error("Failed Delete Exporter Receipt:", receipt);
      });
  } catch (error) {
    console.error("Error initiating Delete Exporter tx:", error);
    $("#note").html(
      `<h5 class="text-danger text-center">Error: ${error.message}</h5>`
    );
    $("#loader").addClass("d-none");
    $("#ExporterBtn, #edit, #delete").slideDown().attr("disabled", false);
  }
}

// Generate QR code linking to the verification page with the current document hash
function generateQRCode() {
  const qrCodeElement = document.getElementById("qrcode");
  const downloadLink = document.getElementById("download-link");
  const verifyLink = document.getElementById("verfiy"); // Note the typo in original ID 'verfiy'
  const fileInput = document.getElementById("doc-file");

  if (!qrCodeElement) {
    console.error("Element with ID 'qrcode' not found.");
    return;
  }
  // Clear previous QR code
  qrCodeElement.innerHTML = "";

  if (!window.hashedfile) {
    console.log("No hashed file available for QR code generation.");
    // Optionally hide QR code related elements
    if (downloadLink) downloadLink.style.display = "none";
    if (verifyLink) verifyLink.style.display = "none";
    return;
  }

  console.log("Generating QR code for hash:", window.hashedfile);

  try {
    var qrcode = new QRCode(qrCodeElement, {
      text: "", // Will be set by makeCode
      width: 128, // Standard size, adjust as needed
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H, // High error correction
    });

    // Construct the verification URL
    // Use relative path for verify.html if it's in the same directory (src/)
    // If index.html is also in src/, this works.
    // If structure differs, adjust the path `/src/verify.html` or similar.
    const verifyPagePath = "verify.html"; // Assumes verify.html is relative to current page (e.g., both in src/)
    let url = `${window.location.protocol}//${
      window.location.host
    }${window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/")
    )}/${verifyPagePath}?hash=${window.hashedfile}`;
    // Simpler relative approach if both HTML files are in src/:
    // let url = `verify.html?hash=${window.hashedfile}`;

    console.log("QR Code URL:", url);
    qrcode.makeCode(url); // Generate the QR code with the URL

    // Set up download link for the QR code image
    if (downloadLink) {
      downloadLink.style.display = "inline-block"; // Make visible
      let qrImage = qrCodeElement.querySelector("img");
      if (qrImage && qrImage.src) {
        downloadLink.href = qrImage.src;
        // Set filename based on original document name if possible
        downloadLink.download =
          fileInput && fileInput.files.length > 0
            ? `DocShield-QR-${fileInput.files[0].name}.png`
            : "DocShield-QRCode.png";
      } else {
        // Fallback if image generation is delayed
        setTimeout(() => {
          qrImage = qrCodeElement.querySelector("img");
          if (qrImage && qrImage.src) {
            downloadLink.href = qrImage.src;
            downloadLink.download =
              fileInput && fileInput.files.length > 0
                ? `DocShield-QR-${fileInput.files[0].name}.png`
                : "DocShield-QRCode.png";
          } else {
            console.error("QR Code image source not found after delay.");
            downloadLink.style.display = "none";
          }
        }, 500); // Wait 500ms
      }
    } else {
      console.warn("Element 'download-link' not found.");
    }

    // Set up the direct 'Verify' link
    if (verifyLink) {
      verifyLink.style.display = "inline-block"; // Make visible
      verifyLink.href = url; // Set href to the verification URL
    } else {
      console.warn("Element 'verfiy' not found.");
    } // Note original typo 'verfiy'
  } catch (error) {
    console.error("Error generating QR Code:", error);
    qrCodeElement.innerHTML = "Error generating QR code.";
    if (downloadLink) downloadLink.style.display = "none";
    if (verifyLink) verifyLink.style.display = "none";
  }
}

// Fetch and display past 'addHash' events emitted by the contract for the current user
async function listen() {
  // Only run on the upload page
  if (!window.location.pathname.endsWith("upload.html")) {
    console.log("Not on upload page, skipping event listening.");
    return;
  }
  if (!window.contract || !window.userAddress) {
    console.log("Contract or userAddress not ready for event listening.");
    // Maybe hide loader if it was shown expecting events
    try {
      $(".loading-tx").addClass("d-none");
    } catch (e) {}
    return;
  }

  console.log(
    "Listening for past 'addHash' events for user:",
    window.userAddress
  );
  const loadingTxElement = document.querySelector(".loading-tx");
  const transactionsContainer = document.querySelector(".transactions");
  const recentHeader = $("#recent-header");

  if (loadingTxElement) loadingTxElement.classList.remove("d-none"); // Show loading indicator
  if (transactionsContainer) transactionsContainer.innerHTML = ""; // Clear previous results
  recentHeader.hide(); // Hide header until events are found

  try {
    // Determine block range (e.g., last 10000 blocks or from a stored block number)
    const currentBlock = await window.web3.eth.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Look back max 10k blocks, adjust as needed

    console.log(`Querying events from block ${fromBlock} to ${currentBlock}`);

    const events = await window.contract.getPastEvents(
      "addHash", // Event name
      {
        filter: { _exporter: window.userAddress }, // Filter by the connected user's address
        fromBlock: fromBlock,
        toBlock: "latest", // Or currentBlock
      }
    );

    console.log("Past 'addHash' events found:", events);
    printTransactions(events); // Display the found events
  } catch (error) {
    console.error("Error fetching past events:", error);
    if (transactionsContainer) {
      transactionsContainer.innerHTML = `<p class="text-danger text-center col-12">Error loading past transactions: ${error.message}</p>`;
    }
  } finally {
    if (loadingTxElement) loadingTxElement.classList.add("d-none"); // Hide loading indicator
  }
}

// Render the list of past transactions (events) in the UI
function printTransactions(data) {
  const mainContainer = document.querySelector(".transactions");
  const recentHeader = $("#recent-header");

  if (!mainContainer) {
    console.error("Element with class 'transactions' not found.");
    return;
  }

  mainContainer.innerHTML = ""; // Clear previous entries

  if (!data || data.length === 0) {
    console.log("No past transactions to display.");
    recentHeader.hide(); // Hide header if no events
    // Optionally display a message
    // mainContainer.innerHTML = '<p class="text-center text-muted col-12">No recent uploads found.</p>';
    return;
  }

  recentHeader.show(); // Show header if events exist

  // Sort events by block number descending (most recent first)
  data.sort((a, b) => b.blockNumber - a.blockNumber);

  data.forEach((event, index) => {
    const txHash = event.transactionHash;
    const ipfsCID = event.returnValues._ipfsHash; // Get IPFS hash from event data
    const blockExplorerTxUrl = `${window.CONTRACT.explore}/tx/${txHash}`;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsCID}`;

    // Create link element wrapping the card
    const linkElement = document.createElement("a");
    linkElement.href = blockExplorerTxUrl;
    linkElement.setAttribute("target", "_blank");
    linkElement.setAttribute("rel", "noopener noreferrer");
    linkElement.setAttribute(
      "title",
      `View Transaction ${truncateAddress(txHash)}`
    );
    // Apply styling classes (adjust based on your Tailwind/CSS setup)
    linkElement.className =
      "block border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-200 bg-gray-800"; // Example Tailwind classes

    // Create image/object element for IPFS preview
    const previewElement = document.createElement("object"); // Use object for better PDF/content handling
    previewElement.data = ipfsUrl;
    previewElement.type = "image/svg+xml"; // Default type, browser might override based on content
    previewElement.className = "w-full h-48 object-contain bg-gray-700"; // Example Tailwind classes for size/bg
    // Fallback content if object fails to load
    const fallbackText = document.createElement("p");
    fallbackText.textContent = `Preview: ${ipfsCID.substring(0, 10)}...`;
    fallbackText.className = "text-xs text-gray-400 p-2 text-center";
    previewElement.appendChild(fallbackText); // Add fallback inside object

    // Add preview element to the link
    linkElement.appendChild(previewElement);

    // Optional: Add truncated Tx Hash or other info inside the card if needed
    // const infoDiv = document.createElement('div');
    // infoDiv.className = "p-2 text-center";
    // infoDiv.innerHTML = `<span class="text-xs text-gray-500">${truncateAddress(txHash)}</span>`;
    // linkElement.appendChild(infoDiv);

    // Append the link+card to the main container
    mainContainer.appendChild(linkElement);
  });
}
