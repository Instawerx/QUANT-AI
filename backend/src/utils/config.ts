import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3001'),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:9002'],
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
  },

  blockchain: {
    networkRpcUrl: process.env.NETWORK_RPC_URL || '',
    privateKey: process.env.PRIVATE_KEY || '',
    chainId: parseInt(process.env.CHAIN_ID || '11155111'),
  },

  contracts: {
    portfolioManager: process.env.METAMASK_PORTFOLIO_MANAGER_ADDRESS || '',
    quantToken: process.env.QUANT_TOKEN_ADDRESS || '',
    accessRegistry: process.env.ACCESS_REGISTRY_ADDRESS || '',
    supportedTokens: process.env.SUPPORTED_TOKENS?.split(',').map(addr => addr.trim()) || [],
  },

  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
  },

  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  },
};

// Validation function to check required environment variables
export function validateConfig() {
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'NETWORK_RPC_URL',
    'PRIVATE_KEY',
    'METAMASK_PORTFOLIO_MANAGER_ADDRESS',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate contract addresses format
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;

  if (config.contracts.portfolioManager && !addressRegex.test(config.contracts.portfolioManager)) {
    throw new Error('Invalid METAMASK_PORTFOLIO_MANAGER_ADDRESS format');
  }

  if (config.contracts.quantToken && !addressRegex.test(config.contracts.quantToken)) {
    throw new Error('Invalid QUANT_TOKEN_ADDRESS format');
  }

  if (config.contracts.accessRegistry && !addressRegex.test(config.contracts.accessRegistry)) {
    throw new Error('Invalid ACCESS_REGISTRY_ADDRESS format');
  }

  // Validate supported tokens
  const invalidTokens = config.contracts.supportedTokens.filter(token => !addressRegex.test(token));
  if (invalidTokens.length > 0) {
    throw new Error(`Invalid supported token addresses: ${invalidTokens.join(', ')}`);
  }

  console.log('✅ Configuration validated successfully');
}