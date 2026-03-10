import { Box, Heading, Text, Spinner, VStack } from '@chakra-ui/react'
import { useAccountInfo } from '../hooks/useAccountInfo'

const AccountInfo = () => {
  const { data: accountData, isLoading, error } = useAccountInfo()



  if (isLoading) {
    return <Spinner data-testid="account-loading" />
  }

  if (error) {
    return (
      <Box color="red.400">
        <Text>Error loading account data</Text>
      </Box>
    )
  }

    if (!accountData) {
    return (
      <Box>
        <Text>Connect your wallet to view account information</Text>
      </Box>
    )
  }

  return (
    <Box bg="gray.800" p={6} borderRadius="md" data-testid="account-info">
      <VStack align="start" gap={4}>
        <Heading size="md">Account Information</Heading>
        <Box>
          <Text fontSize="sm" color="gray.400">
            Address
          </Text>
          <Text fontSize="sm" wordBreak="break-all" data-testid="account-address">
            {accountData.address}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400">
            Balance
          </Text>
          <Text fontSize="lg" fontWeight="bold" data-testid="account-balance">
            {accountData.balance.toFixed(2)} SOL
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default AccountInfo
