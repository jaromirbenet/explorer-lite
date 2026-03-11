import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { WagmiProvider } from 'wagmi'
import { BitcoinProvider } from './contexts/BitcoinContext'
import { AppContent } from './components/layout/AppContent'
import { wagmiConfig } from './wagmiConfig'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const App = () => {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <QueryClientProvider client={queryClient}>
              <BitcoinProvider>
                <AppContent />
              </BitcoinProvider>
            </QueryClientProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </WagmiProvider>
  )
}
