import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBtcTransactions } from '../useBtcTransactions'
import { useBitcoin } from '../../contexts/BitcoinContext'

vi.mock('../../contexts/BitcoinContext')

const mockUseBitcoin = useBitcoin as ReturnType<typeof vi.fn>
const MY_ADDRESS = 'bc1qpayment'

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useBtcTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('is disabled and returns no data when no BTC address', () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: null })
    const { result } = renderHook(() => useBtcTransactions(), { wrapper: createWrapper() })
    expect(result.current.data).toBeUndefined()
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('calculates received value correctly for incoming transaction', async () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: MY_ADDRESS })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{
        txid: 'tx1',
        status: { confirmed: true, block_time: 1700000000 },
        vout: [{ scriptpubkey_address: MY_ADDRESS, value: 10000000 }], // 0.1 BTC received
        vin: [],
      }]),
    })

    const { result } = renderHook(() => useBtcTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data?.length).toBe(1))

    const tx = result.current.data![0]
    expect(tx.txid).toBe('tx1')
    expect(tx.type).toBe('Confirmed')
    expect(tx.value).toBeCloseTo(0.1)
    expect(tx.timestamp).toBe(1700000000)
  })

  it('calculates sent value correctly for outgoing transaction', async () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: MY_ADDRESS })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{
        txid: 'tx2',
        status: { confirmed: false },
        vin: [{ prevout: { scriptpubkey_address: MY_ADDRESS, value: 5000000 } }], // sent 0.05 BTC
        vout: [],
      }]),
    })

    const { result } = renderHook(() => useBtcTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data?.length).toBe(1))

    const tx = result.current.data![0]
    expect(tx.type).toBe('Pending')
    expect(tx.value).toBeCloseTo(-0.05)
    expect(tx.timestamp).toBeNull()
  })

  it('calculates net value for mixed transaction', async () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: MY_ADDRESS })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{
        txid: 'tx3',
        status: { confirmed: true, block_time: 1700000000 },
        vout: [{ scriptpubkey_address: MY_ADDRESS, value: 3000000 }],  // received 0.03 BTC
        vin: [{ prevout: { scriptpubkey_address: MY_ADDRESS, value: 8000000 } }], // sent 0.08 BTC
      }]),
    })

    const { result } = renderHook(() => useBtcTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data?.length).toBe(1))
    expect(result.current.data![0].value).toBeCloseTo(-0.05) // net: received - sent
  })

  it('throws on API error', async () => {
    mockUseBitcoin.mockReturnValue({ btcAddress: MY_ADDRESS })
    global.fetch = vi.fn().mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useBtcTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
