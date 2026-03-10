import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TransactionsList from '../TransactionsList'
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

describe('TransactionsList Component', () => {
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

    renderWithProviders(<TransactionsList />)

    expect(
      screen.getByText('Connect your wallet to view transactions')
    ).toBeInTheDocument()
  })

  it('displays transactions list when wallet is connected', async () => {
    const mockTxs = [
      {
        signature: 'tx1234567890',
        blockTime: 1234567890,
        err: null,
      },
    ]

    mockUseWallet.mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'mock-address' },
    })
    mockUseConnection.mockReturnValue({
      connection: {
        getSignaturesForAddress: vi.fn().mockResolvedValue(mockTxs),
      },
    })

    renderWithProviders(<TransactionsList />)

    const table = await screen.findByTestId('transactions-table')
    expect(table).toBeInTheDocument()
  })

  it('handles failed transactions correctly', async () => {
    const mockTxs = [
      {
        signature: 'tx1234567890',
        blockTime: 1234567890,
        err: { InstructionError: [0] },
      },
    ]

    mockUseWallet.mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'mock-address' },
    })
    mockUseConnection.mockReturnValue({
      connection: {
        getSignaturesForAddress: vi.fn().mockResolvedValue(mockTxs),
      },
    })

    renderWithProviders(<TransactionsList />)

    const table = await screen.findByTestId('transactions-table')
    expect(table).toBeInTheDocument()
    expect(table).toHaveTextContent('Failed')
  })
})
