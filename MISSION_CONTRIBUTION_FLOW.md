# Mission Contribution Flow - Implementation Guide

## Overview

The Mission Contribution Flow is a unified wallet connection and contract approval system that replaces the previous signup flow. All "Start Free Trial" buttons now follow the same user journey:

**Connect Wallet → Select Mission → Approve Agreement → Contribute to Mission → Start Trial**

## What Changed

### ✅ Completed Updates

1. **Created New Components:**
   - `src/components/mission/MissionContributionFlow.tsx` - Main flow component
   - `src/hooks/useQuantMissionContract.ts` - Contract hook for QuantMissionAI

2. **Updated All CTA Buttons:**
   - ✅ `src/components/marketing/MarketingBanner.tsx` (3 instances)
   - ✅ `src/app/page.tsx` (homepage final CTA)
   - ✅ `src/components/trial/FreeTrialSignup.tsx`

3. **Updated Contract Configuration:**
   - ✅ Added QUANT_MISSION to `src/lib/web3/config.ts`

4. **Wallet Connect in Header:**
   - ✅ Already exists in `src/components/layout/AppHeader.tsx` (lines 114-115)

### 🔄 User Flow

```
1. User clicks "Start Free Trial" button
   ↓
2. Modal opens → Connect Wallet step
   - Shows benefits of trial
   - Connect Wallet button
   ↓
3. Wallet connects successfully
   ↓
4. Select Mission step
   - Choose from: AI Development, Research & Innovation, Platform Operations
   - Select preferred mission area
   ↓
5. Agreement step
   - Review mission terms
   - Contribution: 0.01 ETH
   - Accept terms checkbox
   ↓
6. Approve & Contribute
   - Wallet prompts for transaction approval
   - Calls: confirmMissionAndContribute(missionType, agreementHash)
   - Sends 0.01 ETH
   ↓
7. Success
   - 30-day trial activated
   - Welcome message
   - Redirect to trading dashboard
```

## Smart Contract Integration

### QuantMissionAI.sol

The contract requires:
- **Minimum contribution:** 0.01 ETH (approximately $20-30 USD)
- **Maximum contribution:** 100 ETH
- **Valid agreement hash:** Must be registered by contract owner

### Key Functions Used

```solidity
function confirmMissionAndContribute(
    string memory missionType,
    bytes32 agreementHash
) external payable
```

### Available Mission Types

As defined in the contract constructor:
1. `"AI Development"` - Support AI model training
2. `"Research & Innovation"` - Fund trading research
3. `"Platform Operations"` - Maintain infrastructure
4. `"Community Growth"` - (available in contract)
5. `"Security & Audits"` - (available in contract)

## Environment Variables Needed

Add these to your `.env.local`:

```bash
# WalletConnect Project ID (required for WalletConnect)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Infura API Key (for Ethereum RPC)
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key_here

# QuantMissionAI Contract Addresses
NEXT_PUBLIC_QUANT_MISSION_MAINNET=0x...  # Mainnet address
NEXT_PUBLIC_QUANT_MISSION_SEPOLIA=0x...  # Sepolia testnet address
```

## Deployment Checklist

### 1. Deploy QuantMissionAI Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy to network
npx hardhat run scripts/deploy-mission.ts --network sepolia
```

### 2. Register Agreement Hashes

The contract owner must register agreement hashes before users can contribute:

```javascript
// Example: Register default agreement
const agreementHash = '0x0000000000000000000000000000000000000000000000000000000000000001';
await quantMissionContract.registerAgreement(agreementHash);
```

### 3. Update Environment Variables

```bash
# Add deployed contract address
NEXT_PUBLIC_QUANT_MISSION_SEPOLIA=0xYourDeployedAddress
```

### 4. Test the Flow

1. Visit homepage: `http://localhost:9002`
2. Click "Start Free Trial - 30 Days"
3. Connect wallet (MetaMask/Coinbase/WalletConnect)
4. Select a mission
5. Accept terms
6. Approve transaction in wallet
7. Verify success modal appears

## Component Usage

### Basic Usage

```tsx
import { MissionContributionFlow } from '@/components/mission/MissionContributionFlow';

<MissionContributionFlow
  buttonText="Start Free Trial"
  buttonSize="lg"
  buttonClassName="bg-purple-600 text-white"
  showIcon={true}
  onComplete={() => console.log('Trial started!')}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonText` | `string` | `"Start Free Trial - 30 Days"` | Text displayed on button |
