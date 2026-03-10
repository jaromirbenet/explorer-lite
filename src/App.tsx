import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Box, Container, VStack } from '@chakra-ui/react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'
import { Header } from './components/Header'
import { AccountInfo } from './components/AccountInfo'
import { TransactionsList } from './components/TransactionsList'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const AppContent = () => {
  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <Header />
      <Container maxW="container.lg" py={8}>
        <VStack gap={8}>
          <AccountInfo />
          <TransactionsList />
        </VStack>
      </Container>
    </Box>
  )
}

export const App = () => {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
