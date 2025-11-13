const Credential = require('../models/Credential');
const User = require('../models/User');
const { ethers } = require('ethers');

// @desc    Issue a new credential
// @route   POST /api/credentials/issue
// @access  Private (University only)
const issueCredential = async (req, res) => {
  try {
    const {
      subjectEmail,
      credentialType,
      credentialData,
      expiresAt,
      ipfsHash,
      credentialHash,
      transactionHash
    } = req.body;

    // Validate required fields
    if (!subjectEmail || !credentialType || !ipfsHash || !credentialHash || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Find subject user
    const subject = await User.findOne({ email: subjectEmail });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if subject has a wallet address
    if (!subject.walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Student must have a registered wallet address'
      });
    }

    // Check if issuer has wallet address
    if (!req.user.walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Issuer must have a registered wallet address'
      });
    }

    // Create credential in database
    const credential = await Credential.create({
      credentialHash,
      issuer: req.user._id,
      issuerAddress: req.user.walletAddress,
      subject: subject._id,
      subjectAddress: subject.walletAddress,
      credentialType,
      credentialData,
      ipfsHash,
      transactionHash,
      expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year
      blockchainStatus: 'confirmed'
    });

    // Populate issuer and subject info
    await credential.populate('issuer', 'name email organization');
    await credential.populate('subject', 'name email');

    res.status(201).json({
      success: true,
      data: credential
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error issuing credential',
      error: error.message
    });
  }
};

// @desc    Get credentials for logged in user
// @route   GET /api/credentials/my
// @access  Private
const getMyCredentials = async (req, res) => {
  try {
    let credentials;

    if (req.user.role === 'student') {
      // Get credentials where user is the subject
      credentials = await Credential.find({ subject: req.user._id })
        .populate('issuer', 'name email organization')
        .sort({ issuedAt: -1 });
    } else if (req.user.role === 'university') {
      // Get credentials where user is the issuer
      credentials = await Credential.find({ issuer: req.user._id })
        .populate('subject', 'name email')
        .sort({ issuedAt: -1 });
    } else {
      credentials = [];
    }

    res.status(200).json({
      success: true,
      count: credentials.length,
      data: credentials
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching credentials'
    });
  }
};

// @desc    Get credential by hash
// @route   GET /api/credentials/:hash
// @access  Public
const getCredentialByHash = async (req, res) => {
  try {
    const credential = await Credential.findOne({ credentialHash: req.params.hash })
      .populate('issuer', 'name email organization')
      .populate('subject', 'name email');

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    res.status(200).json({
      success: true,
      data: credential
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching credential'
    });
  }
};

// @desc    Revoke a credential
// @route   PUT /api/credentials/:id/revoke
// @access  Private (University only)
const revokeCredential = async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id);

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    // Check if user is the issuer
    if (credential.issuer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to revoke this credential'
      });
    }

    if (credential.isRevoked) {
      return res.status(400).json({
        success: false,
        message: 'Credential is already revoked'
      });
    }

    credential.isRevoked = true;
    credential.revokedAt = new Date();
    await credential.save();

    res.status(200).json({
      success: true,
      data: credential
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error revoking credential'
    });
  }
};

// @desc    Get all students (for university to issue credentials)
// @route   GET /api/credentials/students
// @access  Private (University only)
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email walletAddress did')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching students'
    });
  }
};

module.exports = {
  issueCredential,
  getMyCredentials,
  getCredentialByHash,
  revokeCredential,
  getStudents
};
