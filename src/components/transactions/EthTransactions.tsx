import { Link, Spinner, Text, VStack } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useConnection } from 'wagmi'
import { useEthTransactions } from '../../hooks/useEthTransactions'
import { CHAIN_CONFIGS } from '../chain-card/ChainCard'
import { TxRow } from './TxRow'

export const EthTransactions = () => {
  const { address } = useConnection()
  const cfg = CHAIN_CONFIGS.ETH
  const { data: txs, isLoading } = useEthTransactions(5)

  if (!address) return <Text textStyle="muted" mt={2}>Connect Ethereum wallet</Text>
  if (isLoading) return <Spinner size="sm" color={cfg.accentColor} mt={2} />
  if (!txs?.length) return <Text textStyle="muted" mt={2}>No transactions</Text>

  return (
    <VStack align="stretch" spacing={1.5}>
      {txs.map((tx) => (
        <TxRow
          key={tx.hash}
          hash={tx.hash}
          date={tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleDateString() : undefined}
          status={tx.type === 'Success' ? 'confirmed' : 'failed'}
          explorerUrl={`https://etherscan.io/tx/${tx.hash}`}
          accentColor={cfg.accentColor}
        />
      ))}
      <Link href={`https://etherscan.io/address/${address}`} isExternal fontSize="xs" color="brand.textMuted" _hover={{ color: cfg.accentLight }} mt={1}>
        View all on Etherscan <ExternalLinkIcon mx={1} />
      </Link>
    </VStack>
  )
}
