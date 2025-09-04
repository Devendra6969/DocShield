// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DocumentRegistry
 * @author DocShield Team
 * @notice A smart contract to store and verify document hashes, creating an immutable
 * proof of existence. Authorized institutions ("Exporters") can add and manage
 * document records, while the contract owner manages the list of Exporters.
 */
contract DocumentRegistry {
    //-////////////////////////////////////////////////////////////
    //                           STRUCTS
    //-////////////////////////////////////////////////////////////

    struct Document {
        bytes32 docHash;        // The unique keccak256 hash of the document.
        uint256 blockTimestamp; // Timestamp when the document was registered.
        uint256 blockNumber;    // The block number of registration.
        string issuerInfo;      // Information about the issuing Exporter (e.g., "VIT Bhopal University").
        string ipfsCid;         // The IPFS Content ID for the document file.
        bool isValid;           // Flag to check if the document record is active.
    }

    struct Exporter {
        string info;            // Name or identifying info of the Exporter.
        bool isAuthorized;      // True if the address can add documents.
    }

    //-////////////////////////////////////////////////////////////
    //                       STATE VARIABLES
    //-////////////////////////////////////////////////////////////

    address public owner;
    uint16 public documentCount;
    uint16 public exporterCount;

    mapping(bytes32 => Document) private documents;
    mapping(address => Exporter) public exporters;

    //-////////////////////////////////////////////////////////////
    //                            EVENTS
    //-////////////////////////////////////////////////////////////

    /// @notice Emitted when a new document record is successfully added.
    /// @param exporter The address of the institution that added the document.
    /// @param docHash The hash of the newly added document.
    /// @param ipfsCid The IPFS CID of the document file.
    event DocumentAdded(address indexed exporter, bytes32 indexed docHash, string ipfsCid);

    /// @notice Emitted when a document record is revoked.
    /// @param revoker The address of the institution that revoked the document.
    /// @param docHash The hash of the revoked document.
    event DocumentRevoked(address indexed revoker, bytes32 indexed docHash);


    //-////////////////////////////////////////////////////////////
    //                         CUSTOM ERRORS
    //-////////////////////////////////////////////////////////////

    error Unauthorized();
    error InvalidAddress();
    error ExporterAlreadyExists(address exporter);
    error ExporterNotFound(address exporter);
    error DocumentAlreadyExists(bytes32 docHash);
    error DocumentNotFound(bytes32 docHash);

    //-////////////////////////////////////////////////////////////
    //                           MODIFIERS
    //-////////////////////////////////////////////////////////////

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyExporter() {
        if (!exporters[msg.sender].isAuthorized) revert Unauthorized();
        _;
    }

    //-////////////////////////////////////////////////////////////
    //                          CONSTRUCTOR
    //-////////////////////////////////////////////////////////////

    constructor() {
        owner = msg.sender;
    }

    //-////////////////////////////////////////////////////////////
    //                   OWNER-ONLY FUNCTIONS
    //-////////////////////////////////////////////////////////////

    /**
     * @notice Adds a new exporter who can register documents.
     * @dev Only the contract owner can call this function.
     * @param _exporterAddress The Ethereum address of the new exporter.
     * @param _info The name or info of the exporter (e.g., "Stanford University").
     */
    function addExporter(address _exporterAddress, string memory _info) public onlyOwner {
        if (_exporterAddress == address(0)) revert InvalidAddress();
        if (exporters[_exporterAddress].isAuthorized) revert ExporterAlreadyExists(_exporterAddress);

        exporters[_exporterAddress] = Exporter(_info, true);
        exporterCount++;
    }
    
    /**
     * @notice Revokes an exporter's authorization.
     * @dev The exporter's past documents remain. Only the owner can call this.
     * @param _exporterAddress The address of the exporter to de-authorize.
     */
    function removeExporter(address _exporterAddress) public onlyOwner {
        if (!exporters[_exporterAddress].isAuthorized) revert ExporterNotFound(_exporterAddress);
        exporters[_exporterAddress].isAuthorized = false;
        // Note: For simplicity, exporterCount is not decremented.
    }

    /**
     * @notice Updates the information for an existing exporter.
     * @param _exporterAddress The address of the exporter to update.
     * @param _newInfo The new information string.
     */
    function updateExporterInfo(address _exporterAddress, string memory _newInfo) public onlyOwner {
        if (!exporters[_exporterAddress].isAuthorized) revert ExporterNotFound(_exporterAddress);
        exporters[_exporterAddress].info = _newInfo;
    }
    
    /**
     * @notice Transfers ownership of the contract to a new address.
     * @param _newOwner The address of the new owner.
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        if (_newOwner == address(0)) revert InvalidAddress();
        owner = _newOwner;
    }

    //-////////////////////////////////////////////////////////////
    //                  EXPORTER-ONLY FUNCTIONS
    //-////////////////////////////////////////////////////////////

    /**
     * @notice Adds a new document hash to the registry.
     * @dev Must be called by an authorized exporter.
     * @param _hash The bytes32 hash of the document.
     * @param _ipfsCid The IPFS CID string where the document file is stored.
     */
    function addDocument(bytes32 _hash, string memory _ipfsCid) public onlyExporter {
        if (documents[_hash].isValid) revert DocumentAlreadyExists(_hash);

        string memory issuer = exporters[msg.sender].info;
        documents[_hash] = Document(_hash, block.timestamp, block.number, issuer, _ipfsCid, true);
        documentCount++;
        
        emit DocumentAdded(msg.sender, _hash, _ipfsCid);
    }
    
    /**
     * @notice Revokes a document record from the registry.
     * @dev Marks a document as invalid. Can only be called by an authorized exporter.
     * @param _hash The hash of the document to revoke.
     */
    function revokeDocument(bytes32 _hash) public onlyExporter {
        if (!documents[_hash].isValid) revert DocumentNotFound(_hash);
        documents[_hash].isValid = false;
        // Note: For simplicity, documentCount is not decremented.

        emit DocumentRevoked(msg.sender, _hash);
    }

    //-////////////////////////////////////////////////////////////
    //                    PUBLIC VIEW FUNCTIONS
    //-////////////////////////////////////////////////////////////
    
    /**
     * @notice Retrieves the information for a given exporter address.
     * @param _exporterAddress The address to query.
     * @return The exporter's info string.
     */
    function getExporterInfo(address _exporterAddress) public view returns (string memory) {
        return exporters[_exporterAddress].info;
    }

    /**
     * @notice Finds a document by its hash and returns its details.
     * @param _hash The hash of the document to find.
     * @return blockNum The block number of registration.
     * @return timestamp The timestamp of registration.
     * @return issuer The information of the issuer.
     * @return ipfsCid The IPFS CID of the document file.
     */
    function findDocument(bytes32 _hash) public view returns (uint256 blockNum, uint256 timestamp, string memory issuer, string memory ipfsCid) {
        if (documents[_hash].isValid) {
            Document storage doc = documents[_hash];
            return (doc.blockNumber, doc.blockTimestamp, doc.issuerInfo, doc.ipfsCid);
        }
        // Return empty values if not found or invalid
        return (0, 0, "", "");
    }
}