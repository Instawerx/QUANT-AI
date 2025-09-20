Agent: web

Steps:
- Add MetaMask connection using ethers v6 BrowserProvider.
- Create a `Wallet.tsx` page with connect/disconnect functionality and display the user's address and token balance.
- Provide helper functions to interact with the `QuantToken` and `AccessRegistry` contracts.
- Persist the user profile and wallet address in Firestore using proper security rules.

Acceptance:
- User can successfully connect and disconnect MetaMask on the Sepolia network.
- The wallet page displays the correct token balance and allows sending a test transaction.
