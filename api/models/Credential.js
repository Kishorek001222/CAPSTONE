const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  credentialHash: {
    type: String,
    required: true,
    unique: true
  },
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issuerAddress: {
    type: String,
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectAddress: {
    type: String,
    required: true
  },
  credentialType: {
    type: String,
    required: true
  },
  credentialData: {
    degree: String,
    major: String,
    graduationDate: Date,
    gpa: Number,
    honors: String,
    institution: String,
    additionalInfo: mongoose.Schema.Types.Mixed
  },
  ipfsHash: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date,
    default: null
  },
  blockchainStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
credentialSchema.index({ subject: 1, isRevoked: 1 });
credentialSchema.index({ issuer: 1 });
credentialSchema.index({ credentialHash: 1 });

module.exports = mongoose.model('Credential', credentialSchema);
