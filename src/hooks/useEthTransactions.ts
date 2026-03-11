import { useQuery } from '@tanstack/react-query'
import { useConnection } from 'wagmi'

export interface EthTransaction {
  hash: string
  timestamp: number | null
  type: 'Success' | 'Failed'
  value: string // in ETH
  from: string
  to: string
}

export const useEthTransactions = (page = 1, pageSize = 10) => {
  const { address: ethAddress, isConnected } = useConnection()

  return useQuery<EthTransaction[]>({
    queryKey: ['eth-transactions', ethAddress, page, pageSize],
    queryFn: async () => {
      if (!ethAddress) return []

      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${ethAddress}&page=${page}&offset=${pageSize}&sort=desc&apikey=`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Etherscan request failed')

      const data = await response.json()

      if (data.status !== '1') return []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data.result as any[]).map((tx) => ({
        hash: tx.hash as string,
        timestamp: tx.timeStamp ? parseInt(tx.timeStamp as string) : null,
        type: tx.isError === '0' ? ('Success' as const) : ('Failed' as const),
        value: (parseInt(tx.value as string) / 1e18).toFixed(6),
        from: tx.from as string,
        to: tx.to as string,
      }))
    },
    enabled: isConnected && !!ethAddress,
    staleTime: 30000,
    refetchInterval: 120000,
  })
}
