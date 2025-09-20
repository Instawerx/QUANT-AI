# Testing Guide for QuantAI

This document outlines the testing strategy and requirements for the QuantAI platform.

## Testing Requirements

- **95%+ test coverage** on all smart contracts
- **Comprehensive unit tests** for core functionality
- **Integration tests** for contract interactions
- **Gas optimization** verification
- **Security validation** through testing

## Running Tests

### Smart Contract Tests

```bash
# Run all tests
npm run test

# Run tests with gas reporting
npm run test:gas

# Run test coverage
npm run test:coverage

# Compile contracts
npm run contracts:compile
```

### Linting and Quality Checks

```bash
# Lint Solidity contracts
npm run lint:sol

# Lint TypeScript/JavaScript
npm run lint:ts

# Fix linting issues
npm run lint:fix

# Type checking
npm run typecheck
```

## Coverage Requirements

The CI pipeline enforces a **95% minimum coverage threshold** for smart contracts:

- **Statements**: 95%+
- **Branches**: 95%+
- **Functions**: 95%+
- **Lines**: 95%+

## Contract Testing Strategy

### QuantToken.sol
- ✅ ERC20 functionality
- ✅ Minting with max supply limits
- ✅ Pausable functionality
- ✅ Trading rewards system
- ✅ Access controls

### AccessRegistry.sol
- ✅ Role-based access control
- ✅ User verification system
- ✅ Suspension management
- ✅ Tier system
- ✅ Trading permissions

### QuantTradeAI.sol
- ✅ Deposit/withdrawal functionality
- ✅ Balance management
- ✅ Event emission
- ✅ Security validations

## Continuous Integration

The CI pipeline automatically:

1. **Compiles** all smart contracts
2. **Lints** Solidity and TypeScript code
3. **Runs** comprehensive test suite
4. **Generates** coverage reports
5. **Validates** 95%+ coverage requirement
6. **Blocks** deployment if tests fail

## Gas Optimization

Tests include gas usage reporting to ensure:
- Efficient contract deployment
- Optimized function calls
- Minimal transaction costs

## Security Testing

- Access control validation
- Input sanitization checks
- Reentrancy protection
- Integer overflow/underflow prevention
- Proper event emission

## Local Development

Before committing code:

```bash
# Full test suite
npm run contracts:compile
npm run test:coverage
npm run lint:sol
npm run typecheck
```

All tests must pass with 95%+ coverage before deployment to production.