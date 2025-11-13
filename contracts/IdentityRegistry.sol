// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IdentityRegistry
 * @dev Decentralized Identity Registry for Self-Sovereign Identity (SSI)
 */
contract IdentityRegistry {
    
    // Structs
    struct DID {
        address owner;
        string didDocument;
        uint256 createdAt;
        bool isActive;
    }
    
    struct VerifiableCredential {
        bytes32 credentialHash;
        address issuer;
        address subject;
        string credentialType;
        uint256 issuedAt;
        uint256 expiresAt;
        bool isRevoked;
        string metadataURI; // IPFS hash
    }
    
    // State variables
    address public owner;
    mapping(address => DID) public dids;
    mapping(bytes32 => VerifiableCredential) public credentials;
    mapping(address => bool) public isIssuer;
    mapping(address => bytes32[]) public subjectCredentials;
    
    // Events
    event DIDRegistered(address indexed didAddress, uint256 timestamp);
    event DIDUpdated(address indexed didAddress, uint256 timestamp);
    event IssuerAdded(address indexed issuerAddress);
    event IssuerRemoved(address indexed issuerAddress);
    event CredentialIssued(
        bytes32 indexed credentialHash,
        address indexed issuer,
        address indexed subject,
        uint256 timestamp
    );
    event CredentialRevoked(bytes32 indexed credentialHash, uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this");
        _;
    }
    
    modifier onlyIssuer() {
        require(isIssuer[msg.sender], "Only authorized issuers can call this");
        _;
    }
    
    modifier didExists(address _didAddress) {
        require(dids[_didAddress].isActive, "DID does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Add a new issuer (university)
     * @param _issuer Address of the issuer to add
     */
    function addIssuer(address _issuer) external onlyOwner {
        require(_issuer != address(0), "Invalid issuer address");
        require(!isIssuer[_issuer], "Issuer already exists");
        
        isIssuer[_issuer] = true;
        emit IssuerAdded(_issuer);
    }
    
    /**
     * @dev Remove an issuer
     * @param _issuer Address of the issuer to remove
     */
    function removeIssuer(address _issuer) external onlyOwner {
        require(isIssuer[_issuer], "Issuer does not exist");
        
        isIssuer[_issuer] = false;
        emit IssuerRemoved(_issuer);
    }
    
    /**
     * @dev Register a new DID
     * @param _didDocument JSON-LD DID Document (IPFS hash or inline)
     */
    function registerDID(string memory _didDocument) external {
        require(!dids[msg.sender].isActive, "DID already registered");
        require(bytes(_didDocument).length > 0, "DID document cannot be empty");
        
        dids[msg.sender] = DID({
            owner: msg.sender,
            didDocument: _didDocument,
            createdAt: block.timestamp,
            isActive: true
        });
        
        emit DIDRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Update DID document
     * @param _didDocument Updated DID document
     */
    function updateDID(string memory _didDocument) external didExists(msg.sender) {
        require(bytes(_didDocument).length > 0, "DID document cannot be empty");
        
        dids[msg.sender].didDocument = _didDocument;
        emit DIDUpdated(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Issue a verifiable credential
     * @param _credentialHash Hash of the credential
     * @param _subject Address of the credential subject
     * @param _credentialType Type of credential (e.g., "Degree", "Certificate")
     * @param _expiresAt Expiration timestamp
     * @param _metadataURI IPFS URI containing full credential data
     */
    function issueCredential(
        bytes32 _credentialHash,
        address _subject,
        string memory _credentialType,
        uint256 _expiresAt,
        string memory _metadataURI
    ) external onlyIssuer didExists(_subject) {
        require(_credentialHash != bytes32(0), "Invalid credential hash");
        require(_subject != address(0), "Invalid subject address");
        require(credentials[_credentialHash].issuedAt == 0, "Credential already exists");
        require(_expiresAt > block.timestamp, "Expiration date must be in the future");
        
        credentials[_credentialHash] = VerifiableCredential({
            credentialHash: _credentialHash,
            issuer: msg.sender,
            subject: _subject,
            credentialType: _credentialType,
            issuedAt: block.timestamp,
            expiresAt: _expiresAt,
            isRevoked: false,
            metadataURI: _metadataURI
        });
        
        subjectCredentials[_subject].push(_credentialHash);
        
        emit CredentialIssued(_credentialHash, msg.sender, _subject, block.timestamp);
    }
    
    /**
     * @dev Revoke a credential
     * @param _credentialHash Hash of the credential to revoke
     */
    function revokeCredential(bytes32 _credentialHash) external onlyIssuer {
        require(credentials[_credentialHash].issuedAt != 0, "Credential does not exist");
        require(credentials[_credentialHash].issuer == msg.sender, "Only issuer can revoke");
        require(!credentials[_credentialHash].isRevoked, "Credential already revoked");
        
        credentials[_credentialHash].isRevoked = true;
        emit CredentialRevoked(_credentialHash, block.timestamp);
    }
    
    /**
     * @dev Verify a credential
     * @param _credentialHash Hash of the credential to verify
     * @return isValid Whether the credential is valid
     * @return issuer Address of the issuer
     * @return subject Address of the subject
     * @return issuedAt Timestamp when issued
     * @return expiresAt Expiration timestamp
     * @return metadataURI IPFS URI
     */
    function verifyCredential(bytes32 _credentialHash)
        external
        view
        returns (
            bool isValid,
            address issuer,
            address subject,
            uint256 issuedAt,
            uint256 expiresAt,
            string memory metadataURI
        )
    {
        VerifiableCredential memory cred = credentials[_credentialHash];
        
        isValid = cred.issuedAt != 0 && 
                  !cred.isRevoked && 
                  cred.expiresAt > block.timestamp;
        
        return (
            isValid,
            cred.issuer,
            cred.subject,
            cred.issuedAt,
            cred.expiresAt,
            cred.metadataURI
        );
    }
    
    /**
     * @dev Get all credentials for a subject
     * @param _subject Address of the subject
     * @return Array of credential hashes
     */
    function getCredentialsBySubject(address _subject) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return subjectCredentials[_subject];
    }
    
    /**
     * @dev Get DID information
     * @param _didAddress Address of the DID
     * @return owner_ Owner address
     * @return didDocument_ DID document
     * @return createdAt_ Creation timestamp
     * @return isActive_ Whether DID is active
     */
    function getDID(address _didAddress)
        external
        view
        returns (
            address owner_,
            string memory didDocument_,
            uint256 createdAt_,
            bool isActive_
        )
    {
        DID memory did = dids[_didAddress];
        return (did.owner, did.didDocument, did.createdAt, did.isActive);
    }
}
