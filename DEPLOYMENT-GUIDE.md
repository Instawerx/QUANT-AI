# QuantAI Smart Contract Deployment Guide

## 🚀 Complete Deployment Workflow

This guide provides comprehensive instructions for deploying the QuantAI smart contract platform to production with all necessary configurations, security measures, and automation systems.

## 📋 Prerequisites

### Required Software
- Node.js 18+
- npm or yarn
- Git
- MetaMask or hardware wallet
- Firebase CLI
- Google Cloud CLI (gcloud)

### Required Accounts & Services
- GitHub account with repository access
- Google Cloud Platform account
- Firebase project
- Infura account (for Ethereum RPC)
- Etherscan account (for contract verification)
- MetaMask wallet with sufficient ETH for gas fees

## 🔧 Environment Setup

### 1. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/QuantAI.git
cd QuantAI
npm install
```

### 2. Environment Variables Configuration

#### **CRITICAL**: Update .env file with real values
The `.env` file contains placeholders that MUST be replaced with actual values:

```bash
# Copy the template and fill in real values
cp .env .env.local

# Edit .env.local with your actual values:
```

**Required Environment Variables:**

#### Blockchain Configuration
```env
# Replace with your actual Infura API key
INFURA_API_KEY=your_actual_infura_api_key_here
ALCHEMY_API_KEY=your_actual_alchemy_api_key_here

# Replace with your actual private key (64 characters, no 0x prefix)
PRIVATE_KEY=your_actual_private_key_here

# Replace with your actual wallet addresses
TREASURY_WALLET_ADDRESS=0xYourActualTreasuryWalletAddress
FEE_COLLECTOR_ADDRESS=0xYourActualFeeCollectorAddress
MULTISIG_WALLET_ADDRESS=0xYourActualMultisigWalletAddress
```

#### API Keys
```env
ETHERSCAN_API_KEY=your_actual_etherscan_api_key
GOOGLE_AI_API_KEY=your_actual_google_ai_api_key
COINMARKETCAP_API_KEY=your_actual_coinmarketcap_api_key
```

#### Firebase Configuration
```env
FIREBASE_PROJECT_ID=studio-5150539807-1dba3
FIREBASE_API_KEY=your_actual_firebase_api_key
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/your/service-account-key.json
```

### 3. GitHub Secrets Configuration

Set up the following secrets in your GitHub repository:

#### Go to GitHub Repository → Settings → Secrets and Variables → Actions

**Staging Environment Secrets:**
```
STAGING_DEPLOYER_PRIVATE_KEY=your_staging_deployer_private_key
STAGING_TREASURY_WALLET=your_staging_treasury_wallet_address
STAGING_FEE_COLLECTOR=your_staging_fee_collector_address
FIREBASE_SERVICE_ACCOUNT_STAGING=your_firebase_service_account_json
FIREBASE_PROJECT_ID_STAGING=your_staging_firebase_project_id
```

**Production Environment Secrets:**
```
PRODUCTION_DEPLOYER_PRIVATE_KEY=your_production_deployer_private_key
PRODUCTION_TREASURY_WALLET=your_production_treasury_wallet_address
PRODUCTION_FEE_COLLECTOR=your_production_fee_collector_address
FIREBASE_SERVICE_ACCOUNT_PRODUCTION=your_production_firebase_service_account_json
FIREBASE_PROJECT_ID_PRODUCTION=studio-5150539807-1dba3
PRODUCTION_URL=https://your-production-domain.com
```

**API Keys & Services:**
```
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
CODECOV_TOKEN=your_codecov_token
```

## 🔐 Security Checklist

### Wallet Security
- [ ] Use hardware wallet for mainnet deployments
- [ ] Never commit private keys to version control
- [ ] Use environment variables for all sensitive data
- [ ] Enable 2FA on all accounts
- [ ] Verify wallet addresses multiple times before deployment

### Smart Contract Security
- [ ] All contracts compiled and tested
- [ ] Comprehensive test coverage (>90%)
- [ ] Security audit completed
- [ ] Multi-signature wallets configured for admin functions
- [ ] Emergency pause mechanisms tested

### API Security
- [ ] All API keys properly secured
- [ ] Rate limiting configured
- [ ] HTTPS enforced everywhere
- [ ] Content Security Policy headers set

## 📱 Smart Contract Deployment

### 1. Compile Contracts
```bash
npm run contracts:compile
```

### 2. Run Comprehensive Tests
```bash
npm run test
npm run test:coverage
```

### 3. Deploy to Sepolia Testnet
```bash
# Ensure you have Sepolia ETH for gas fees
npm run contracts:deploy:sepolia
```

### 4. Verify Contracts on Etherscan
```bash
npm run contracts:verify
```

### 5. Deploy to Mainnet (Production)
```bash
# CRITICAL: Double-check all environment variables
npm run contracts:deploy
```

## 🌐 Frontend Deployment

### 1. Build Next.js Application
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to staging
firebase hosting:channel:deploy staging

# Deploy to production
firebase deploy --only hosting
```

