# Explorer Lite

A multi-chain crypto wallet explorer for **Solana**, **Ethereum**, and **Bitcoin**. Connect your wallets to view balances and recent transactions in one place.

## 🚀 Features

- ✅ Multi-chain support — SOL (Solana Wallet Adapter), ETH (wagmi), BTC (Phantom)
- ✅ Balances and recent transactions per chain
- ✅ Animated balance display with chain-specific explorers
- ✅ Centralized Chakra UI theme — colors, layer styles, and text styles in one place
- ✅ React Query for data fetching with automatic caching
- ✅ Comprehensive unit (Vitest) and E2E (Cypress) tests
- ✅ TypeScript throughout

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Chakra UI v2 (custom dark theme)
- **Data fetching**: TanStack Query
- **ETH**: wagmi + viem
- **SOL**: Solana Wallet Adapter
- **BTC**: Phantom Bitcoin provider
- **Unit tests**: Vitest + React Testing Library
- **E2E tests**: Cypress

## 📦 Installation

```bash
npm install
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview production build
```

## 🧪 Testing

```bash
npm test                # run unit tests
npm run test:ui         # Vitest UI
npm run test:coverage   # coverage report
npm run cy:open         # Cypress interactive
npm run cy:run          # Cypress headless
```

Unit tests cover all custom hooks and components. Hooks use a `QueryClientProvider` wrapper and `global.fetch` mocks. Components use `ChakraProvider` with the app theme and `vi.mock` for wallet adapters.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/        # Header, chain status dots, app shell
│   ├── chain-card/    # Per-chain card, address badge, animated balance
│   ├── transactions/  # Transaction list tabs and rows
│   └── wallet/        # Wallet connect button and label
├── contexts/
│   └── BitcoinContext.tsx   # Phantom BTC wallet state
├── hooks/             # Data fetching hooks per chain (SOL/ETH/BTC)
├── theme.ts           # Chakra theme — brand colors, layerStyles, textStyles
├── App.tsx            # Root with all providers
└── main.tsx

cypress/
└── e2e/
    └── wallet.cy.ts   # E2E tests
```

## 📚 Resources

- [Chakra UI](https://chakra-ui.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [wagmi](https://wagmi.sh)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Vitest](https://vitest.dev)
- [Cypress](https://docs.cypress.io)

## 📝 License

MIT

