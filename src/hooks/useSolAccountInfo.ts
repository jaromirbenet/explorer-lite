import { useQuery } from '@tanstack/react-query'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export interface AccountData {
  address: string
  balance: number
}

export const useSolAccountInfo = () => {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()

  return useQuery<AccountData | null>({
    queryKey: ['account', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !connected) return null

      try {
        const balance = await connection.getBalance(publicKey)
        return {
          address: publicKey.toString(),
          balance: balance / LAMPORTS_PER_SOL,
        }
      } catch (error) {
        console.error('Failed to fetch account data:', error)
        throw new Error('Failed to fetch account data')
      }
    },
    enabled: !!publicKey && connected,
    staleTime: 30000, // 30 sec
    refetchInterval: 60000, // Refetch every 60 sec
  })
}
