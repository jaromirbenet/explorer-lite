import { Box, Heading, Spinner, Text } from '@chakra-ui/react'
import { useTransactions } from '../hooks/useTransactions'
import TransactionsContent from './TransactionsContent'

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

      <TransactionsContent transactions={transactions} />
    </Box>
  )
}

export default TransactionsList
