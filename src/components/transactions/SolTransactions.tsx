import { Link, Spinner, Text, VStack } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useSolTransactions } from '../../hooks/useSolTransactions'
import { CHAIN_CONFIGS } from '../chain-card/ChainCard'
import { TxRow } from './TxRow'

export const SolTransactions = () => {
  const cfg = CHAIN_CONFIGS.SOL
  const { data: txs, isLoading } = useSolTransactions(5)

  if (isLoading) return <Spinner size="sm" color={cfg.accentColor} mt={2} />
  if (!txs?.length) return <Text textStyle="muted" mt={2}>No transactions</Text>

  return (
    <VStack align="stretch" spacing={1.5}>
      {txs.map((tx) => (
        <TxRow
          key={tx.signature}
          hash={tx.signature}
          date={tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleDateString() : undefined}
          status={tx.type === 'Success' ? 'confirmed' : 'failed'}
          explorerUrl={`${cfg.explorerBase}${tx.signature}`}
          accentColor={cfg.accentColor}
        />
      ))}
      <Link href={cfg.explorerBase} isExternal fontSize="xs" color="brand.textMuted" _hover={{ color: cfg.accentLight }} mt={1}>
        View all on Solscan <ExternalLinkIcon mx={1} />
      </Link>
    </VStack>
  )
}
