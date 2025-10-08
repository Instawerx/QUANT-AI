# Quick Start: Mission Contribution Flow

## ✅ Configuration Complete!

Your QuantMissionAI contracts have been deployed and configured:

### Deployed Contract Addresses

- **Polygon Mainnet**: `0x1D9D5E1e4627578eea3Ee427e139Af648cdd4cF3`
- **BSC Mainnet**: `0x6C61ffa61b118eE26172D491eade295dd83f7450`
- **Agreement Hash**: `0x18de0bfdb189cd36e2ee6e9f5085a9bdcf18ca64b8c8e3a749b6ec8ac60ecb1d`

### Deployment Details

- **Deployed**: October 6, 2025 (2 days ago)
- **Polygon Block**: 77323207
- **BSC Block**: 63652760
- **Agreement**: Already registered in both contracts ✅

## 🚀 How to Run

### 1. Get Your WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID

### 2. Update Environment Variables

Edit `.env.local` and add your WalletConnect Project ID:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

The contract addresses are already configured with fallback values:
- ✅ Polygon: `0x1D9D5E1e4627578eea3Ee427e139Af648cdd4cF3`
- ✅ BSC: `0x6C61ffa61b118eE26172D491eade295dd83f7450`
- ✅ Agreement Hash: `0x18de0bfdb189cd36e2ee6e9f5085a9bdcf18ca64b8c8e3a749b6ec8ac60ecb1d`

### 3. Start the Development Server

```bash
npm run dev
```

Visit: `http://localhost:9002`

### 4. Test the Flow

1. Click "Start Free Trial - 30 Days" button
2. Connect your wallet (MetaMask recommended)
3. **Switch to Polygon or BSC network** (contract is deployed there)
4. Select a mission type:
   - AI Development
   - Research & Innovation
   - Platform Operations
5. Accept terms and approve transaction
6. Contribute 0.01 ETH (+ gas fees)
7. Success! Trial activated

## 🔗 Supported Networks

The contract is deployed on:

### Primary Networks (Production)
- **Polygon** (Chain ID: 137)
  - Native token: MATIC
  - Contract: `0x1D9D5E1e4627578eea3Ee427e139Af648cdd4cF3`

- **BSC** (Binance Smart Chain) (Chain ID: 56)
  - Native token: BNB
  - Contract: `0x6C61ffa61b118eE26172D491eade295dd83f7450`

### Testnet (For Development)
- Hardhat Local (Chain ID: 31337)
  - For local testing only

## 💰 Contribution Requirements

- **Minimum**: 0.01 ETH equivalent (in MATIC or BNB)
- **Maximum**: 100 ETH equivalent
- **Gas Buffer**: 1% kept in contract
- **Treasury**: 99% sent immediately to treasury wallet

### Cost Estimates

**On Polygon:**
- Contribution: 0.01 MATIC (~$0.01 USD)
- Gas fees: ~0.001 MATIC (~$0.001 USD)
- **Total: ~$0.011 USD**

**On BSC:**
- Contribution: 0.01 BNB (~$6 USD at current prices)
- Gas fees: ~0.0001 BNB (~$0.06 USD)
- **Total: ~$6.06 USD**

**Recommendation**: Use Polygon for testing (much cheaper!)

## 🎯 User Flow Checklist

- [x] ✅ All CTA buttons updated to use MissionContributionFlow
- [x] ✅ Contract addresses configured
- [x] ✅ Agreement hash registered in contracts
- [x] ✅ Polygon and BSC chains supported
- [x] ✅ Wallet connection integrated
- [ ] ⏳ WalletConnect Project ID configured (you need to add this)

## 🛠️ Troubleshooting

### "Wrong Network" Error

**Solution**: The contract is only on Polygon and BSC. Switch networks in your wallet:
- MetaMask: Click network dropdown → Select Polygon/BSC
- If network not available, add it manually:
  - **Polygon**: https://chainlist.org/chain/137
  - **BSC**: https://chainlist.org/chain/56

### "Contract Not Available"

**Cause**: You're on a network where the contract isn't deployed.

**Solution**: Switch to Polygon or BSC network in your wallet.

### "Agreement Not Valid"

**Cause**: This shouldn't happen - agreement hash is pre-configured.

**Solution**: Check that `NEXT_PUBLIC_AGREEMENT_HASH` in `.env.local` matches:
```
0x18de0bfdb189cd36e2ee6e9f5085a9bdcf18ca64b8c8e3a749b6ec8ac60ecb1d
```

### "Insufficient Funds"

**Solution**: You need:
- **On Polygon**: ~0.012 MATIC (contribution + gas)
- **On BSC**: ~0.011 BNB (contribution + gas)

Get test tokens:
- **Polygon MATIC**: Buy on exchange or use [Polygon Faucet](https://faucet.polygon.technology/)
- **BSC BNB**: Buy on exchange

## 📊 Verify Your Deployment

### Check on Block Explorers

**Polygon:**
```
https://polygonscan.com/address/0x1D9D5E1e4627578eea3Ee427e139Af648cdd4cF3
```

**BSC:**
```
https://bscscan.com/address/0x6C61ffa61b118eE26172D491eade295dd83f7450
```

### Read Contract Functions

You can verify the contract is working by calling read functions:

1. Go to the block explorer
2. Click "Contract" tab
3. Click "Read Contract"
4. Try these functions:
   - `getAvailableMissions()` - Should show mission types
   - `getPlatformMetrics()` - Shows total contributions
   - `treasuryConfig()` - Shows treasury wallet address

## 🎉 What Happens After Contribution

1. ✅ User sends 0.01 ETH (MATIC/BNB)
2. ✅ Contract calculates gas buffer (1%)
3. ✅ 99% sent immediately to treasury: `0x7903c63CB9f42284d03BC2a124474760f9C1390b`
4. ✅ User contribution recorded on blockchain
5. ✅ 30-day trial activated
6. ✅ Success modal displayed
7. ✅ User can start trading

## 📝 Next Steps

1. **Add WalletConnect Project ID** to `.env.local`
2. **Test on Polygon** (cheaper gas fees)
3. **Monitor transactions** on PolygonScan/BSCScan
4. **Track metrics** using contract read functions
5. **Add analytics** to track conversion rates

## 🔐 Security Notes

- ✅ Agreement hash is pre-registered in contracts
- ✅ Funds go directly to treasury (institutional control)
- ✅ Contract is pausable for emergencies
- ✅ Owner controls (you) can manage settings
- ✅ Contribution limits enforced (0.01 - 100 ETH)

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify you're on Polygon or BSC network
3. Ensure you have enough native tokens
4. Check block explorer for transaction status
5. Review this guide's troubleshooting section

---

**Status**: ✅ Ready to Test
**Network**: Polygon (recommended) or BSC
**Cost**: ~$0.011 USD on Polygon
**Time to Complete**: ~2 minutes

Enjoy your new mission contribution flow! 🚀
