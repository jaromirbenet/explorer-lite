import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSolTransactions } from '../useSolTransactions'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

vi.mock('@solana/wallet-adapter-react')

const mockUseWallet = useWallet as ReturnType<typeof vi.fn>
const mockUseConnection = useConnection as ReturnType<typeof vi.fn>

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useTransactions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns undefined when wallet not connected', () => {
    mockUseWallet.mockReturnValue({
      connected: false,
      publicKey: null,
    })
    mockUseConnection.mockReturnValue({
      connection: {},
    })

    const { result } = renderHook(() => useSolTransactions(), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toBeUndefined()
  })

  it('fetches transactions when connected', async () => {
    const mockTxs = [
      { signature: 'sig1', blockTime: 1234567890, err: null },
      { signature: 'sig2', blockTime: 1234567891, err: null },
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

    const { result } = renderHook(() => useSolTransactions(2), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data?.length).toBe(2)
    })

    expect(result.current.data?.[0].signature).toBe('sig1')
  })

  it('handles failed transactions', async () => {
    const mockTxs = [
      { signature: 'sig1', blockTime: 1234567890, err: { InstructionError: [0] } },
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

    const { result } = renderHook(() => useSolTransactions(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data?.length).toBe(1)
    })

    expect(result.current.data?.[0].type).toBe('Failed')
  })
})
