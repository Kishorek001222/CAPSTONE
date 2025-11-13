const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdentityRegistry", function () {
  let identityRegistry;
  let owner;
  let issuer;
  let student;
  let employer;

  beforeEach(async function () {
    [owner, issuer, student, employer] = await ethers.getSigners();

    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    identityRegistry = await IdentityRegistry.deploy();
    await identityRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await identityRegistry.owner()).to.equal(owner.address);
    });
  });

  describe("Issuer Management", function () {
    it("Should add an issuer", async function () {
      await identityRegistry.addIssuer(issuer.address);
      expect(await identityRegistry.isIssuer(issuer.address)).to.be.true;
    });

    it("Should remove an issuer", async function () {
      await identityRegistry.addIssuer(issuer.address);
      await identityRegistry.removeIssuer(issuer.address);
      expect(await identityRegistry.isIssuer(issuer.address)).to.be.false;
    });

    it("Should only allow owner to add issuer", async function () {
      await expect(
        identityRegistry.connect(student).addIssuer(issuer.address)
      ).to.be.revertedWith("Only contract owner can call this");
    });
  });

  describe("DID Registration", function () {
    it("Should register a new DID", async function () {
      const didDocument = '{"@context":"https://www.w3.org/ns/did/v1"}';
      await identityRegistry.connect(student).registerDID(didDocument);

      const did = await identityRegistry.getDID(student.address);
      expect(did.owner_).to.equal(student.address);
      expect(did.isActive_).to.be.true;
    });

    it("Should not allow duplicate DID registration", async function () {
      const didDocument = '{"@context":"https://www.w3.org/ns/did/v1"}';
      await identityRegistry.connect(student).registerDID(didDocument);

      await expect(
        identityRegistry.connect(student).registerDID(didDocument)
      ).to.be.revertedWith("DID already registered");
    });
  });

  describe("Credential Issuance", function () {
    beforeEach(async function () {
      // Setup: Add issuer and register student DID
      await identityRegistry.addIssuer(issuer.address);
      const didDocument = '{"@context":"https://www.w3.org/ns/did/v1"}';
      await identityRegistry.connect(student).registerDID(didDocument);
    });

    it("Should issue a credential", async function () {
      const credentialHash = ethers.keccak256(ethers.toUtf8Bytes("credential123"));
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year
      const metadataURI = "ipfs://QmTest123";

      await identityRegistry
        .connect(issuer)
        .issueCredential(
          credentialHash,
          student.address,
          "Bachelor's Degree",
          expiresAt,
          metadataURI
        );

      const result = await identityRegistry.verifyCredential(credentialHash);
      expect(result.isValid).to.be.true;
      expect(result.subject).to.equal(student.address);
    });

    it("Should only allow issuers to issue credentials", async function () {
      const credentialHash = ethers.keccak256(ethers.toUtf8Bytes("credential123"));
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      await expect(
        identityRegistry
          .connect(student)
          .issueCredential(
            credentialHash,
            student.address,
            "Bachelor's Degree",
            expiresAt,
            "ipfs://test"
          )
      ).to.be.revertedWith("Only authorized issuers can call this");
    });
  });

  describe("Credential Verification", function () {
    let credentialHash;

    beforeEach(async function () {
      await identityRegistry.addIssuer(issuer.address);
      const didDocument = '{"@context":"https://www.w3.org/ns/did/v1"}';
      await identityRegistry.connect(student).registerDID(didDocument);

      credentialHash = ethers.keccak256(ethers.toUtf8Bytes("credential123"));
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      await identityRegistry
        .connect(issuer)
        .issueCredential(
          credentialHash,
          student.address,
          "Bachelor's Degree",
          expiresAt,
          "ipfs://test"
        );
    });

    it("Should verify a valid credential", async function () {
      const result = await identityRegistry.verifyCredential(credentialHash);
      expect(result.isValid).to.be.true;
    });

    it("Should return invalid for revoked credential", async function () {
      await identityRegistry.connect(issuer).revokeCredential(credentialHash);
      const result = await identityRegistry.verifyCredential(credentialHash);
      expect(result.isValid).to.be.false;
    });
  });

  describe("Get Credentials by Subject", function () {
    it("Should return all credentials for a subject", async function () {
      await identityRegistry.addIssuer(issuer.address);
      const didDocument = '{"@context":"https://www.w3.org/ns/did/v1"}';
      await identityRegistry.connect(student).registerDID(didDocument);

      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("cred1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("cred2"));
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      await identityRegistry
        .connect(issuer)
        .issueCredential(hash1, student.address, "Degree", expiresAt, "ipfs://1");
      
      await identityRegistry
        .connect(issuer)
        .issueCredential(hash2, student.address, "Certificate", expiresAt, "ipfs://2");

      const credentials = await identityRegistry.getCredentialsBySubject(student.address);
      expect(credentials.length).to.equal(2);
    });
  });
});
