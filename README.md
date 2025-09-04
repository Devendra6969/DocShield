# DocShield: Blockchain Document Verification System

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Solidity Version](https://img.shields.io/badge/Solidity-^0.8.20-lightgrey)
![Status](https://img.shields.io/badge/status-active-brightgreen)

**DocShield is a decentralized application (DApp) that leverages the power of the Ethereum blockchain and IPFS to provide an immutable, secure, and transparent system for document verification.**

This platform allows authorized institutions (like universities or government bodies) to register a document's unique digital fingerprint on the blockchain. Anyone can then verify the authenticity of a document by checking its hash against the on-chain record, effectively preventing fraud and forgery in an increasingly digital world.

---

## 🚀 Key Features

* **Secure Client-Side Hashing**: Documents are cryptographically hashed on the user's browser using Keccak256 (SHA-3), ensuring file contents never leave their computer.
* **Decentralized Storage**: Document files are uploaded to the **InterPlanetary File System (IPFS)**, ensuring data persistence and censorship resistance. The resulting CID is stored on-chain.
* **Immutable Records**: Once a document's hash is recorded on the blockchain, it cannot be altered or deleted, providing a permanent and auditable proof-of-existence.
* **Instant Verification**: Anyone can upload a document to the "Verify" page and instantly check if a valid record exists on the blockchain.
* **Role-Based Access Control**: A contract `owner` (administrator) manages a list of authorized "Exporters" (institutions) who are the only ones permitted to add new document records.
* **Modern & Responsive UI**: A clean, intuitive, and mobile-friendly user interface built with Tailwind CSS.
* **QR Code Generation**: Upon successful upload, a QR code is generated, linking directly to a verification page for easy sharing and validation.

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, CSS3, JavaScript, [Tailwind CSS](https://tailwindcss.com/), [jQuery](https://jquery.com/), [Web3.js](https://web3js.readthedocs.io/)
* **Blockchain**: [Solidity](https://soliditylang.org/) ^0.8.20, Ethereum (Sepolia Testnet)
* **Decentralized Storage**: [IPFS](https://ipfs.io/) via [Infura](https://infura.io/)
* **Wallet Integration**: [MetaMask](https://metamask.io/)
* **Development Tools**: [Node.js](https://nodejs.org/), npm

---

## 📈 Project Architecture & Flow

The system is designed with a serverless architecture where the frontend client interacts directly with decentralized protocols.

1.  **Frontend (Client-Side)**: The user interface where users can upload, verify, and manage documents. All cryptographic hashing and interactions are initiated here.
2.  **MetaMask**: Acts as the secure bridge between the frontend and the Ethereum blockchain, allowing users to manage keys and sign transactions.
3.  **IPFS (via Infura Gateway)**: Provides decentralized storage for the actual document files.
4.  **Ethereum Smart Contract (`DocumentRegistry.sol`)**: The immutable backend logic of the application. It stores document hashes, IPFS CIDs, and manages the access control list of authorized exporters.

### Document Upload Flow


graph TD
    A[User selects document on Upload page] --> B{Frontend (App.js)};
    B --> C[1. Calculate Keccak256 hash of the file];
    B --> D[2. Upload original file to IPFS via Infura];
    D --> E[IPFS returns a unique Content ID (CID)];
    C & E --> F[3. Prompt user to confirm transaction via MetaMask];
    F --> G[User signs transaction];
    G --> H[4. Send transaction to Smart Contract with (File Hash + IPFS CID)];
    H --> I[Smart Contract verifies sender is an authorized Exporter];
    I --> J[5. Store record permanently on the Blockchain & emit Event];
Document Verification Flow
Code snippet

graph TD
    A[User selects a document on Verify page] --> B{Frontend (App.js)};
    B --> C[1. Calculate Keccak256 hash of the file];
    C --> D[2. Call 'findDocument(hash)' on Smart Contract (read-only)];
    D --> E[Smart Contract looks up the hash in its records];
    E --> F[3. Return document details if found, or empty values if not];
    F --> G{Frontend (App.js)};
    G --> H[4. Display "Verified" with issuer details & IPFS link];
    G --> I[OR Display "Not Verified"];
🏁 Getting Started
To get a local copy up and running, follow these steps.

Prerequisites
Node.js & npm: Make sure Node.js is installed. You can download it here.

MetaMask: A browser extension wallet for interacting with the Ethereum blockchain. Install it from here.

Installation & Setup
Clone the repository:

Bash

git clone [https://github.com/your-username/docshield.git](https://github.com/your-username/docshield.git)
cd docshield
Create a package.json file (if not present):
This is useful for managing local development servers or other scripts.

Bash

npm init -y
You can install a simple server to run the project:

Bash

npm install --save-dev live-server
Then add a start script to your package.json:

JSON

"scripts": {
  "start": "live-server"
}
Deploy the Smart Contract:

You will need to deploy the Contract/contract.sol file to a test network like Sepolia using a tool like Remix IDE or a development framework like Hardhat/Truffle.

Once deployed, copy the new contract address.

Update the Configuration:

Open js/App.js.

Update the address variable inside the window.CONTRACT object with your newly deployed smart contract address.

IMPORTANT: For a real-world application, move your Infura projectId and projectSecret to a secure backend server. Exposing API secrets in frontend code is a security risk.

Run the application:

If you installed live-server, run the following command in your terminal:

Bash

npm start
Otherwise, open the index.html file directly in your browser or use a code editor's live server extension (like VS Code's "Live Server").

📖 Usage
Connect Wallet: Open the application and click "Connect Wallet". Approve the connection in MetaMask and ensure you are on the correct network (e.g., Sepolia Testnet).

Admin Panel: If you are the contract owner, navigate to the admin.html page. Here you can add the wallet addresses of institutions that will be authorized to upload documents.

Upload Document: As an authorized "Exporter", go to upload.html. Select a file, and the DApp will hash it and prepare a transaction. Click "Upload" and confirm the transaction in MetaMask.

Verify Document: Go to verify.html. Select any document, and the DApp will instantly tell you if it's a valid, registered document by checking its hash against the blockchain record.

📁 File Structure
.
├── 📄 index.html        // Homepage
├── 📄 upload.html       // Page for uploading documents
├── 📄 verify.html       // Page for verifying documents
├── 📄 delete.html       // Page for revoking document records
├── 📄 admin.html        // Admin panel for managing exporters
├── 📄 about.html        // Team page
├── 📁 Contract/
│   └── 📜 contract.sol     // The main Solidity smart contract
├── 📁 js/
│   ├── 📜 App.js           // Core DApp logic and contract interaction
│   ├── 📜 web3.min.js      // Web3 library
│   └── 📜 qrcode.min.js   // QR Code generation library
└── 📁 assets/
    └── 📁 images/
        └── 🖼️ icon.png    // Favicon and brand assets
🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
Distributed under the MIT License. See the LICENSE file for more information.

📧 Contact
Devendra Singh 

Project Link: https://github.com/your-username/docshield