## 🤖 Automation Systems

### 1. Trading Automation
```bash
# Start trading automation system
npm run automation:start

# Monitor automation logs
npm run automation:logs
```

### 2. CI/CD Pipeline
The GitHub Actions workflow automatically:
- Runs security audits
- Executes all tests
- Deploys to staging on `develop` branch
- Deploys to production on `main` branch
- Verifies smart contracts
- Performs health checks

## 📊 Post-Deployment Verification

### 1. Smart Contract Verification
```bash
# Verify contract functionality
npm run contracts:health-check

# Check contract balances and state
npm run contracts:status
```

### 2. Frontend Health Check
```bash
# Check frontend deployment
curl -f https://your-domain.com/api/health

# Run performance tests
npm run test:performance
```

### 3. Database Configuration
```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

## 🚨 Emergency Procedures

### Emergency Contract Pause
```bash
# Pause all contract operations
npm run contracts:emergency-pause

# Unpause when safe
npm run contracts:emergency-unpause
```

### Rollback Deployment
```bash
# Rollback Firebase hosting
firebase hosting:clone source-site-id:source-channel-id target-site-id:live

# Rollback to previous contract version (if needed)
npm run contracts:rollback
```

## 📈 Monitoring & Alerts

### Google Cloud Monitoring
- Application performance monitoring enabled
- Error rate alerts configured
- Response time monitoring active
- Custom dashboards for smart contract metrics

### Firebase Analytics
- User engagement tracking
- Performance monitoring
- Crash reporting
- Real-time database monitoring

## 🔄 Maintenance & Updates

### Regular Tasks
1. **Weekly**: Review audit logs and security alerts
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Comprehensive security audit
4. **As needed**: Smart contract upgrades (using proxy patterns)

### Update Deployment
```bash
# For smart contract updates
npm run contracts:upgrade

# For frontend updates
git push origin main  # Triggers automatic deployment
```

## 📞 Support & Troubleshooting

### Common Issues

#### Contract Deployment Fails
- Check gas price and limit settings
- Verify wallet has sufficient ETH balance
- Ensure private key is correctly formatted
- Check network connectivity

#### Frontend Build Fails
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run typecheck`
- Verify environment variables are set

#### Firebase Deployment Issues
- Check Firebase project configuration
- Verify service account permissions
- Ensure build output directory exists

### Getting Help
- Check the GitHub Issues page
- Review deployment logs in Google Cloud Console
- Contact support team with specific error messages
- Use Firebase console for debugging database issues

## ✅ Deployment Completion Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] GitHub secrets properly set
- [ ] Wallet addresses verified
- [ ] Test deployment on staging successful

### Smart Contracts
- [ ] Contracts compiled successfully
- [ ] All tests passing (100%)
- [ ] Deployed to testnet and verified
- [ ] Deployed to mainnet and verified
- [ ] Contract addresses updated in environment

### Frontend
- [ ] Application builds without errors
- [ ] Deployed to Firebase Hosting
- [ ] Domain configured and SSL active
- [ ] Health checks passing

### Infrastructure
- [ ] Firestore rules and indexes deployed
- [ ] Google Cloud monitoring configured
- [ ] CI/CD pipeline functional
- [ ] Automation systems running

### Security
- [ ] Security audit completed
- [ ] Private keys secured
- [ ] Multi-signature wallets configured
- [ ] Emergency procedures tested

### Documentation
- [ ] Deployment documented
- [ ] Team trained on operations
- [ ] Monitoring alerts configured
- [ ] Support procedures established

---

## 🎯 Final Steps

1. **Update contract addresses in .env** after successful deployment
2. **Test all functionality** in production environment
3. **Monitor systems** for first 24 hours
4. **Document any issues** and resolutions
5. **Celebrate successful deployment** 🎉

---

**⚠️ IMPORTANT SECURITY REMINDER**
Never share private keys, API keys, or service account files. Always use environment variables and secure secret management for production deployments.