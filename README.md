# Explorer Lite - Solana Wallet Hub

A modern web application for connecting Phantom wallet to Solana blockchain, displaying account balance and recent transactions. The application is covered with unit tests (Vitest) and E2E tests (Cypress). Built with a focus on clean, component-driven architecture and granular UI composition.

## 🚀 Features

- ✅ Phantom wallet connection
- ✅ Display wallet address and account balance (in SOL)
- ✅ Display list of last 10 transactions
- ✅ Modern UI with Chakra UI
- ✅ Comprehensive unit and E2E tests
- ✅ TypeScript for type-safety
- ✅ React Query for server state management with automatic caching
- ✅ Granular component architecture (no ternary operators in JSX)
- ✅ Custom branding with Explorer Lite identity

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

Run comprehensive test suite:

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

### Unit Tests
- **AccountInfo**: Test state handling and data display
- **Header**: Test rendering and component integration
- **TransactionsList**: Test state handling and error conditions
- **useAccountInfo**: Test hook behavior and error handling
- **useTransactions**: Test hook behavior, data transformation, and error handling

Tests use QueryClientProvider wrapper for React Query hooks and mock Solana wallet hooks for isolation.

### E2E Tests
Cypress tests verify:
- Page load and basic rendering
- Wallet button presence and functionality
- Application sections display correctly
- Overall application layout and integration

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx                    # Header with logo and wallet connect button
│   ├── WalletConnectButton.tsx       # Wallet connection component
│   ├── WalletButtonLabel.tsx         # Button label component (if/else logic)
│   ├── AccountInfo.tsx               # Display account information
│   ├── TransactionsList.tsx          # Transaction list container
│   ├── TransactionsContent.tsx       # Transaction content component
│   ├── TransactionDate.tsx           # Date formatting component
│   ├── __tests__/                    # Component unit tests
│   └── ...
├── hooks/
│   ├── useAccountInfo.ts             # Hook for fetching account data with caching
│   ├── useTransactions.ts            # Hook for fetching transactions with caching
│   ├── __tests__/                    # Hook unit tests
│   └── ...
├── assets/
│   └── explorer-logo.svg             # Custom compass logo (Explorer Lite branding)
├── App.tsx                           # Main component with providers
├── main.tsx                          # Entry point
└── ...

public/
├── favicon.svg                       # Custom favicon matching logo design
└── ...

cypress/
├── e2e/
│   └── wallet.cy.ts                  # E2E tests
├── support/
│   └── e2e.ts                        # Cypress support file
└── ...

vitest.config.ts                      # Vitest configuration
cypress.config.ts                     # Cypress configuration
```

## 🎯 Components

### Header
- Displays application title ("Explorer" / "Wallet Hub")
- Shows custom compass logo (Explorer Lite branding)
- Contains WalletConnectButton

### WalletConnectButton
- Button for wallet connection/disconnection
- Delegates label rendering to WalletButtonLabel
- Integrates with Phantom wallet

### WalletButtonLabel
- Renders button label based on connection state
- Uses if/else logic for clarity (Connecting... / Disconnect / Connect Wallet)
- No ternary operators in JSX

### AccountInfo
- Displays connected wallet address
- Shows balance in SOL
- Fetches data via useAccountInfo hook
- Automatic caching: 30s stale time, 60s refetch interval

### TransactionsList
- Container component for transaction list
- Handles loading, error, and empty states
- Delegates content rendering to TransactionsContent

### TransactionsContent
- Displays last 10 transactions
- Shows transaction signature, type, and timestamp
- Delegates date rendering to TransactionDate
- Uses if/else logic for empty state

### TransactionDate
- Formats transaction timestamps
- Uses if/else logic to handle null timestamps
- No ternary operators in JSX

## 🧬 Custom Hooks

### useAccountInfo
- Fetches SOL balance for connected wallet
- Uses React Query for caching and automatic refetching
- Caching: 30s stale time, 60s refetch interval
- Returns: `{ data: { address: string, balance: number }, isLoading, error, isError }`

### useTransactions
- Fetches transaction history for connected wallet
- Transforms blockchain signatures into readable Transaction objects
- Caching: 30s stale time, 120s refetch interval
- Returns: `{ data: Transaction[], isLoading, error, isError }`

## 🏗️ Architecture: Granular Component Design

The project follows a **granular component architecture** where complex logic is extracted into dedicated child components. This approach improves readability, testability, and maintainability:

- **No ternary operators in JSX**: All conditional rendering uses dedicated components with `if/else` statements
- **Single Responsibility**: Each component has one clear purpose
- **Easy Testing**: Smaller components are easier to test in isolation
- **Clear Logic Flow**: If/else statements are more explicit than ternary operators

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

