import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock Firebase Admin SDK for tests
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        collection: jest.fn(() => ({
          add: jest.fn(),
          get: jest.fn(),
          orderBy: jest.fn(() => ({
            desc: jest.fn(() => ({
              limit: jest.fn(() => ({
                get: jest.fn(),
              })),
            })),
          })),
        })),
      })),
    })),
  })),
  FieldValue: {
    serverTimestamp: jest.fn(),
  },
}));

// Mock ethers.js for tests
jest.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: jest.fn(),
    Wallet: jest.fn(),
    Contract: jest.fn(),
    parseEther: jest.fn((value) => value),
    formatEther: jest.fn((value) => value),
    verifyMessage: jest.fn(),
    isAddress: jest.fn(() => true),
    ZeroAddress: '0x0000000000000000000000000000000000000000',
    id: jest.fn(() => 'mock-id'),
  },
}));

// Mock configuration
jest.mock('@/utils/config', () => ({
  config: {
    server: {
      port: 3001,
      nodeEnv: 'test',
      corsOrigin: ['http://localhost:3000'],
    },
    firebase: {
      projectId: 'test-project',
      serviceAccountPath: '',
    },
    blockchain: {
      networkRpcUrl: 'http://localhost:8545',
      privateKey: '0x0000000000000000000000000000000000000000000000000000000000000001',
      chainId: 1337,
    },
    contracts: {
      portfolioManager: '0x1234567890123456789012345678901234567890',
      quantToken: '0x0987654321098765432109876543210987654321',
      accessRegistry: '0x1111111111111111111111111111111111111111',
      supportedTokens: ['0x2222222222222222222222222222222222222222'],
    },
    api: {
      baseUrl: 'http://localhost:3001',
      jwtSecret: 'test-secret',
      sessionSecret: 'test-session-secret',
    },
    rateLimiting: {
      windowMs: 900000,
      maxRequests: 100,
    },
    logging: {
      level: 'error',
      enableRequestLogging: false,
    },
  },
  validateConfig: jest.fn(),
}));

// Suppress console logs during tests
console.log = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Cleanup
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});