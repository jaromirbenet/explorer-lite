import { useQuery } from '@tanstack/react-query'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

export interface Transaction {
  signature: string
  timestamp: number | null
  type: string
}

export const useSolTransactions = (limit = 10) => {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()

  return useQuery<Transaction[]>({
    queryKey: ['transactions', publicKey?.toString(), limit],
    queryFn: async () => {
      if (!publicKey || !connected) return []

      try {
        const sigs = await connection.getSignaturesForAddress(publicKey, {
          limit,
        })

        return sigs.map((sig) => ({
          signature: sig.signature,
          timestamp: sig.blockTime ?? null,
          type: sig.err ? 'Failed' : 'Success',
        }))
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        throw new Error('Failed to fetch transactions')
      }
    },
    enabled: !!publicKey && connected,
    staleTime: 30000, // 30 sec
    refetchInterval: 120000, // Refetch every 2 min
  })
}
