import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { Header } from '../layout/Header'
import { useWallet } from '@solana/wallet-adapter-react'

vi.mock('@solana/wallet-adapter-react')
vi.mock('../wallet/WalletConnectButton', () => ({
  WalletConnectButton: () => <button>Mock Connect Button</button>,
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({ isConnected: false }),
}))
vi.mock('../../contexts/BitcoinContext', () => ({
  useBitcoin: () => ({ btcAddress: null }),
}))

const mockUseWallet = useWallet as ReturnType<typeof vi.fn>

const renderHeader = () =>
  render(
    <ChakraProvider>
      <Header />
    </ChakraProvider>
  )

describe('Header Component', () => {
  it('renders header with title', () => {
    mockUseWallet.mockReturnValue({ connected: false })
    renderHeader()
    expect(screen.getByText('Explorer')).toBeInTheDocument()
    expect(screen.getByText('Wallet Hub')).toBeInTheDocument()
  })

  it('renders wallet connect button', () => {
    mockUseWallet.mockReturnValue({ connected: false })
    renderHeader()
    expect(screen.getByText('Mock Connect Button')).toBeInTheDocument()
  })
})
