# QuantAI Backend API

Backend API for MetaMask authentication and smart contract interactions with the QuantAI platform.

## Overview

This Express.js backend provides:

- **MetaMask Authentication**: Secure wallet-based authentication using signature verification
- **Smart Contract Integration**: Direct interaction with MetaMaskPortfolioManager contract
- **Firebase Integration**: User data storage and session management
- **Admin Operations**: Portfolio management and token operations
- **Transaction Tracking**: Complete transaction history and status monitoring

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Ethereum wallet with admin privileges for contract operations
- Access to Ethereum network (Sepolia testnet or mainnet)

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

### Server Configuration
```bash
PORT=3001
NODE_ENV=development
```

### Firebase Configuration
```bash
# Path to Firebase service account key (for local development)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Firebase project ID
FIREBASE_PROJECT_ID=your-firebase-project-id
```

### Blockchain Configuration
```bash
# RPC endpoint URL (Infura, Alchemy, etc.)
NETWORK_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY

# Admin wallet private key (without 0x prefix)
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix

# Target blockchain network
CHAIN_ID=11155111
```

### Smart Contract Addresses

⚠️ **IMPORTANT**: Replace these placeholder addresses with your actual deployed contract addresses:

```bash
# MetaMaskPortfolioManager contract address
METAMASK_PORTFOLIO_MANAGER_ADDRESS=0x0000000000000000000000000000000000000000

# QuantToken contract address (optional)
QUANT_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000

# AccessRegistry contract address (optional)
ACCESS_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000

# Supported ERC20 token addresses (comma-separated)
SUPPORTED_TOKENS=0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9,0x779877A7B0D9E8603169DdbD7836e478b4624789
```

### API Configuration
```bash
API_BASE_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000,http://localhost:9002

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret

# Logging
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication

#### Generate Authentication Message
```http
POST /api/auth/generate-message
Content-Type: application/json

{
  "address": "0x742d35Cc6634C0532925a3b8D404f65971b1fc23"
}
```

#### Authenticate with MetaMask
```http
POST /api/auth/authenticate
Content-Type: application/json

{
  "address": "0x742d35Cc6634C0532925a3b8D404f65971b1fc23",
  "signature": "0x...",
  "message": "Please sign this message...",
  "timestamp": 1640995200000
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer session-id
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer session-id
```

#### Verify Session
```http
GET /api/auth/verify
Authorization: Bearer session-id
```

### Portfolio Management

#### Get User Balances
```http
GET /api/portfolio/balances/:address
Authorization: Bearer session-id
```

#### Get Specific Token Balance
```http
GET /api/portfolio/balance/:address/:token
Authorization: Bearer session-id
```

#### Deposit Tokens (Admin Only)
```http
POST /api/portfolio/deposit/tokens
Authorization: Bearer session-id
Content-Type: application/json

{
  "userAddress": "0x742d35Cc6634C0532925a3b8D404f65971b1fc23",
  "tokens": ["0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"],
  "amounts": ["100.0"]
}
```

#### Deposit ETH (Admin Only)
```http
POST /api/portfolio/deposit/eth
Authorization: Bearer session-id
Content-Type: application/json

{
  "userAddress": "0x742d35Cc6634C0532925a3b8D404f65971b1fc23",
  "amount": "1.5"
}
```

#### Withdraw Tokens (Admin Only)
```http
POST /api/portfolio/withdraw/tokens
Authorization: Bearer session-id
Content-Type: application/json

{
  "token": "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  "userAddress": "0x742d35Cc6634C0532925a3b8D404f65971b1fc23",
  "amount": "50.0"
}
```

#### Withdraw ETH (Admin Only)
```http
POST /api/portfolio/withdraw/eth
Authorization: Bearer session-id
Content-Type: application/json

{
  "userAddress": "0x742d35Cc6634C0532925a3b8D404f65971b1fc23",
  "amount": "0.5"
}
```

#### Transfer Tokens Between Users (Admin Only)
```http
POST /api/portfolio/transfer
Authorization: Bearer session-id
Content-Type: application/json

{
  "token": "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  "fromUser": "0x742d35Cc6634C0532925a3b8D404f65971b1fc23",
  "toUser": "0x3333333333333333333333333333333333333333",
  "amount": "25.0"
}
```

#### Get Supported Tokens
```http
GET /api/portfolio/tokens/supported
```

#### Add Supported Token (Admin Only)
```http
POST /api/portfolio/tokens/add
Authorization: Bearer session-id
Content-Type: application/json

{
  "tokenAddress": "0x5555555555555555555555555555555555555555"
}
```

#### Get Transaction Status
```http
GET /api/portfolio/transaction/:hash
Authorization: Bearer session-id
```

### Health Check
```http
GET /health
```

### API Information
```http
GET /api
```

## Admin Operations

Admin privileges are determined by:
1. User tier >= 3 in the system
2. Wallet address matches the contract admin address

Admin-only endpoints:
- All deposit operations
- All withdraw operations
- Token transfers between users
- Adding supported tokens

## Security Features

- **Signature Verification**: All authentication uses MetaMask signature verification
- **Session Management**: Secure session handling with automatic expiration
- **Rate Limiting**: Protection against abuse with configurable limits
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protections
- **Error Handling**: Secure error responses without sensitive information

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test auth.test.ts

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

Test coverage includes:
- Authentication flow testing
- Contract interaction testing
- API endpoint testing
- Error handling testing
- Security validation testing

## Deployment

### Local Development

```bash
# Start the server
npm run dev

# The API will be available at http://localhost:3001
```

### Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Start the production server:
```bash
npm start
```

### Cloud Run Deployment

See deployment documentation for Cloud Run configuration with:
- Secret Manager integration
- Environment variable management
- Auto-scaling configuration
- Health check configuration

## Error Handling

The API uses structured error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": {} // Only in development
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (validation errors)
- `401`: Unauthorized (invalid session)
- `403`: Forbidden (insufficient privileges)
- `404`: Not found
- `429`: Rate limit exceeded
- `500`: Internal server error

## Logging

Structured logging with Winston:
- Development: Console output with colors
- Production: File logging and structured JSON
- Categories: API, Auth, Contract, Security, Transaction

Log levels: `error`, `warn`, `info`, `debug`

## Performance Considerations

- Connection pooling for blockchain interactions
- Firestore optimization with proper indexing
- Rate limiting to prevent abuse
- Caching for frequently accessed data
- Efficient contract interaction patterns

## Security Best Practices

1. **Private Key Management**: Store private keys securely, never commit to repository
2. **Environment Variables**: Use Secret Manager in production
3. **Session Security**: Regular session cleanup and validation
4. **Input Validation**: All inputs validated and sanitized
5. **Error Information**: No sensitive data in error responses
6. **Monitoring**: Comprehensive logging for security events

## Troubleshooting

### Common Issues

1. **Contract Address Not Set**
   ```
   Error: Invalid METAMASK_PORTFOLIO_MANAGER_ADDRESS format
   ```
   Solution: Set correct contract address in `.env`

2. **Firebase Connection Failed**
   ```
   Error: Failed to initialize Firebase Admin SDK
   ```
   Solution: Check Firebase credentials and project ID

3. **Blockchain Connection Failed**
   ```
   Error: Failed to initialize provider
   ```
   Solution: Verify RPC URL and network access

4. **Authentication Failed**
   ```
   Error: Invalid signature
   ```
   Solution: Check MetaMask connection and message signing

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true
```

## Contributing

1. Follow TypeScript best practices
2. Maintain test coverage above 80%
3. Use proper error handling
4. Add comprehensive logging
5. Document all new endpoints

## License

MIT License - see LICENSE file for details