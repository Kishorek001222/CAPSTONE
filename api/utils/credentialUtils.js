const { ethers } = require('ethers');

const normalizeCredentialPayload = (payload) => {
  const normalized = {
    degree: payload.degree || '',
    major: payload.major || '',
    graduationDate: payload.graduationDate || '',
    gpa: payload.gpa ?? null,
    honors: payload.honors || '',
    institution: payload.institution || '',
    issuedBy: payload.issuedBy || ''
  };

  return normalized;
};

const createDeterministicCredentialHash = (payload) => {
  const serialized = JSON.stringify(payload);
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(serialized));
};

module.exports = {
  normalizeCredentialPayload,
  createDeterministicCredentialHash
};
