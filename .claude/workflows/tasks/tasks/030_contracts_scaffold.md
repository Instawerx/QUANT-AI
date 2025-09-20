Agent: solidity
Stack: Hardhat + TypeScript + OpenZeppelin.
Steps:
- Init Hardhat, ts-node, chai/ethers, dotenv; configure networks (Anvil/Hardhat local, Sepolia testnet).
- Add QuantToken.sol (ERC20, Ownable, Pausable) and AccessRegistry.sol (RBAC).
- Write deployment scripts (deploy.ts, verify.ts).
- Include coverage + gas-reporter.

Acceptance:
- `pnpm test` passing; local anvil deploy works; Sepolia dry-run documented.
