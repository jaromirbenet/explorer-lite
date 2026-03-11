import { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection, useBalance, useConnect, useDisconnect, useConnectors } from 'wagmi'
import { formatEther } from 'viem'
import { ChainCard } from './ChainCard'
import { useBitcoin } from '../../contexts/BitcoinContext'
import { useSolAccountInfo } from '../../hooks/useSolAccountInfo'
import { useBtcAccountInfo } from '../../hooks/useBtcAccountInfo'

export const ChainCards = () => {
  const { connected } = useWallet()
  const { btcAddress, connectBtc, isBtcAvailable, btcConnecting, disconnectBtc } = useBitcoin()
  const { data: solData, isLoading: solLoading } = useSolAccountInfo()
  const { data: btcData, isLoading: btcLoading } = useBtcAccountInfo()

  const { address: ethAddress, isConnected: ethConnected } = useConnection()
  const { data: ethBalance, isLoading: ethLoading } = useBalance({ address: ethAddress })
  const { mutate: ethConnect, isPending: ethConnecting } = useConnect()
  const ethConnectors = useConnectors()
  const { mutate: ethDisconnect } = useDisconnect()

  // Auto-connect BTC when Solana connects
  useEffect(() => {
    if (connected && isBtcAvailable) connectBtc().catch(() => {})
  }, [connected, isBtcAvailable, connectBtc])

  return (
    <Flex gap={4} w="full" flexWrap="wrap" justify="center">
      <ChainCard
        chain="SOL"
        address={connected ? (solData?.address ?? null) : null}
        balance={solData?.balance ?? null}
        isLoading={solLoading}
        delay={0}
      />
      <ChainCard
        chain="ETH"
        address={ethAddress ?? null}
        balance={ethBalance ? parseFloat(formatEther(ethBalance.value)) : null}
        isLoading={ethLoading}
        isConnecting={ethConnecting}
        isAvailable={true}
        onConnect={() => ethConnectors[0] && ethConnect({ connector: ethConnectors[0] })}
        onDisconnect={ethConnected ? () => ethDisconnect() : undefined}
        delay={0.1}
      />
      <ChainCard
        chain="BTC"
        address={btcAddress}
        balance={btcData?.balance ?? null}
        isLoading={btcLoading}
        isConnecting={btcConnecting}
        isAvailable={isBtcAvailable}
        onConnect={connectBtc}
        onDisconnect={btcAddress ? disconnectBtc : undefined}
        delay={0.2}
      />
    </Flex>
  )
}
