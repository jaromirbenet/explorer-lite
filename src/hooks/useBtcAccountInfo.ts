import { useQuery } from '@tanstack/react-query'
import { useBitcoin } from '../contexts/BitcoinContext'

export interface BtcAccountData {
  address: string
  balance: number // in BTC
  txCount: number
}

export const useBtcAccountInfo = () => {
  const { btcAddress } = useBitcoin()

  return useQuery<BtcAccountData | null>({
    queryKey: ['btc-account', btcAddress],
    queryFn: async () => {
      if (!btcAddress) return null

      const response = await fetch(`https://blockstream.info/api/address/${btcAddress}`)
      if (!response.ok) throw new Error('Blockstream request failed')

      const data = await response.json()

      const funded: number = data.chain_stats.funded_txo_sum
      const spent: number = data.chain_stats.spent_txo_sum
      const balance = (funded - spent) / 1e8

      return {
        address: btcAddress,
        balance,
        txCount: data.chain_stats.tx_count,
      }
    },
    enabled: !!btcAddress,
    staleTime: 30000,
    refetchInterval: 60000,
  })
}
