# Phantom Wallet Explorer dApp

A modern web application for connecting Phantom wallet to Solana blockchain, displaying account balance and recent transactions. The application is covered with unit tests (Vitest) and E2E tests (Cypress).

## 🚀 Features

- ✅ Phantom wallet connection
- ✅ Display wallet address and account balance (in SOL)
- ✅ Display list of last 10 transactions
- ✅ Modern UI with Chakra UI
- ✅ Unit tests for components
- ✅ E2E tests with Cypress
- ✅ TypeScript for type-safety
- ✅ React Query for server state management with automatic caching

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Chakra UI v2
- **State Management**: React Query (TanStack Query)
- **Wallet Integration**: Solana Wallet Adapter + Phantom
- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Cypress
- **Blockchain**: Solana Web3.js

## 📦 Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run preview of production build
npm run preview
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run unit tests with UI
npm run test:ui

# Run coverage
npm run test:coverage

# Open Cypress tester
npm run cy:open

# Run Cypress tests in CLI
npm run cy:run
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Header with wallet connect button
│   ├── WalletConnectButton.tsx # Wallet connection component
│   ├── AccountInfo.tsx         # Display account information
│   ├── TransactionsList.tsx    # Transaction list
│   └── __tests__/              # Component unit tests
├── hooks/
│   ├── useAccountInfo.ts       # Hook for fetching account data
│   └── useTransactions.ts      # Hook for fetching transactions
├── App.tsx                     # Main component
├── main.tsx                    # Entry point
└── test/
    └── setup.ts                # Vitest configuration

cypress/
├── e2e/
│   └── wallet.cy.ts           # E2E tests
├── support/
│   └── e2e.ts                 # Cypress support file

vitest.config.ts               # Vitest configuration
cypress.config.ts              # Cypress configuration
```

## 🎯 Components

### Header
- Displays application title
- Contains WalletConnectButton

### WalletConnectButton
- Button for wallet connection/disconnection
- Displays connection status (Connecting..., Disconnect, Connect Wallet)
- Integrates with Phantom wallet

### AccountInfo
- Displays connected wallet address
- Shows balance in SOL
- Fetches data from Solana blockchain via useAccountInfo hook
- Automatic caching with 30s stale time and 60s refetch interval

### TransactionsList
- Displays last 10 transactions
- Shows transaction signature, type, and timestamp
- Includes error handling
- Fetches data from Solana blockchain via useTransactions hook
- Automatic caching with 30s stale time and 120s refetch interval

## 🧬 Custom Hooks

### useAccountInfo
- Fetches SOL balance for connected wallet
- Uses React Query for caching and automatic refetching
- Returns: `{ data, isLoading, error, isError }`

### useTransactions
- Fetches transaction history for connected wallet
- Transforms blockchain signatures into readable Transaction objects
- Uses React Query for caching and automatic refetching
- Returns: `{ data, isLoading, error, isError }`

## 🧬 Unit Tests

Tests included for:
- **AccountInfo**: Test disconnected state, loading state, and data display
- **Header**: Test rendering of title and button
- **TransactionsList**: Test disconnected state, loading state, and data display
- **useAccountInfo**: Test hook behavior with and without connected wallet
- **useTransactions**: Test hook behavior, transaction mapping, and error handling

Tests mock Solana wallet hooks for isolated testing with QueryClientProvider wrapper.

## 🎭 E2E Tests

Cypress tests verify:
- Successful page load
- Presence of connect wallet button
- Correct display of sections (Account Info, Transactions)
- Correct application layout
- Proper wallet connection/disconnection functionality

## 🔗 Solana Network

The application uses **Devnet** by default for development. To switch to Mainnet-beta:

```typescript
// in App.tsx
const network = WalletAdapterNetwork.Mainnet
```

## 📚 Additional Resources

- [Chakra UI Docs](https://chakra-ui.com)
- [React Query Docs](https://tanstack.com/query/latest)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Vitest Docs](https://vitest.dev)
- [Cypress Docs](https://docs.cypress.io)

## 📝 License

MIT

