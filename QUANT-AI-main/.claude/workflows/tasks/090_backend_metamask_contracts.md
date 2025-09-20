Agent: web
Goal: Build out backend and integrate MetaMask and contract interactions.

Steps:
- Set up a Node.js backend (Express) to serve as API for the Mission Control platform. Use TypeScript and Firebase Admin SDK to interact with Firestore. The API should handle user authentication (e.g., via MetaMask signature) and provide endpoints for interacting with the smart contracts (e.g., deposit tokens, deposit ETH, withdraw, and get balances). This API will serve as the backend for the front-end interface.
- Integrate the MetaMaskPortfolioManager.sol contract: create a service or helper in the backend that uses ethers.js to connect to the contract on the configured network (e.g., Sepolia). The contract address and supported token addresses should be read from environment variables; document that the user must replace these placeholders with their actual addresses before deployment.
- Expose API endpoints that call contract functions (depositTokens, depositETH, withdrawToken, withdrawETH, getUserBalance, etc.) and update Firestore accordingly.
- Write comprehensive unit tests for the API endpoints and contract interactions using a local Hardhat network and test accounts. Tests must assert that deposits and withdrawals behave correctly and that Firestore records update accordingly.
- Document the environment variables required (e.g., CONTRACT_ADDRESS, SUPPORTED_TOKENS, NETWORK_RPC_URL, PRIVATE_KEY) and instruct that the user must supply real values for deployment.
- After development and testing, create a deployment script for the backend to deploy as a Cloud Run service using Cloud Build (refer to previous tasks for infrastructure setup). Ensure that environment variables and secrets are securely provided via Secret Manager and not committed to the repository.

Acceptance:
- The backend builds and runs locally with `pnpm dev` and passes all tests.
- The API endpoints successfully interact with the MetaMaskPortfolioManager contract on a test network and update Firestore.
- Deployment instructions are clear with placeholders for addresses and keys.
