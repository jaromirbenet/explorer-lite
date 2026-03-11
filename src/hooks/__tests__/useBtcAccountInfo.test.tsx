import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBtcAccountInfo } from '../useBtcAccountInfo'
import { useBitcoin } from '../../contexts/BitcoinContext'

vi.mock('../../contexts/BitcoinContext')

const mockUseBitcoin = useBitcoin as ReturnType<typeof vi.fn>

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useBtcAccountInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('is disabled and returns no data when no BTC address', () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: null })
    const { result } = renderHook(() => useBtcAccountInfo(), { wrapper: createWrapper() })
    expect(result.current.data).toBeUndefined()
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches and calculates balance correctly', async () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: 'bc1qtest' })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        chain_stats: {
          funded_txo_sum: 150000000, // 1.5 BTC in sats
          spent_txo_sum:   50000000, // 0.5 BTC in sats
          tx_count: 5,
        },
      }),
    })

    const { result } = renderHook(() => useBtcAccountInfo(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())

    expect(result.current.data?.balance).toBe(1)      // 1.5 - 0.5 = 1 BTC
    expect(result.current.data?.txCount).toBe(5)
    expect(result.current.data?.address).toBe('bc1qtest')
  })

  it('returns zero balance when funded equals spent', async () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: 'bc1qtest' })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        chain_stats: { funded_txo_sum: 10000000, spent_txo_sum: 10000000, tx_count: 2 },
      }),
    })

    const { result } = renderHook(() => useBtcAccountInfo(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.balance).toBe(0)
  })

  it('throws on API error', async () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: 'bc1qtest' })
    global.fetch = vi.fn().mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useBtcAccountInfo(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('throws on network failure', async () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: 'bc1qtest' })
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useBtcAccountInfo(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
