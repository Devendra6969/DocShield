````markdown
# DocShield: Blockchain-Based Document Verification

DocShield is a decentralized application (dApp) that provides a secure and immutable way to verify the authenticity of documents. By leveraging the power of the Ethereum blockchain and the InterPlanetary File System (IPFS), this project ensures that document records are tamper-proof and permanently accessible.

Once a document is registered, its cryptographic hash is stored on the blockchain, while the document itself is uploaded to the decentralized IPFS network. This creates a transparent and trustless system for verification, eliminating the need for third-party intermediaries.

---

## Features

-   **Secure Verification**: Utilizes blockchain for immutable record-keeping and IPFS for decentralized file storage.
-   **Decentralized**: No central point of failure, ensuring high availability and censorship resistance.
-   **User-Friendly Interface**: A clean and simple web interface for uploading and verifying documents.
-   **Access Control**: A contract owner can manage a list of authorized addresses (Exporters) who are permitted to add new documents.

---

## Technology Stack

-   **Smart Contract**: Solidity
-   **Frontend**: HTML, CSS, JavaScript
-   **Blockchain Interaction**: Web3.js
-   **Decentralized Storage**: IPFS (via Infura)
-   **Wallet**: MetaMask

---

## Prerequisites

Before you begin, ensure you have the following installed and configured:

-   **Node.js & npm**: [Download Node.js](https://nodejs.org/)
-   **MetaMask**: A browser extension wallet. [Get MetaMask](https://metamask.io/)
-   **Sepolia Test ETH**: You will need test ETH to pay for transaction fees on the Sepolia testnet. You can get some from a public faucet like [sepoliafaucet.com](https://sepoliafaucet.com/).
-   **Infura Account**: To get an IPFS API Key and Secret. [Create an Infura Account](https://infura.io/)

---

## Installation and Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

Open your terminal and clone the project:

```sh
git clone [https://github.com/DevAloshe/BlockChain-Based-Document-Verfication-With-IPFS.git](https://github.com/DevAloshe/BlockChain-Based-Document-Verfication-With-IPFS.git)
cd BlockChain-Based-Document-Verfication-With-IPFS
````

### 2\. Install Dependencies

Install the required npm packages:

```sh
npm install
```

### 3\. Deploy the Smart Contract

The heart of the application is the Solidity smart contract.

1.  Go to the **[Remix Online IDE](https://www.google.com/search?q=https://remix.ethereum.org/)**.
2.  Create a new file named `contract.sol` and paste the Solidity code into it.
3.  Go to the "Solidity Compiler" tab, select compiler version `0.8.20` (or newer), and click **Compile**.
4.  Switch to the "Deploy & Run Transactions" tab.
5.  Change the **ENVIRONMENT** to **"Injected Provider - MetaMask"**. Your MetaMask wallet will prompt you to connect.
6.  Ensure MetaMask is connected to the **Sepolia Testnet**.
7.  Click the orange **Deploy** button and confirm the transaction in MetaMask.
8.  After deployment, copy the **Contract Address** from the "Deployed Contracts" section in Remix.

### 4\. Configure the Application

1.  Open the `js/App.js` file in your project.
2.  Paste the **Contract Address** you just copied into the `address` field inside the `window.CONTRACT` object.
3.  In the same file, find the `projectId` and `projectSecret` constants at the top. Paste your **Infura IPFS API Key and Secret** here.

### 5\. Run the Project

  - Use a local web server to run the project. If you have VS Code, the **Live Server** extension is recommended.
  - Right-click on `index.html` and select "Open with Live Server".

-----

## Usage

1.  **Authorize an Uploader**:

      - After connecting your wallet, navigate to the **Admin** page.
      - Your wallet address is the contract "owner." Paste the address of a user you want to authorize (e.g., your own address) into the "Exporter Address" field.
      - Add some information (like "My University") and click **Add Exporter**. Confirm the transaction.

2.  **Upload a Document**:

      - Navigate to the **Upload** page.
      - Select a file. The dApp will hash it, upload it to IPFS, and prompt you to confirm a transaction to record the hash on the blockchain.

3.  **Verify a Document**:

      - Navigate to the **Verify** page.
      - Select the same original file. The dApp will hash it and check the blockchain for a matching record, displaying the document's details if it's found and verified.

-----

## Troubleshooting

### "Buffer is not defined" Error

This is a common issue caused by the browser loading an old version of the HTML file. To fix it, you must force the browser to clear its cache for the page.

  - **Hard Refresh**:
      - On Windows/Linux: `Ctrl + Shift + R`
      - On Mac: `Cmd + Shift + R`
  - **Disable Cache (Recommended for development)**:
      - Open Developer Tools (F12).
      - Go to the "Network" tab.
      - Check the "Disable cache" box. The cache will remain disabled as long as the developer tools are open.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

```
```