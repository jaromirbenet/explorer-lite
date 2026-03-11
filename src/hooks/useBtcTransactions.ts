import { useQuery } from '@tanstack/react-query'
import { useBitcoin } from '../contexts/BitcoinContext'

export interface BtcTransaction {
  txid: string
  timestamp: number | null
  type: 'Confirmed' | 'Pending'
  value: number // net value in BTC (positive = received, negative = sent)
}

export const useBtcTransactions = () => {
  const { btcAddress } = useBitcoin()

  return useQuery<BtcTransaction[]>({
    queryKey: ['btc-transactions', btcAddress],
    queryFn: async () => {
      if (!btcAddress) return []

      const response = await fetch(
        `https://blockstream.info/api/address/${btcAddress}/txs`,
      )
      if (!response.ok) throw new Error('Blockstream transactions request failed')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = await response.json()

      return data.map((tx) => {
        const received: number = tx.vout
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((o: any) => o.scriptpubkey_address === btcAddress)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .reduce((sum: number, o: any) => sum + (o.value as number), 0)

        const sent: number = tx.vin
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((i: any) => i.prevout?.scriptpubkey_address === btcAddress)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .reduce((sum: number, i: any) => sum + ((i.prevout?.value as number) ?? 0), 0)

        return {
          txid: tx.txid as string,
          timestamp: (tx.status?.block_time as number) ?? null,
          type: tx.status?.confirmed ? ('Confirmed' as const) : ('Pending' as const),
          value: (received - sent) / 1e8,
        }
      })
    },
    enabled: !!btcAddress,
    staleTime: 30000,
    refetchInterval: 120000,
  })
}


