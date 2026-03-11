import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEthTransactions } from '../useEthTransactions'
import { useConnection } from 'wagmi'

vi.mock('wagmi')

const mockUseConnection = useConnection as ReturnType<typeof vi.fn>

const ETH_ADDRESS = '0xabcdef1234567890'

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useEthTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('is disabled when not connected', () => {
    mockUseConnection.mockReturnValue({ address: null, isConnected: false })
    const { result } = renderHook(() => useEthTransactions(), { wrapper: createWrapper() })
    expect(result.current.data).toBeUndefined()
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches and maps transactions correctly', async () => {
    mockUseConnection.mockReturnValue({ address: ETH_ADDRESS, isConnected: true })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: '1',
        result: [
          {
            hash: '0xtx1',
            timeStamp: '1700000000',
            isError: '0',
            value: String(1e18),
            from: '0xfrom',
            to: '0xto',
          },
          {
            hash: '0xtx2',
            timeStamp: '1700000001',
            isError: '1',
            value: '0',
            from: '0xto',
            to: '0xfrom',
          },
        ],
      }),
    })

    const { result } = renderHook(() => useEthTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data?.length).toBe(2))

    expect(result.current.data![0].hash).toBe('0xtx1')
    expect(result.current.data![0].type).toBe('Success')
    expect(result.current.data![0].timestamp).toBe(1700000000)
    expect(result.current.data![0].from).toBe('0xfrom')

    expect(result.current.data![1].hash).toBe('0xtx2')
    expect(result.current.data![1].type).toBe('Failed')
  })

  it('returns empty array when Etherscan status is not "1"', async () => {
    mockUseConnection.mockReturnValue({ address: ETH_ADDRESS, isConnected: true })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: '0', message: 'No transactions found', result: [] }),
    })

    const { result } = renderHook(() => useEthTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toHaveLength(0)
  })

  it('handles missing timestamp', async () => {
    mockUseConnection.mockReturnValue({ address: ETH_ADDRESS, isConnected: true })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: '1',
        result: [{ hash: '0xtx1', timeStamp: '', isError: '0', value: '0', from: '0x', to: '0x' }],
      }),
    })

    const { result } = renderHook(() => useEthTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data?.length).toBe(1))
    expect(result.current.data![0].timestamp).toBeNull()
  })

  it('throws on network error', async () => {
    mockUseConnection.mockReturnValue({ address: ETH_ADDRESS, isConnected: true })
    global.fetch = vi.fn().mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useEthTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('passes page and pageSize as query params', async () => {
    mockUseConnection.mockReturnValue({ address: ETH_ADDRESS, isConnected: true })
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: '1', result: [] }),
    })
    global.fetch = mockFetch

    renderHook(() => useEthTransactions(2, 5), { wrapper: createWrapper() })
    await waitFor(() => expect(mockFetch).toHaveBeenCalled())

    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('page=2')
    expect(url).toContain('offset=5')
  })
})
