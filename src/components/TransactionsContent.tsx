import { Box, Text } from '@chakra-ui/react'
import type { Transaction } from '../hooks/useTransactions'
import TransactionDate from './TransactionDate'

interface TransactionsContentProps {
  transactions: Transaction[]
}

const TransactionsContent = ({ transactions }: TransactionsContentProps) => {
  if (!transactions || transactions.length === 0) {
    return <Text>No transactions found</Text>
  }

  return (
    <Box overflowX="auto" data-testid="transactions-table">
      <Text fontSize="sm" color="gray.300">
        Total transactions: {transactions.length}
      </Text>
      {transactions.map((tx) => (
        <Box
          key={tx.signature}
          p={3}
          mb={2}
          bg="gray.700"
          borderRadius="md"
          fontSize="sm"
        >
          <Text color="gray.400">
            <strong>Signature:</strong> {tx.signature.slice(0, 20)}...
          </Text>
          <Text color="gray.400">
            <strong>Type:</strong> {tx.type}
          </Text>
          <Text color="gray.400">
            <strong>Date:</strong> <TransactionDate timestamp={tx.timestamp} />
          </Text>
        </Box>
      ))}
    </Box>
  )
}

export default TransactionsContent
