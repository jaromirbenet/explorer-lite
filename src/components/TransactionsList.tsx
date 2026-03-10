import { Box, Heading, Spinner, Text } from '@chakra-ui/react'
import { useTransactions } from '../hooks/useTransactions'

const TransactionsList = () => {
  const { data: transactions = [], isLoading, error } = useTransactions(10)

  if (isLoading) {
    return <Spinner data-testid="transactions-loading" />
  }

  if (error) {
    return (
      <Box color="red.400">
        <Text>Error loading transactions</Text>
      </Box>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Box>
        <Text>Connect your wallet to view transactions</Text>
      </Box>
    )
  }

  return (
    <Box bg="gray.800" p={6} borderRadius="md">
      <Heading size="md" mb={4}>
        Recent Transactions
      </Heading>

      {transactions.length === 0 ? (
        <Text>No transactions found</Text>
      ) : (
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
                <strong>Date:</strong>{' '}
                {tx.timestamp
                  ? new Date(tx.timestamp * 1000).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default TransactionsList
