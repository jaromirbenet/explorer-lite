import { Link, Spinner, Text, VStack } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useBitcoin } from '../../contexts/BitcoinContext'
import { useBtcTransactions } from '../../hooks/useBtcTransactions'
import { CHAIN_CONFIGS } from '../chain-card/ChainCard'
import { TxRow } from './TxRow'

export const BtcTransactions = () => {
  const { btcAddress } = useBitcoin()
  const cfg = CHAIN_CONFIGS.BTC
  const { data: txs, isLoading } = useBtcTransactions()

  if (!btcAddress) return <Text textStyle="muted" mt={2}>Connect Bitcoin wallet</Text>
  if (isLoading) return <Spinner size="sm" color={cfg.accentColor} mt={2} />
  if (!txs?.length) return <Text textStyle="muted" mt={2}>No transactions</Text>

  return (
    <VStack align="stretch" spacing={1.5}>
      {txs.map((tx) => (
        <TxRow
          key={tx.txid}
          hash={tx.txid}
          date={tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleDateString() : undefined}
          status={tx.type === 'Confirmed' ? 'confirmed' : 'pending'}
          explorerUrl={`https://blockstream.info/tx/${tx.txid}`}
          accentColor={cfg.accentColor}
        />
      ))}
      <Link href={`https://blockstream.info/address/${btcAddress}`} isExternal fontSize="xs" color="brand.textMuted" _hover={{ color: cfg.accentLight }} mt={1}>
        View all on Blockstream <ExternalLinkIcon mx={1} />
      </Link>
    </VStack>
  )
}
