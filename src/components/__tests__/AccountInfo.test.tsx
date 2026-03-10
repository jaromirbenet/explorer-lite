import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AccountInfo } from '../AccountInfo'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

vi.mock('@solana/wallet-adapter-react')

const mockUseWallet = useWallet as ReturnType<typeof vi.fn>
const mockUseConnection = useConnection as ReturnType<typeof vi.fn>

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('AccountInfo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders disconnect message when wallet not connected', () => {
    mockUseWallet.mockReturnValue({
      connected: false,
      publicKey: null,
    })
    mockUseConnection.mockReturnValue({
      connection: {},
    })

    renderWithProviders(<AccountInfo />)

    expect(
      screen.getByText('Connect your wallet to view account information')
    ).toBeInTheDocument()
  })

  it('displays account information when wallet is connected', async () => {
    mockUseWallet.mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'mock-address' },
    })
    mockUseConnection.mockReturnValue({
      connection: {
        getBalance: vi.fn().mockResolvedValue(10000000), // 0.01 SOL
      },
    })

    renderWithProviders(<AccountInfo />)

    const address = await screen.findByTestId('account-address')
    expect(address).toBeInTheDocument()
    expect(address).toHaveTextContent('mock-address')

    const balance = await screen.findByTestId('account-balance')
    expect(balance).toHaveTextContent('0.01')
  })
})
