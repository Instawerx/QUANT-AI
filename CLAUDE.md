# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Next.js Frontend
- `npm run dev` - Start development server with Turbopack on port 9002
- `npm run build` - Build the Next.js application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler checks

### Genkit AI Integration
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching

### Smart Contract Development
- `npx hardhat compile` - Compile Solidity contracts
- `npx hardhat test` - Run contract tests
- `npx hardhat node` - Start local Hardhat network
- `npx hardhat run scripts/deploy.ts --network hardhat` - Deploy to local network

## Project Architecture

### Frontend Structure
- **Next.js 15.3.3** with App Router architecture
- **TypeScript** with strict mode enabled
- **Tailwind CSS** with shadcn/ui components for styling
- **React 18** with functional components and hooks
- **Genkit AI** integration using Google's Gemini 2.5 Flash model

### Key Frontend Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components
- `src/components/ui/` - shadcn/ui component library
- `src/ai/` - Genkit AI flows and configuration
- `src/context/` - React context providers (wallet management)
- `src/lib/` - Utility functions and services
- `src/hooks/` - Custom React hooks

### Smart Contract Architecture
- **Hardhat** development environment with TypeScript
- **Solidity 0.8.20** with optimizer enabled
- Single main contract: `QuantTradeAI.sol` - handles user deposits/withdrawals
- Test suite using Chai and Hardhat testing framework

### AI Integration
- Genkit configuration in `src/ai/genkit.ts` using Google AI
- AI flows for content generation:
  - Chatbot conversations
  - Trading account data simulation
  - User testimonials generation
  - Marketing content creation

### Component Architecture
- shadcn/ui design system with Radix UI primitives
- Custom fonts: Inter (body), Space Grotesk (headlines)
- Responsive design with mobile-first approach
- Dark mode support configured

### Wallet Integration
- Basic wallet context in `src/context/wallet-context.tsx`
- Connect wallet functionality (implementation in progress)
- Smart contract interaction ready

## Important Configuration Notes

- **Port**: Development server runs on port 9002
- **TypeScript**: Build errors are ignored in Next.js config for development
- **ESLint**: Disabled during builds for faster iteration
- **Hardhat Network**: Local development on chain ID 1337
- **AI Model**: Uses Gemini 2.5 Flash for cost-effectiveness

## Testing
- Frontend: No test framework currently configured
- Smart Contracts: Comprehensive test suite in `test/QuantTradeAI.test.ts`
- Run contract tests with `npx hardhat test`

## Environment Setup
- Requires `.env` file for configuration
- Firebase integration configured (`.firebaserc` present)
- Google AI API key required for Genkit functionality