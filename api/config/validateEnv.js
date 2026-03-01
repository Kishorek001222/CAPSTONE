const requiredAlways = ['MONGODB_URI', 'JWT_SECRET'];
const requiredForBlockchain = ['CONTRACT_ADDRESS'];
const requiredForIpfs = ['PINATA_API_KEY', 'PINATA_SECRET_KEY'];

const hasRpcConfig = () => Boolean(process.env.SEPOLIA_RPC_URL || process.env.RPC_URL);

const isMissing = (key) => !process.env[key] || process.env[key].trim() === '';

const validateEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const missing = [];
  const warnings = [];

  requiredAlways.forEach((key) => {
    if (isMissing(key)) {
      missing.push(key);
    }
  });

  requiredForBlockchain.forEach((key) => {
    if (isMissing(key)) {
      warnings.push(key);
    }
  });

  if (!hasRpcConfig()) {
    warnings.push('SEPOLIA_RPC_URL or RPC_URL');
  }

  requiredForIpfs.forEach((key) => {
    if (isMissing(key)) {
      warnings.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  if (warnings.length > 0) {
    const warningText = `Optional production integrations are not fully configured: ${warnings.join(', ')}`;
    if (nodeEnv === 'production') {
      throw new Error(warningText);
    }
    console.warn(warningText);
  }
};

module.exports = validateEnv;
