# Quick Resume Guide - Implementation Commands

## Immediate Next Steps

### 1. Create Contract Approval Modal (5 mins)
```bash
# Create the modal component (already have the code ready)
# File: src/components/modals/ContractApprovalModal.tsx
```

### 2. Update Wallet Button (3 mins)
```bash
# Update: src/components/connect-wallet-button.tsx
# Add: import ContractApprovalModal
# Add: Modal state and trigger after successful connection
```

### 3. Create Spin Popup (5 mins)
```bash
# Create: src/components/popups/SpinPromoPopup.tsx
# Features: 15s delay, session storage, dismissible
```

### 4. Add Popup to Layout (2 mins)
```bash
# Update: src/app/layout.tsx
# Import and add SpinPromoPopup component
```

### 5. Create Pages in Batches

#### HIGH Priority (Create these first - 30 mins)
```bash
src/app/portfolio/page.tsx
src/app/trading/page.tsx
src/app/settings/page.tsx
src/app/features/page.tsx
src/app/pricing/page.tsx
```

#### MEDIUM Priority (30 mins)
```bash
src/app/privacy/page.tsx
src/app/terms/page.tsx
src/app/help/page.tsx
src/app/contact/page.tsx
src/app/about/page.tsx
src/app/api/page.tsx
src/app/docs/page.tsx
src/app/security/page.tsx
```

#### LOW Priority (20 mins)
```bash
src/app/blog/page.tsx
src/app/careers/page.tsx
src/app/risk/page.tsx
src/app/compliance/page.tsx
src/app/community/page.tsx
src/app/status/page.tsx
```

### 6. Update Navigation (15 mins)
```bash
# Update: src/components/layout/AppHeader.tsx
# - Add user menu dropdown
# - Add all navigation links
# - Add Spin to Win link

# Update: src/components/layout/AppFooter.tsx
# - Fix all footer links to actual pages
```

### 7. Build & Deploy (10 mins)
```bash
rm -rf .next out
npm run build
firebase deploy --only hosting
```

## Code Templates Ready

### Standard Page Template
```tsx
'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PageName() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Page content */}
      </main>
      <AppFooter />
    </div>
  );
}
```

### Contract Approval Integration
```tsx
// In ConnectWalletButton after successful connection:
setAccount(accounts[0]);
setShowApprovalModal(true); // Trigger modal
```

### Spin Popup Integration
```tsx
// In layout.tsx:
<SpinPromoPopup />
```

## Testing Checklist

### After Each Phase
- [ ] Build succeeds without errors
- [ ] All routes accessible (no 404s)
- [ ] Navigation links work
- [ ] Mobile responsive
- [ ] Wallet connection works
- [ ] Contract approval appears
- [ ] Spin popup appears after 15s
- [ ] Popup shows once per session

## Firebase Deployment
```bash
# Current project
Project ID: studio-5150539807-1dba3
URL: https://studio-5150539807-1dba3.web.app

# Deploy command
firebase deploy --only hosting
```

## Critical Environment
```bash
Working Dir: C:\QuantAI
Node: Latest
Next.js: 15.3.3
React: 18
Output: export (static)
```

## If Terminal Freezes Again
1. Read CURRENT_SESSION_STATE.md
2. Check last completed task in todos
3. Continue from "Next Immediate Actions"
4. Use this guide for quick commands
