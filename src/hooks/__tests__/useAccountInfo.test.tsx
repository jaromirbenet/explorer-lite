import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccountInfo } from '../useAccountInfo'
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

describe('useAccountInfo Hook', () => {
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

    const { result } = renderHook(() => useAccountInfo(), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toBeUndefined()
  })

  it('fetches account data when connected', async () => {
    mockUseWallet.mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'mock-address' },
    })
    mockUseConnection.mockReturnValue({
      connection: {
        getBalance: vi.fn().mockResolvedValue(10000000), // 0.01 SOL in lamports
      },
    })

    const { result } = renderHook(() => useAccountInfo(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    expect(result.current.data?.balance).toBe(0.01)
  })

  it('handles error gracefully', async () => {
    mockUseWallet.mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'mock-address' },
    })
    mockUseConnection.mockReturnValue({
      connection: {
        getBalance: vi.fn().mockRejectedValue(new Error('Network error')),
      },
    })

    const { result } = renderHook(() => useAccountInfo(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    }, { timeout: 3000 })
  })
})