| `buttonSize` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'lg'` | Button size |
| `buttonClassName` | `string` | `''` | Additional CSS classes |
| `buttonVariant` | `'default' \| 'outline' \| ...` | `'default'` | Button variant |
| `showIcon` | `boolean` | `true` | Show Zap icon |
| `onComplete` | `() => void` | `undefined` | Callback after successful contribution |

## Contract Interaction Details

### Reading from Contract

```typescript
const { readContract } = useQuantMissionContract();

// Check if user has contributed
const hasContributed = await readContract.read.hasUserContributed([userAddress]);

// Get user's total contribution
const totalContribution = await readContract.read.getUserTotalContribution([userAddress]);

// Get platform metrics
const metrics = await readContract.read.getPlatformMetrics();
```

### Writing to Contract

```typescript
const { writeContract } = useQuantMissionContract();

// Contribute to mission
const tx = await writeContract.write.confirmMissionAndContribute(
  ['AI Development', agreementHash],
  { value: parseEther('0.01') }
);
```

## Error Handling

The component handles these error cases:

1. **Wallet not installed** - Prompts to install MetaMask
2. **User rejects transaction** - Shows friendly error
3. **Insufficient funds** - Alerts user needs 0.01 ETH
4. **Invalid agreement** - Backend must register agreement first
5. **Network mismatch** - Prompts to switch to correct network

## Security Considerations

### Agreement Hash System

- Each contribution requires a valid `agreementHash`
- Hashes must be pre-registered by contract owner
- Current implementation uses a default hash: `0x00...01`
- **Production:** Implement backend to:
  1. Generate unique agreement hash per user
  2. Register hash with contract
  3. Return hash to frontend
  4. User submits contribution with their hash

### Fund Flow

1. User sends 0.01 ETH to contract
2. Contract calculates gas buffer (default 1%)
3. Remaining amount (99%) immediately transferred to treasury
4. Gas buffer kept in contract for future operations

## Testing Locally

```bash
# Start local hardhat node
npx hardhat node

# Deploy contract to local network
npx hardhat run scripts/deploy-mission.ts --network hardhat

# Start Next.js dev server
npm run dev

# Visit http://localhost:9002
```

## Next Steps

### Backend Integration (Recommended)

1. Create API endpoint: `POST /api/mission/generate-agreement`
2. Generate unique agreement hash per user
3. Call contract `registerAgreement(hash)` from backend
4. Return hash to frontend
5. Frontend uses returned hash in contribution

### Analytics Integration

Track these events:
- `mission_flow_started` - User opens modal
- `wallet_connected` - Wallet successfully connected
- `mission_selected` - User selects mission type
- `agreement_accepted` - User accepts terms
- `contribution_submitted` - Transaction sent
- `contribution_completed` - Transaction confirmed
- `trial_activated` - Trial successfully started

### Future Enhancements

1. **Email Collection** - Optional email for updates
2. **Referral Codes** - Earn bonus trial days
3. **Multiple Payment Options** - USDC, USDT support
4. **Subscription Management** - Auto-renew after trial
5. **Mission Progress Tracking** - Show mission funding stats

## Troubleshooting

### "Contract not available" error
- Check contract is deployed to current network
- Verify environment variables are set
- Ensure wallet is connected to correct network

### Transaction fails silently
- Check browser console for errors
- Verify user has sufficient ETH (0.01 + gas fees)
- Ensure agreement hash is registered

### Modal doesn't open
- Check React DevTools for component mounting
- Verify button click handler is attached
- Check for JavaScript console errors

## Support

For issues or questions:
1. Check browser console for errors
2. Review Hardhat deployment logs
3. Verify contract on block explorer
4. Test with Sepolia testnet first

## Files Modified

```
✅ src/components/mission/MissionContributionFlow.tsx (new)
✅ src/hooks/useQuantMissionContract.ts (new)
✅ src/components/mission/index.ts (new)
✅ src/components/marketing/MarketingBanner.tsx (updated)
✅ src/app/page.tsx (updated)
✅ src/components/trial/FreeTrialSignup.tsx (updated)
✅ src/lib/web3/config.ts (updated)
```

## Contract Address Configuration

Current addresses (update after deployment):

| Network | Contract Address |
|---------|-----------------|
| Mainnet | TBD - Set in `.env` |
| Sepolia | TBD - Set in `.env` |
| Hardhat | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |

---

**Status:** ✅ Implementation Complete
**Last Updated:** October 7, 2025
**Version:** 1.0.0
